import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

async function getCategories() {
  noStore(); // Ensure this component always fetches fresh data
  try {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: { books: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">Manage publication categories</p>
        </div>
        <Link href="/admin/categories/new">
          <Button>
            <i className="fas fa-plus mr-2" />
            Add Category
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length === 0 ? (
          <Card className="col-span-full">
            <CardBody>
              <p className="text-center text-gray-500 py-8">
                No categories found. Add your first category!
              </p>
            </CardBody>
          </Card>
        ) : (
          categories.map((category) => (
            <Card key={category.id}>
              <CardBody>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                    {category.description && (
                      <p className="text-gray-600 text-sm mt-2">{category.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-3">
                      <span>
                        <i className="fas fa-book mr-1" />
                        {category._count.books} publications
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      category.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                  >
                    <i className="fas fa-edit mr-2" />
                    Edit
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

