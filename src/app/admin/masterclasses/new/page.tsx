'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import ImageUpload from '@/components/ui/ImageUpload';
import toast from 'react-hot-toast';

export default function NewMasterclassPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: 'Moses Agbesi Katamani',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Masterclass</h1>
        <p className="text-gray-600 mt-2">Create a new masterclass session</p>
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
              placeholder="Enter masterclass title"
            />

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
              placeholder="Enter masterclass description"
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
                placeholder="e.g., 2 hours"
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
              value={formData.coverImage}
              onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
              folder="masterclasses"
            />

            <Input
              label="YouTube Video URL (for recorded sessions)"
              name="videoUrl"
              value={formData.videoUrl}
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
                    const response = await fetch('/api/masterclasses', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(formData),
                    });

                    if (response.ok) {
                      toast.success('Masterclass created successfully!');
                      setTimeout(() => {
                        router.push('/admin/masterclasses');
                        router.refresh();
                      }, 500);
                    } else {
                      toast.error('Failed to create masterclass');
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
                    Creating...
                  </>
                ) : (
                  'Create Masterclass'
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

