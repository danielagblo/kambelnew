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

interface ServiceFeature {
  id?: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
}

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    serviceType: '',
    description: '',
    coverImage: '',
    icon: '',
    isActive: true,
    order: 0,
  });
  const [features, setFeatures] = useState<ServiceFeature[]>([]);
  const [newFeature, setNewFeature] = useState<ServiceFeature>({
    title: '',
    description: '',
    icon: 'fas fa-check',
    isActive: true,
    order: 0,
  });
  const [showAddFeature, setShowAddFeature] = useState(false);
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);
  const [editingFeature, setEditingFeature] = useState<ServiceFeature | null>(null);

  useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/consultancy?id=${params.id}`);
      if (response.ok) {
        const data = await response.json();
        const service = data.find((s: any) => s.id === params.id);
        if (service) {
          setFormData(service);
          if (service.features) {
            setFeatures(service.features);
          }
        }
      }
    } catch (error) {
      toast.error('Failed to load service');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/consultancy`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: params.id }),
      });

      if (response.ok) {
        toast.success('Service deleted successfully!');
        router.push('/admin/services');
        router.refresh();
      } else {
        toast.error('Failed to delete service');
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

  const handleAddFeature = async () => {
    if (!newFeature.title || !newFeature.description) {
      toast.error('Please fill in all feature fields');
      return;
    }

    try {
      const response = await fetch('/api/consultancy/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newFeature, serviceId: params.id }),
      });

      if (response.ok) {
        const createdFeature = await response.json();
        setFeatures([...features, createdFeature]);
        setNewFeature({ title: '', description: '', icon: 'fas fa-check', isActive: true, order: features.length });
        setShowAddFeature(false);
        toast.success('Feature added successfully!');
      } else {
        toast.error('Failed to add feature');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDeleteFeature = async (featureId: string) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;

    try {
      const response = await fetch('/api/consultancy/features', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: featureId }),
      });

      if (response.ok) {
        setFeatures(features.filter((f) => f.id !== featureId));
        toast.success('Feature deleted successfully!');
      } else {
        toast.error('Failed to delete feature');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleEditFeature = (feature: ServiceFeature) => {
    setEditingFeatureId(feature.id!);
    setEditingFeature({ ...feature });
    setShowAddFeature(false);
  };

  const handleUpdateFeature = async () => {
    if (!editingFeature || !editingFeature.title || !editingFeature.description) {
      toast.error('Please fill in all feature fields');
      return;
    }

    try {
      const response = await fetch('/api/consultancy/features', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFeature),
      });

      if (response.ok) {
        const updatedFeature = await response.json();
        setFeatures(features.map((f) => (f.id === updatedFeature.id ? updatedFeature : f)));
        setEditingFeatureId(null);
        setEditingFeature(null);
        toast.success('Feature updated successfully!');
      } else {
        toast.error('Failed to update feature');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleCancelEdit = () => {
    setEditingFeatureId(null);
    setEditingFeature(null);
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
        <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
        <p className="text-gray-600 mt-2">Update service details</p>
      </div>

      <Card>
        <CardBody>
          <form className="space-y-6">
            <Input
              label="Service Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Service Type
              </label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="career">Career</option>
                <option value="business">Business</option>
                <option value="personal">Personal</option>
                <option value="education">Education</option>
              </select>
            </div>

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
            />

            <ImageUpload
              label="Cover Image"
              value={formData.coverImage || ''}
              onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
              folder="services"
            />

            <Input
              label="Icon Class (Font Awesome)"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
            />

            <Input
              label="Display Order"
              name="order"
              type="number"
              value={formData.order}
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

            <div className="flex space-x-4">
              <button
                type="button"
                disabled={isLoading}
                onClick={async () => {
                  if (isLoading) return;
                  
                  setIsLoading(true);
                  try {
                    const response = await fetch(`/api/consultancy`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: params.id, ...formData }),
                    });

                    if (response.ok) {
                      toast.success('Service updated successfully!');
                      setTimeout(() => {
                        router.push('/admin/services');
                        router.refresh();
                      }, 500);
                    } else {
                      toast.error('Failed to update service');
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
                  'Update Service'
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

      {/* Service Features Section */}
      <Card className="mt-8">
        <CardBody>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Service Features</h2>
              <p className="text-gray-600 mt-1">Manage key features for this service</p>
            </div>
            <Button
              onClick={() => setShowAddFeature(!showAddFeature)}
              variant={showAddFeature ? 'outline' : 'primary'}
            >
              {showAddFeature ? (
                <>
                  <i className="fas fa-times mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <i className="fas fa-plus mr-2" />
                  Add Feature
                </>
              )}
            </Button>
          </div>

          {/* Add Feature Form */}
          {showAddFeature && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-primary-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">New Feature</h3>
              <div className="space-y-4">
                <Input
                  label="Feature Title"
                  value={newFeature.title}
                  onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                  placeholder="Enter feature title"
                />
                <Textarea
                  label="Feature Description"
                  value={newFeature.description}
                  onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                  rows={3}
                  placeholder="Enter feature description"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Icon Class (Font Awesome)"
                    value={newFeature.icon}
                    onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
                    placeholder="fas fa-check"
                  />
                  <Input
                    label="Display Order"
                    type="number"
                    value={newFeature.order}
                    onChange={(e) => setNewFeature({ ...newFeature, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="inline-flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500"
                >
                  <i className="fas fa-plus mr-2" />
                  Add Feature
                </button>
              </div>
            </div>
          )}

          {/* Features List */}
          <div className="space-y-4">
            {features.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No features added yet. Add your first feature!
              </p>
            ) : (
              features
                .sort((a, b) => a.order - b.order)
                .map((feature) => (
                  <div key={feature.id}>
                    {editingFeatureId === feature.id && editingFeature ? (
                      /* Edit Mode */
                      <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Edit Feature</h4>
                        <div className="space-y-4">
                          <Input
                            label="Feature Title"
                            value={editingFeature.title}
                            onChange={(e) => setEditingFeature({ ...editingFeature, title: e.target.value })}
                            placeholder="Enter feature title"
                          />
                          <Textarea
                            label="Feature Description"
                            value={editingFeature.description}
                            onChange={(e) => setEditingFeature({ ...editingFeature, description: e.target.value })}
                            rows={3}
                            placeholder="Enter feature description"
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="Icon Class (Font Awesome)"
                              value={editingFeature.icon}
                              onChange={(e) => setEditingFeature({ ...editingFeature, icon: e.target.value })}
                              placeholder="fas fa-check"
                            />
                            <Input
                              label="Display Order"
                              type="number"
                              value={editingFeature.order}
                              onChange={(e) => setEditingFeature({ ...editingFeature, order: parseInt(e.target.value) || 0 })}
                              placeholder="0"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`edit-active-${feature.id}`}
                              checked={editingFeature.isActive}
                              onChange={(e) => setEditingFeature({ ...editingFeature, isActive: e.target.checked })}
                              className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                            />
                            <label htmlFor={`edit-active-${feature.id}`} className="text-sm font-medium text-gray-700">
                              Active
                            </label>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={handleUpdateFeature}
                              className="inline-flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500"
                            >
                              <i className="fas fa-save mr-2" />
                              Save Changes
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="inline-flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div className="flex items-start justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                        <div className="flex items-start flex-1">
                          <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                            <i className={`${feature.icon} text-primary-600`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                              <span className="text-xs text-gray-500">Order: {feature.order}</span>
                              {feature.isActive && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            type="button"
                            onClick={() => handleEditFeature(feature)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <i className="fas fa-edit" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFeature(feature.id!)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <i className="fas fa-trash" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        </CardBody>
      </Card>
    </AdminLayout>
  );
}

