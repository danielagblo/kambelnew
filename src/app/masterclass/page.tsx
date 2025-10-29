'use client';

import { useState, FormEvent, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import { Card, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface Masterclass {
  id: string;
  title: string;
  description: string;
  instructor: string;
  date: string;
  duration: string;
  price: number;
  totalSeats: number;
  seatsAvailable: number;
  coverImage: string | null;
  videoUrl: string | null;
  isUpcoming: boolean;
}

export default function MasterclassPage() {
  const [masterclasses, setMasterclasses] = useState<Masterclass[]>([]);
  const [selectedMasterclass, setSelectedMasterclass] = useState<Masterclass | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    experienceYears: '',
    motivation: '',
    subscribeNewsletter: false,
  });

  useEffect(() => {
    fetchMasterclasses();
  }, []);

  const fetchMasterclasses = async () => {
    try {
      const res = await fetch('/api/masterclasses');
      const data = await res.json();
      setMasterclasses(data);
    } catch (error) {
      console.error('Error fetching masterclasses:', error);
    }
  };

  const handleRegister = (masterclass: Masterclass) => {
    setSelectedMasterclass(masterclass);
    setShowRegistrationModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/masterclasses/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          masterclassId: selectedMasterclass?.id,
          masterclassTitle: selectedMasterclass?.title,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Registration successful! We\'ll contact you soon.');
        setShowRegistrationModal(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          experienceYears: '',
          motivation: '',
          subscribeNewsletter: false,
        });
        fetchMasterclasses();
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 bg-gradient-to-br from-primary-600 to-primary-900 text-white">
        <Container className="text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">Masterclasses</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-100 max-w-3xl mx-auto">
            Join our expert-led training sessions and elevate your skills
          </p>
        </Container>
      </section>

      {/* Masterclasses Grid */}
      <section className="py-12 md:py-20">
        <Container>
          {masterclasses.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
              {masterclasses.map((masterclass) => {
                const videoId = masterclass.videoUrl ? getYouTubeVideoId(masterclass.videoUrl) : null;
                
                return (
                <Card key={masterclass.id} hover>
                  {/* Show YouTube video if available, otherwise show cover image */}
                  {videoId ? (
                    <div className="aspect-video relative bg-black">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={masterclass.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0"
                      />
                    </div>
                  ) : masterclass.coverImage ? (
                    <div className="h-40 sm:h-48 md:aspect-video md:h-auto relative bg-gray-200">
                      <Image
                        src={masterclass.coverImage}
                        alt={masterclass.title}
                        fill
                        className="object-cover"
                        unoptimized={masterclass.coverImage.startsWith('/uploads/')}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ) : null}
                  <CardBody className="p-3 sm:p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                        masterclass.isUpcoming 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {masterclass.isUpcoming ? 'Upcoming' : 'Past'}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">
                        <i className="fas fa-users mr-1" />
                        {masterclass.seatsAvailable}/{masterclass.totalSeats} seats left
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {masterclass.title}
                    </h2>

                    <div className="flex flex-wrap items-start text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 gap-x-3 gap-y-1">
                      <div>
                        <i className="fas fa-calendar mr-1" />
                        {new Date(masterclass.date).toLocaleDateString()}
                      </div>
                      <div>
                        <i className="fas fa-clock mr-1" />
                        {masterclass.duration}
                      </div>
                      <div className="w-full">
                        <i className="fas fa-user mr-1" />
                        {masterclass.instructor}
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{masterclass.description}</p>

                    <div className="flex items-center justify-between gap-2 mt-auto">
                      {masterclass.price > 0 && (
                        <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary-600">
                          ${masterclass.price}
                        </div>
                      )}
                      
                      {/* Show "Watch Recording" if video exists and class has passed, otherwise "Register" */}
                      {videoId && !masterclass.isUpcoming ? (
                        <div className="bg-accent-50 text-accent-600 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center">
                          <i className="fas fa-play-circle mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Recording Available</span>
                          <span className="sm:hidden">Recording</span>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleRegister(masterclass)}
                          className="text-xs sm:text-sm ml-auto"
                          disabled={masterclass.seatsAvailable === 0}
                        >
                          {masterclass.seatsAvailable === 0 ? 'Fully Booked' : 'Register Now'}
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <i className="fas fa-chalkboard-teacher text-6xl text-gray-300 mb-4" />
              <p className="text-xl text-gray-500">No masterclasses available at the moment</p>
            </div>
          )}
        </Container>
      </section>

      {/* Registration Modal */}
      {showRegistrationModal && selectedMasterclass && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Register for {selectedMasterclass.title}</h2>
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Company/Organization"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
                <Input
                  label="Years of Experience"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                />
              </div>

              <Textarea
                label="Why are you interested in this masterclass?"
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                rows={4}
              />

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newsletter"
                  name="subscribeNewsletter"
                  checked={formData.subscribeNewsletter}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700">
                  Subscribe to our newsletter for updates and offers
                </label>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRegistrationModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={isLoading} className="flex-1">
                  Complete Registration
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

