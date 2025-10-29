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

export default function EditMasterclassPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    date: '',
    duration: '',
    price: 0,
    totalSeats: 30,
    seatsAvailable: 30,
    coverImage: '',
    videoUrl: '',
    isUpcoming: true,
    isActive: true,
  });

  useEffect(() => {
    fetchMasterclass();
  }, []);

  const fetchMasterclass = async () => {
    try {
      const response = await fetch(`/api/masterclasses?id=${params.id}`);
      if (response.ok) {
        const data = await response.json();
        const mc = data.find((m: any) => m.id === params.id);
        if (mc) {
          // Format date for datetime-local input
          const date = new Date(mc.date);
          const formattedDate = date.toISOString().slice(0, 16);
          setFormData({ ...mc, date: formattedDate });
        }
      }
    } catch (error) {
      toast.error('Failed to load masterclass');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this masterclass?')) return;

    try {
      const response = await fetch(`/api/masterclasses`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: params.id }),
      });

      if (response.ok) {
        toast.success('Masterclass deleted successfully!');
        router.push('/admin/masterclasses');
        router.refresh();
      } else {
        toast.error('Failed to delete masterclass');
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
        <h1 className="text-3xl font-bold text-gray-900">Edit Masterclass</h1>
        <p className="text-gray-600 mt-2">Update masterclass details</p>
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

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
            />

            <Input
              label="Instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Date"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleChange}
                required
              />

              <Input
                label="Duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Price ($)"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
              />

              <Input
                label="Total Seats"
                name="totalSeats"
                type="number"
                value={formData.totalSeats}
                onChange={handleChange}
                required
              />

              <Input
                label="Available Seats"
                name="seatsAvailable"
                type="number"
                value={formData.seatsAvailable}
                onChange={handleChange}
                required
              />
            </div>

            <ImageUpload
              label="Cover Image"
              value={formData.coverImage || ''}
              onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
              folder="masterclasses"
            />

            <Input
              label="YouTube Video URL (for recorded sessions)"
              name="videoUrl"
              value={formData.videoUrl || ''}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
            />

            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isUpcoming"
                  checked={formData.isUpcoming}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isUpcoming: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                />
                <label htmlFor="isUpcoming" className="text-sm font-medium text-gray-700">
                  Upcoming
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
                    const response = await fetch(`/api/masterclasses`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: params.id, ...formData }),
                    });

                    if (response.ok) {
                      toast.success('Masterclass updated successfully!');
                      setTimeout(() => {
                        router.push('/admin/masterclasses');
                        router.refresh();
                      }, 500);
                    } else {
                      toast.error('Failed to update masterclass');
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
                  'Update Masterclass'
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

