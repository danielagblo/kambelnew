import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

async function getServices() {
  try {
    return await prisma.consultancyService.findMany({
      include: {
        features: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Consultancy Services</h1>
          <p className="text-gray-600 mt-2">Manage your consulting services</p>
        </div>
        <Link href="/admin/services/new">
          <Button>
            <i className="fas fa-plus mr-2" />
            Add Service
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {services.length === 0 ? (
          <Card>
            <CardBody>
              <p className="text-center text-gray-500 py-8">
                No services found. Add your first service!
              </p>
            </CardBody>
          </Card>
        ) : (
          services.map((service) => (
            <Card key={service.id}>
              <CardBody>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <i className={`${service.icon} text-2xl text-primary-600`} />
                      <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          service.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{service.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="capitalize">
                        <i className="fas fa-tag mr-1" />
                        {service.serviceType}
                      </span>
                      <span>
                        <i className="fas fa-list mr-1" />
                        {service.features.length} features
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/admin/services/${service.id}`}
                    className="ml-4 text-primary-600 hover:text-primary-900"
                  >
                    <i className="fas fa-edit text-xl" />
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  );
}

