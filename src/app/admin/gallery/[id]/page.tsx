'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import ImageUpload from '@/components/ui/ImageUpload';
import toast from 'react-hot-toast';

export default function EditGalleryItemPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    description: '',
    mediaType: 'image',
    image: '',
    videoUrl: '',
    thumbnail: '',
    order: 0,
    isFeatured: false,
    isActive: true,
  });

  useEffect(() => {
    fetchGalleryItem();
  }, []);

  const fetchGalleryItem = async () => {
    try {
      const response = await fetch(`/api/gallery`);
      if (response.ok) {
        const data = await response.json();
        const item = data.find((i: any) => i.id === params.id);
        if (item) {
          setFormData(item);
        }
      }
    } catch (error) {
      toast.error('Failed to load gallery item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      const response = await fetch(`/api/gallery`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: params.id }),
      });

      if (response.ok) {
        toast.success('Gallery item deleted successfully!');
        router.push('/admin/gallery');
        router.refresh();
      } else {
        toast.error('Failed to delete gallery item');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
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
        <h1 className="text-3xl font-bold text-gray-900">Edit Gallery Item</h1>
        <p className="text-gray-600 mt-2">Update gallery item details</p>
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

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Media Type
              </label>
              <select
                name="mediaType"
                value={formData.mediaType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            {formData.mediaType === 'image' ? (
              <ImageUpload
                label="Image"
                value={formData.image || ''}
                onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                folder="gallery"
              />
            ) : (
              <>
                <Input
                  label="YouTube Video URL"
                  name="videoUrl"
                  value={formData.videoUrl || ''}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <ImageUpload
                  label="Thumbnail (optional - auto-generated for YouTube videos)"
                  value={formData.thumbnail || ''}
                  onChange={(url) => setFormData((prev) => ({ ...prev, thumbnail: url }))}
                  folder="gallery"
                />
              </>
            )}

            <Input
              label="Caption"
              name="caption"
              value={formData.caption || ''}
              onChange={handleChange}
            />

            <div>
              <Textarea
                label="Description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={6}
                placeholder="Detailed description (line breaks will be preserved)"
              />
              <p className="text-xs text-gray-500 mt-1">
                <i className="fas fa-info-circle mr-1" />
                Tip: Press Enter to add line breaks. They will be preserved in the display.
              </p>
            </div>

            <Input
              label="Display Order"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
            />

            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                  Featured
                </label>
              </div>

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
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                disabled={isLoading}
                onClick={async () => {
                  if (isLoading) return;
                  
                  setIsLoading(true);
                  try {
                    const response = await fetch(`/api/gallery`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: params.id, ...formData }),
                    });

                    if (response.ok) {
                      toast.success('Gallery item updated successfully!');
                      setTimeout(() => {
                        router.push('/admin/gallery');
                        router.refresh();
                      }, 500);
                    } else {
                      toast.error('Failed to update gallery item');
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
                  'Update Gallery Item'
                )}
              </button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                className="ml-auto bg-red-50 text-red-600 hover:bg-red-100"
              >
                <i className="fas fa-trash mr-2" />
                Delete
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </AdminLayout>
  );
}

