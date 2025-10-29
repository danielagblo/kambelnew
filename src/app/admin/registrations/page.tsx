'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardBody } from '@/components/ui/Card';
import toast from 'react-hot-toast';

interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  company: string | null;
  experienceYears: number | null;
  motivation: string | null;
  subscribeNewsletter: boolean;
  status: string;
  createdAt: string;
  masterclass: {
    title: string;
    date: string;
  } | null;
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMasterclass, setSelectedMasterclass] = useState<string>('all');

  useEffect(() => {
    fetchRegistrations();
  }, [selectedMasterclass]);

  const fetchRegistrations = async () => {
    try {
      const url = selectedMasterclass === 'all' 
        ? '/api/masterclasses/registrations'
        : `/api/masterclasses/registrations?masterclassId=${selectedMasterclass}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data);
      }
    } catch (error) {
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return;

    try {
      const response = await fetch('/api/masterclasses/registrations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        toast.success('Registration deleted successfully!');
        fetchRegistrations();
      } else {
        toast.error('Failed to delete registration');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        <h1 className="text-3xl font-bold text-gray-900">Masterclass Registrations</h1>
        <p className="text-gray-600 mt-2">
          View and manage all masterclass registrations ({registrations.length} total)
        </p>
      </div>

      {/* Registrations List */}
      <div className="space-y-4">
        {registrations.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <i className="fas fa-user-graduate text-6xl text-gray-300 mb-4" />
                <p className="text-xl text-gray-500">No registrations yet</p>
              </div>
            </CardBody>
          </Card>
        ) : (
          registrations.map((registration) => (
            <Card key={registration.id}>
              <CardBody>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Personal Info */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      <i className="fas fa-user text-primary-600 mr-2" />
                      Personal Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Name:</span>
                        <p className="text-gray-900">
                          {registration.firstName} {registration.lastName}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Email:</span>
                        <p className="text-gray-900">{registration.email}</p>
                      </div>
                      {registration.phone && (
                        <div>
                          <span className="font-semibold text-gray-700">Phone:</span>
                          <p className="text-gray-900">{registration.phone}</p>
                        </div>
                      )}
                      {registration.company && (
                        <div>
                          <span className="font-semibold text-gray-700">Company:</span>
                          <p className="text-gray-900">{registration.company}</p>
                        </div>
                      )}
                      {registration.experienceYears !== null && (
                        <div>
                          <span className="font-semibold text-gray-700">Experience:</span>
                          <p className="text-gray-900">{registration.experienceYears} years</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle Column - Masterclass Info */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      <i className="fas fa-chalkboard-teacher text-primary-600 mr-2" />
                      Masterclass Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      {registration.masterclass && (
                        <>
                          <div>
                            <span className="font-semibold text-gray-700">Title:</span>
                            <p className="text-gray-900">{registration.masterclass.title}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Date:</span>
                            <p className="text-gray-900">
                              {formatDate(registration.masterclass.date)}
                            </p>
                          </div>
                        </>
                      )}
                      <div>
                        <span className="font-semibold text-gray-700">Registered:</span>
                        <p className="text-gray-900">{formatDate(registration.createdAt)}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Status:</span>
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            registration.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : registration.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {registration.status}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Newsletter:</span>
                        <p className="text-gray-900">
                          {registration.subscribeNewsletter ? 'Subscribed' : 'Not subscribed'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Motivation & Actions */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      <i className="fas fa-comment-alt text-primary-600 mr-2" />
                      Additional Info
                    </h3>
                    {registration.motivation ? (
                      <div className="mb-4">
                        <span className="font-semibold text-gray-700 text-sm">Motivation:</span>
                        <p className="text-sm text-gray-900 mt-1 bg-gray-50 p-3 rounded">
                          {registration.motivation}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mb-4">No motivation provided</p>
                    )}

                    <button
                      onClick={() => handleDelete(registration.id)}
                      className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-600 focus:ring-red-500"
                    >
                      <i className="fas fa-trash mr-2" />
                      Delete Registration
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  );
}

