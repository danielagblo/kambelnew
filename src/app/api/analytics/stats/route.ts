export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/analytics/stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let days = parseInt(searchParams.get('days') || '30', 10);
    if (!Number.isFinite(days) || days <= 0) days = 30;
    // clamp days to avoid very large queries
    days = Math.min(Math.max(days, 1), 365);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Run independent DB queries in parallel and tolerate partial failures so
    // one failing query doesn't make the whole endpoint return 500.
    const totalPageViewsP = prisma.pageView.count();
    const periodPageViewsP = prisma.pageView.count({ where: { viewedAt: { gte: startDate } } });
    const pageViewsByDayP = prisma.$queryRaw<Array<{ date: string; views: number }>>`
      SELECT
        DATE("viewedAt") as date,
        COUNT(*) as views
      FROM page_views
      WHERE "viewedAt" >= ${startDate}
      GROUP BY DATE("viewedAt")
      ORDER BY DATE("viewedAt") ASC
    `;
    const topPagesP = prisma.pageView.groupBy({
      by: ['path', 'title'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
      where: { viewedAt: { gte: startDate } },
    });
    const viewsByContentTypeP = prisma.pageView.groupBy({
      by: ['contentType'],
      _count: { id: true },
      where: { contentType: { not: null }, viewedAt: { gte: startDate } },
      orderBy: { _count: { id: 'desc' } },
    });

    const blogPostsCountP = prisma.blogPost.count({ where: { isPublished: true } });
    const publicationsCountP = prisma.book.count({ where: { isActive: true } });
    const masterclassesCountP = prisma.masterclass.count({ where: { isActive: true } });
    const servicesCountP = prisma.consultancyService.count({ where: { isActive: true } });
    const contactsCountP = prisma.contactMessage.count();
    const newsletterCountP = prisma.newsletterSubscription.count({ where: { isActive: true } });
    const registrationsCountP = prisma.masterclassRegistration.count();

    const results = await Promise.allSettled([
      totalPageViewsP,
      periodPageViewsP,
      pageViewsByDayP,
      topPagesP,
      viewsByContentTypeP,
      blogPostsCountP,
      publicationsCountP,
      masterclassesCountP,
      servicesCountP,
      contactsCountP,
      newsletterCountP,
      registrationsCountP,
    ]);

    // Map settled results into values or sensible defaults
    const [
      totalPageViewsR,
      periodPageViewsR,
      pageViewsByDayR,
      topPagesR,
      viewsByContentTypeR,
      blogPostsCountR,
      publicationsCountR,
      masterclassesCountR,
      servicesCountR,
      contactsCountR,
      newsletterCountR,
      registrationsCountR,
    ] = results;

    function settledValue<T>(r: PromiseSettledResult<T>, fallback: T): T {
      if (r.status === 'fulfilled') return r.value as T;
      console.error('Analytics query failed (falling back):', (r as any).reason || r);
      return fallback;
    }

    // Helper to coerce BigInt or string counts into JS numbers safely
    const toNumber = (v: any): number => {
      if (typeof v === 'bigint') return Number(v);
      if (typeof v === 'string') {
        const n = parseInt(v, 10);
        return Number.isFinite(n) ? n : 0;
      }
      if (v == null) return 0;
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };

    const totalPageViews = toNumber(settledValue<any>(totalPageViewsR as any, 0));
    const periodPageViews = toNumber(settledValue<any>(periodPageViewsR as any, 0));
    const pageViewsByDayRaw = settledValue<any[]>(pageViewsByDayR as any, []);
    const pageViewsByDay = (pageViewsByDayRaw || []).map((d: any) => ({ date: d.date, views: toNumber(d.views) }));
    const topPagesRaw = settledValue<any[]>(topPagesR as any, []);
    const topPages = topPagesRaw;
    const viewsByContentTypeRaw = settledValue<any[]>(viewsByContentTypeR as any, []);
    const viewsByContentType = viewsByContentTypeRaw;

    const blogPostsCount = settledValue<number>(blogPostsCountR as any, 0);
    const publicationsCount = settledValue<number>(publicationsCountR as any, 0);
    const masterclassesCount = settledValue<number>(masterclassesCountR as any, 0);
    const servicesCount = settledValue<number>(servicesCountR as any, 0);
    const contactsCount = settledValue<number>(contactsCountR as any, 0);
    const newsletterCount = settledValue<number>(newsletterCountR as any, 0);
    const registrationsCount = settledValue<number>(registrationsCountR as any, 0);

    return NextResponse.json({
      totalPageViews,
      periodPageViews,
      pageViewsByDay,
      topPages: (topPages || []).map(page => ({
        path: page.path,
        title: page.title || page.path,
        views: toNumber(page._count?.id),
      })),
      viewsByContentType: (viewsByContentType || []).map(item => ({
        type: item.contentType,
        views: toNumber(item._count?.id),
      })),
      counts: {
        blogPosts: blogPostsCount,
        publications: publicationsCount,
        masterclasses: masterclassesCount,
        services: servicesCount,
        contacts: contactsCount,
        newsletters: newsletterCount,
        registrations: registrationsCount,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics stats:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics stats' }, { status: 500 });
  }
}

