'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardBody } from '@/components/ui/Card';
import ImageUpload from '@/components/ui/ImageUpload';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Move dynamic import outside component to prevent re-creation
const EditorClient = dynamic(() => import('@/app/EditorClient'), { ssr: false });

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    coverImage: '',
    isPublished: false,
  });

  const fetchPost = useCallback(async () => {
    try {
      const response = await fetch(`/api/blog?id=${params.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.id) {
          setFormData(data);
        } else {
          toast.error('Blog post not found');
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to load blog post' }));
        toast.error(errorData.error || 'Failed to load blog post');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast.error('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);


  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const response = await fetch(`/api/blog`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: params.id }),
      });

      if (response.ok) {
        toast.success('Blog post deleted successfully!');
        router.push('/admin/blog');
        router.refresh();
      } else {
        toast.error('Failed to delete blog post');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleChange = useCallback((e: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // EditorClient may call onChange with a string (the editor content),
    // while regular inputs/textareas emit ChangeEvent. Handle both cases.
    if (typeof e === 'string') {
      setFormData((prev) => ({
        ...prev,
        content: e,
      }));
      return;
    }

    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <i className="fas fa-spinner fa-spin text-4xl text-primary-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
        <p className="text-gray-600 mt-2">Update blog post details</p>
      </div>

      <Card>
        <CardBody>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <Input
              label="Author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />

            <Textarea
              label="Excerpt"
              name="excerpt"
              value={formData.excerpt || ''}
              onChange={handleChange}
              rows={3}
            />

            <EditorClient label="Content" name="content" value={formData.content} onChange={handleChange} />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                Published
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                disabled={isLoading}
                onClick={async () => {
                  if (isLoading) return;

                  setIsLoading(true);
                  try {
                    const response = await fetch(`/api/blog`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: params.id, ...formData }),
                    });

                    if (response.ok) {
                      toast.success('Blog post updated successfully!');
                      setTimeout(() => {
                        router.push('/admin/blog');
                        router.refresh();
                      }, 500);
                    } else {
                      const error = await response.json();
                      toast.error(error.error || 'Failed to update blog post');
                    }
                  } catch (error) {
                    toast.error('An error occurred');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="inline-flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update Post'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ml-auto bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-600 focus:ring-red-500"
              >
                <i className="fas fa-trash mr-2" />
                Delete
              </button>
            </div>

            <ImageUpload
              label="Cover Image (optional)"
              value={formData.coverImage || ''}
              onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
              folder="blog"
            />

          </form>
        </CardBody>
      </Card>
    </AdminLayout>
  );
}

