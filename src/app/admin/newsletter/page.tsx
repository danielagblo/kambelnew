import { prisma } from '@/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardBody } from '@/components/ui/Card';
import { format } from 'date-fns';

async function getNewsletterSubscribers() {
  noStore(); // Ensure this component always fetches fresh data
  try {
    return await prisma.newsletterSubscription.findMany({
      orderBy: {
        subscribedAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return [];
  }
}

export default async function AdminNewsletterPage() {
  const subscribers = await getNewsletterSubscribers();
  const activeSubscribers = subscribers.filter((s) => s.isActive).length;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Newsletter Subscribers</h1>
        <p className="text-gray-600 mt-2">
          Manage your newsletter subscription list ({activeSubscribers} active)
        </p>
      </div>

      <Card>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscribed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                      No subscribers yet.
                    </td>
                  </tr>
                ) : (
                  subscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {subscriber.email}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            subscriber.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {subscriber.isActive ? 'Active' : 'Unsubscribed'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {format(new Date(subscriber.subscribedAt), 'MMM dd, yyyy')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </AdminLayout>
  );
}

