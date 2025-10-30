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
        DATE(viewedAt) as date,
        COUNT(*) as views
      FROM page_views
      WHERE viewedAt >= ${startDate.toISOString()}
      GROUP BY DATE(viewedAt)
      ORDER BY DATE(viewedAt) ASC
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

    const totalPageViews = settledValue<number>(totalPageViewsR as any, 0);
    const periodPageViews = settledValue<number>(periodPageViewsR as any, 0);
    const pageViewsByDay = settledValue<Array<{ date: string; views: number }>>(pageViewsByDayR as any, []);
    const topPages = settledValue<any[]>(topPagesR as any, []);
    const viewsByContentType = settledValue<any[]>(viewsByContentTypeR as any, []);

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
      topPages: topPages.map(page => ({
        path: page.path,
        title: page.title || page.path,
        views: page._count?.id || 0,
      })),
      viewsByContentType: viewsByContentType.map(item => ({
        type: item.contentType,
        views: item._count?.id || 0,
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

