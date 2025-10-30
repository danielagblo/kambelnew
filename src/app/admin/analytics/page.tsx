'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

interface AnalyticsStats {
  totalPageViews: number;
  periodPageViews: number;
  pageViewsByDay: Array<{ date: string; views: number }>;
  topPages: Array<{ path: string; title: string; views: number }>;
  viewsByContentType: Array<{ type: string; views: number }>;
  counts: {
    blogPosts: number;
    publications: number;
    masterclasses: number;
    services: number;
    contacts: number;
    newsletters: number;
    registrations: number;
  };
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    fetchStats();
  }, [period]);
  
  // Refresh stats when period changes
  const handleRefresh = () => {
    setLoading(true);
    fetchStats();
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/analytics/stats?days=${period}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error('Failed to fetch analytics:', response.status);
        // Show default empty stats on error
        setStats({
          totalPageViews: 0,
          periodPageViews: 0,
          pageViewsByDay: [],
          topPages: [],
          viewsByContentType: [],
          counts: {
            blogPosts: 0,
            publications: 0,
            masterclasses: 0,
            services: 0,
            contacts: 0,
            newsletters: 0,
            registrations: 0,
          },
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Show default empty stats on error
      setStats({
        totalPageViews: 0,
        periodPageViews: 0,
        pageViewsByDay: [],
        topPages: [],
        viewsByContentType: [],
        counts: {
          blogPosts: 0,
          publications: 0,
          masterclasses: 0,
          services: 0,
          contacts: 0,
          newsletters: 0,
          registrations: 0,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <i className="fas fa-spinner fa-spin text-4xl text-primary-600" />
        </div>
      </AdminLayout>
    );
  }

  const contentTypeLabels: { [key: string]: string } = {
    blog: 'Blog Posts',
    publication: 'Publications',
    masterclass: 'Masterclasses',
    service: 'Services',
    page: 'Pages',
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your site performance and visitor statistics</p>
          </div>
          <div className="flex gap-4">
            <select
              value={period}
              onChange={(e) => setPeriod(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-sync-alt mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <i className="fas fa-eye text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Page Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPageViews.toLocaleString()}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <i className="fas fa-calendar text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Period Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.periodPageViews.toLocaleString()}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <i className="fas fa-envelope text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Contact Messages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.counts.contacts.toLocaleString()}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <i className="fas fa-user-graduate text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Registrations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.counts.registrations.toLocaleString()}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Blog Posts</p>
              <i className="fas fa-blog text-primary-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.counts.blogPosts}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Publications</p>
              <i className="fas fa-book text-primary-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.counts.publications}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Masterclasses</p>
              <i className="fas fa-graduation-cap text-primary-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.counts.masterclasses}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Newsletter</p>
              <i className="fas fa-newspaper text-primary-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.counts.newsletters}</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Page Views by Day */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold flex items-center">
              <i className="fas fa-chart-line mr-2 text-primary-600" />
              Page Views Trend
            </h2>
          </CardHeader>
          <CardBody>
            {stats.pageViewsByDay.length > 0 ? (
              <div className="space-y-2">
                {stats.pageViewsByDay.slice(-14).map((day) => (
                  <div key={day.date} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {new Date(day.date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center flex-1 ml-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{
                            width: `${(day.views / Math.max(...stats.pageViewsByDay.map(d => d.views))) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                        {day.views}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </CardBody>
        </Card>

        {/* Views by Content Type */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold flex items-center">
              <i className="fas fa-layer-group mr-2 text-primary-600" />
              Views by Content Type
            </h2>
          </CardHeader>
          <CardBody>
            {stats.viewsByContentType.length > 0 ? (
              <div className="space-y-4">
                {stats.viewsByContentType.map((item) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      {contentTypeLabels[item.type] || item.type}
                    </span>
                    <div className="flex items-center flex-1 ml-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-accent-600 h-2 rounded-full"
                          style={{
                            width: `${(item.views / Math.max(...stats.viewsByContentType.map(i => i.views))) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                        {item.views}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center">
            <i className="fas fa-fire mr-2 text-primary-600" />
            Top Pages
          </h2>
        </CardHeader>
        <CardBody>
          {stats.topPages.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Path
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.topPages.map((page, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {page.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {page.path}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                        {page.views.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No page views yet</p>
          )}
        </CardBody>
      </Card>
    </AdminLayout>
  );
}

