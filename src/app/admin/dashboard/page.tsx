import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

async function getDashboardStats() {
  try {
    const [
      totalPublications,
      totalServices,
      totalBlogPosts,
      totalMasterclasses,
      totalContacts,
      totalNewsletters,
    ] = await Promise.all([
      prisma.book.count({ where: { isActive: true } }),
      prisma.consultancyService.count({ where: { isActive: true } }),
      prisma.blogPost.count({ where: { isPublished: true } }),
      prisma.masterclass.count({ where: { isActive: true } }),
      prisma.contactMessage.count(),
      prisma.newsletterSubscription.count({ where: { isActive: true } }),
    ]);

    return {
      totalPublications,
      totalServices,
      totalBlogPosts,
      totalMasterclasses,
      totalContacts,
      totalNewsletters,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalPublications: 0,
      totalServices: 0,
      totalBlogPosts: 0,
      totalMasterclasses: 0,
      totalContacts: 0,
      totalNewsletters: 0,
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: 'Publications',
      value: stats.totalPublications,
      icon: 'fa-book',
      color: 'bg-blue-500',
      link: '/admin/publications',
    },
    {
      title: 'Services',
      value: stats.totalServices,
      icon: 'fa-briefcase',
      color: 'bg-green-500',
      link: '/admin/services',
    },
    {
      title: 'Blog Posts',
      value: stats.totalBlogPosts,
      icon: 'fa-blog',
      color: 'bg-purple-500',
      link: '/admin/blog',
    },
    {
      title: 'Masterclasses',
      value: stats.totalMasterclasses,
      icon: 'fa-chalkboard-teacher',
      color: 'bg-yellow-500',
      link: '/admin/masterclasses',
    },
    {
      title: 'Contact Messages',
      value: stats.totalContacts,
      icon: 'fa-envelope',
      color: 'bg-red-500',
      link: '/admin/contacts',
    },
    {
      title: 'Newsletter Subscribers',
      value: stats.totalNewsletters,
      icon: 'fa-users',
      color: 'bg-indigo-500',
      link: '/admin/newsletter',
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, Admin!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title} hover>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <i className={`fas ${stat.icon} text-2xl text-white`} />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Quick Actions</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/publications/new"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors text-center"
            >
              <i className="fas fa-plus-circle text-2xl text-primary-600 mb-2" />
              <p className="font-medium text-gray-900">Add Publication</p>
            </a>
            <a
              href="/admin/blog/new"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors text-center"
            >
              <i className="fas fa-plus-circle text-2xl text-primary-600 mb-2" />
              <p className="font-medium text-gray-900">New Blog Post</p>
            </a>
            <a
              href="/admin/masterclasses/new"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors text-center"
            >
              <i className="fas fa-plus-circle text-2xl text-primary-600 mb-2" />
              <p className="font-medium text-gray-900">Add Masterclass</p>
            </a>
            <a
              href="/admin/gallery/new"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors text-center"
            >
              <i className="fas fa-plus-circle text-2xl text-primary-600 mb-2" />
              <p className="font-medium text-gray-900">Upload to Gallery</p>
            </a>
          </div>
        </CardBody>
      </Card>
    </AdminLayout>
  );
}

