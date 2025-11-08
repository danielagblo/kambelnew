'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardBody } from '@/components/ui/Card';
import ImageUpload from '@/components/ui/ImageUpload';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  description: string | null;
}

export default function EditPublicationPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    pages: 0,
    price: 0,
    coverImage: '',
    purchaseLink: '',
    categoryId: '',
    isActive: true,
  });

  useEffect(() => {
    fetchPublication();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?admin=true');
      if (response.ok) {
        const data = await response.json();
        console.log('Categories loaded:', data.length);
        setCategories(data);
      } else {
        console.error('Failed to fetch categories, response:', response.status);
        toast.error('Failed to load categories');
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchPublication = async () => {
    try {
      const response = await fetch(`/api/publications/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      }
    } catch (error) {
      toast.error('Failed to load publication');
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this publication?')) return;

    try {
      const response = await fetch(`/api/publications/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Publication deleted successfully!');
        router.push('/admin/publications');
        router.refresh();
      } else {
        toast.error('Failed to delete publication');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Edit Publication</h1>
        <p className="text-gray-600 mt-2">Update publication details</p>
      </div>

      <Card>
        <CardBody>
          <form className="space-y-6">
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

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <Textarea
              label="Description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={5}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Pages"
                name="pages"
                type="number"
                value={formData.pages}
                onChange={handleChange}
              />

              <Input
                label="Price ($)"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <Input
              label="Purchase Link"
              name="purchaseLink"
              value={formData.purchaseLink || ''}
              onChange={handleChange}
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active
              </label>
            </div>

            <ImageUpload
              label="Cover Image (optional)"
              value={formData.coverImage || ''}
              onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
              folder="publications"
            />

            {/* Action buttons placed after all form fields and image upload */}
            <div className="flex space-x-4 mt-6">
              <button
                type="button"
                disabled={isLoading}
                onClick={async () => {
                  if (isLoading) return;

                  setIsLoading(true);
                  try {
                    const response = await fetch(`/api/publications/${params.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(formData),
                    });

                    if (response.ok) {
                      toast.success('Publication updated successfully!');
                      setTimeout(() => {
                        router.push('/admin/publications');
                        router.refresh();
                      }, 500);
                    } else {
                      toast.error('Failed to update publication');
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
                  'Update Publication'
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
          </form>
        </CardBody>
      </Card>
    </AdminLayout>
  );
}

