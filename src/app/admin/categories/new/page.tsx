'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import toast from 'react-hot-toast';

export default function NewCategoryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error('Category name is required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Category created successfully!');
        setTimeout(() => {
          router.push('/admin/categories');
          router.refresh();
        }, 500);
      } else {
        const data = await response.json().catch(() => ({ error: 'Failed to create category' }));
        toast.error(data.error || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Category</h1>
        <p className="text-gray-600 mt-2">Create a new publication category</p>
      </div>

      <Card>
        <CardBody>
          <form className="space-y-6">
            <Input
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter category name (e.g., Career Development)"
            />

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Brief description of this category (optional)"
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

            <div className="flex space-x-4">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleSubmit}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Category'
                )}
              </button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </AdminLayout>
  );
}

