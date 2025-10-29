import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { format } from 'date-fns';

async function getBlogPosts() {
  noStore(); // Ensure this component always fetches fresh data
  return await prisma.blogPost.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600 mt-2">Manage your blog content</p>
        </div>
        <Link href="/admin/blog/new">
          <Button>
            <i className="fas fa-plus mr-2" />
            Add Post
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No blog posts found. Add your first post!
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{post.title}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{post.author}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            post.isPublished
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {post.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <Link
                          href={`/admin/blog/${post.id}`}
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

