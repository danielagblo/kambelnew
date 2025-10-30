import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { format } from 'date-fns';

async function getMasterclasses() {
  try {
    return await prisma.masterclass.findMany({
      include: {
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  } catch (error) {
    console.error('Error fetching masterclasses:', error);
    return [];
  }
}

export default async function AdminMasterclassesPage() {
  const masterclasses = await getMasterclasses();

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Masterclasses</h1>
          <p className="text-gray-600 mt-2">Manage your masterclass sessions</p>
        </div>
        <Link href="/admin/masterclasses/new">
          <Button>
            <i className="fas fa-plus mr-2" />
            Add Masterclass
          </Button>
        </Link>
      </div>

      <Card>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seats</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registrations</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {masterclasses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No masterclasses found. Add your first masterclass!
                    </td>
                  </tr>
                ) : (
                  masterclasses.map((mc) => (
                    <tr key={mc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{mc.title}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {format(new Date(mc.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">${mc.price}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {mc.seatsAvailable}/{mc.totalSeats}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {mc._count.registrations}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            mc.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {mc.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <Link
                          href={`/admin/masterclasses/${mc.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <i className="fas fa-edit" />
                        </Link>
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

