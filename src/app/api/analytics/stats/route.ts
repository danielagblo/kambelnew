export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/analytics/stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get total page views
    const totalPageViews = await prisma.pageView.count();

    // Get page views in the period
    const periodPageViews = await prisma.pageView.count({
      where: {
        viewedAt: {
          gte: startDate,
        },
      },
    });

    // Get page views by day (last 30 days)
    // Raw SQL must use the actual database column names (snake_case). Prisma model uses camelCase.
    const pageViewsByDay = await prisma.$queryRaw<Array<{ date: string; views: number }>>`
      SELECT
        DATE(viewed_at) as date,
        COUNT(*) as views
      FROM page_views
      WHERE viewed_at >= ${startDate.toISOString()}
      GROUP BY DATE(viewed_at)
      ORDER BY DATE(viewed_at) ASC
    `;

    // Get top pages
    const topPages = await prisma.pageView.groupBy({
      by: ['path', 'title'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
      where: {
        viewedAt: {
          gte: startDate,
        },
      },
    });

    // Get views by content type
    const viewsByContentType = await prisma.pageView.groupBy({
      by: ['contentType'],
      _count: {
        id: true,
      },
      where: {
        contentType: {
          not: null,
        },
        viewedAt: {
          gte: startDate,
        },
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    // Get general counts
    const blogPostsCount = await prisma.blogPost.count({ where: { isPublished: true } });
    const publicationsCount = await prisma.book.count({ where: { isActive: true } });
    const masterclassesCount = await prisma.masterclass.count({ where: { isActive: true } });
    const servicesCount = await prisma.consultancyService.count({ where: { isActive: true } });
    const contactsCount = await prisma.contactMessage.count();
    const newsletterCount = await prisma.newsletterSubscription.count({ where: { isActive: true } });
    const registrationsCount = await prisma.masterclassRegistration.count();

    return NextResponse.json({
      totalPageViews,
      periodPageViews,
      pageViewsByDay,
      topPages: topPages.map(page => ({
        path: page.path,
        title: page.title || page.path,
        views: page._count.id,
      })),
      viewsByContentType: viewsByContentType.map(item => ({
        type: item.contentType,
        views: item._count.id,
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

