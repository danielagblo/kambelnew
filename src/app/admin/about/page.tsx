'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardBody } from '@/components/ui/Card';
import ImageUpload from '@/components/ui/ImageUpload';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface AboutConfig {
  id?: string;
  heroYears: string;
  heroClients: string;
  heroPublications: string;
  heroSpeaking: string;
  profileName: string;
  profileTitle: string;
  profilePicture: string;
  bioSummary: string;
  tags: string;
  philosophyQuote: string;
  ctaTitle: string;
  ctaDescription: string;
  isActive: boolean;
}

interface JourneyItem {
  id?: string;
  yearRange: string;
  title: string;
  company: string;
  description: string;
}

interface EducationItem {
  id?: string;
  degree: string;
  institution: string;
  year: string;
  description: string;
}

interface Achievement {
  id?: string;
  title: string;
  year: string;
  description: string;
}

interface SpeakingEngagement {
  id?: string;
  title: string;
  event: string;
  date: string;
  location: string;
}

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'journey' | 'education' | 'achievements' | 'speaking'>('profile');

  const [formData, setFormData] = useState<AboutConfig>({
    heroYears: '15+',
    heroClients: '500+',
    heroPublications: '50+',
    heroSpeaking: '100+',
    profileName: 'Moses Agbesi Katamani',
    profileTitle: 'Founder & CEO, Kambel Consult',
    profilePicture: '',
    bioSummary: '',
    tags: 'Education Expert,Career Coach,Business Advisor,Author,Speaker',
    philosophyQuote: '',
    ctaTitle: 'Ready to Work Together?',
    ctaDescription: "Let's discuss how I can help you achieve your goals",
    isActive: true,
  });

  // Journey state
  const [journeyItems, setJourneyItems] = useState<JourneyItem[]>([]);
  const [showAddJourney, setShowAddJourney] = useState(false);
  const [editingJourneyId, setEditingJourneyId] = useState<string | null>(null);
  const [journeyForm, setJourneyForm] = useState<JourneyItem>({
    yearRange: '',
    title: '',
    company: '',
    description: '',
  });

  // Education state
  const [educationItems, setEducationItems] = useState<EducationItem[]>([]);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [educationForm, setEducationForm] = useState<EducationItem>({
    degree: '',
    institution: '',
    year: '',
    description: '',
  });

  // Achievements state
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showAddAchievement, setShowAddAchievement] = useState(false);
  const [editingAchievementId, setEditingAchievementId] = useState<string | null>(null);
  const [achievementForm, setAchievementForm] = useState<Achievement>({
    title: '',
    year: '',
    description: '',
  });

  // Speaking state
  const [speakingEngagements, setSpeakingEngagements] = useState<SpeakingEngagement[]>([]);
  const [showAddSpeaking, setShowAddSpeaking] = useState(false);
  const [editingSpeakingId, setEditingSpeakingId] = useState<string | null>(null);
  const [speakingForm, setSpeakingForm] = useState<SpeakingEngagement>({
    title: '',
    event: '',
    date: '',
    location: '',
  });

  useEffect(() => {
    fetchAboutConfig();
    fetchJourneyItems();
    fetchEducationItems();
    fetchAchievements();
    fetchSpeakingEngagements();
  }, []);

  const fetchAboutConfig = async () => {
    try {
      // Fetch for admin - gets the latest config regardless of isActive
      const response = await fetch('/api/site/about?admin=true');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched about config:', data);
        if (data && data.id) {
          // Update with fetched data, preserving empty strings but ensuring defaults for truly undefined
          setFormData(prev => ({
            heroYears: data.heroYears ?? prev.heroYears,
            heroClients: data.heroClients ?? prev.heroClients,
            heroPublications: data.heroPublications ?? prev.heroPublications,
            heroSpeaking: data.heroSpeaking ?? prev.heroSpeaking,
            profileName: data.profileName ?? prev.profileName,
            profileTitle: data.profileTitle ?? prev.profileTitle,
            profilePicture: data.profilePicture ?? prev.profilePicture,
            bioSummary: data.bioSummary ?? prev.bioSummary,
            tags: data.tags ?? prev.tags,
            philosophyQuote: data.philosophyQuote ?? prev.philosophyQuote,
            ctaTitle: data.ctaTitle ?? prev.ctaTitle,
            ctaDescription: data.ctaDescription ?? prev.ctaDescription,
            isActive: data.isActive !== undefined ? data.isActive : prev.isActive,
            id: data.id,
          }));
        } else {
          console.log('No existing about config found, using defaults');
        }
        // If no data exists, keep the defaults - they're already set in useState
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch' }));
        console.error('Failed to fetch about config:', errorData);
        toast.error('Failed to load about page data');
      }
    } catch (error) {
      console.error('Failed to fetch about config:', error);
      toast.error('Error loading about page data');
    } finally {
      setLoading(false);
    }
  };

  const fetchJourneyItems = async () => {
    try {
      const response = await fetch('/api/site/about/journey');
      if (response.ok) {
        const data = await response.json();
        setJourneyItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch journey items:', error);
    }
  };

  const fetchEducationItems = async () => {
    try {
      console.log('Fetching education items...');
      const response = await fetch('/api/site/about/education');
      console.log('Fetch response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched education items:', data);
        setEducationItems(data);
      } else {
        const error = await response.json();
        console.error('Error response:', error);
      }
    } catch (error) {
      console.error('Failed to fetch education items:', error);
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/site/about/achievements');
      if (response.ok) {
        const data = await response.json();
        setAchievements(data);
      }
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    }
  };

  const fetchSpeakingEngagements = async () => {
    try {
      const response = await fetch('/api/site/about/speaking');
      if (response.ok) {
        const data = await response.json();
        setSpeakingEngagements(data);
      }
    } catch (error) {
      console.error('Failed to fetch speaking engagements:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/site/about', {
        method: formData.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('About page updated successfully!');
        fetchAboutConfig();
      } else {
        toast.error('Failed to update about page');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Journey CRUD functions
  const handleSaveJourney = async () => {
    if (!journeyForm.yearRange || !journeyForm.title || !journeyForm.company) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const url = '/api/site/about/journey';
      const method = editingJourneyId ? 'PUT' : 'POST';
      const body = editingJourneyId
        ? JSON.stringify({ ...journeyForm, id: editingJourneyId })
        : JSON.stringify(journeyForm);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (response.ok) {
        toast.success(editingJourneyId ? 'Journey item updated!' : 'Journey item added!');
        fetchJourneyItems();
        setShowAddJourney(false);
        setEditingJourneyId(null);
        setJourneyForm({ yearRange: '', title: '', company: '', description: '' });
      } else {
        toast.error('Failed to save journey item');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleEditJourney = (item: any) => {
    setEditingJourneyId(item.id || null);
    // Map database fields to form fields
    setJourneyForm({
      yearRange: item.period,
      title: item.title,
      company: item.organization,
      description: item.description || '',
    });
    setShowAddJourney(true);
  };

  const handleDeleteJourney = async (id: string) => {
    if (!confirm('Are you sure you want to delete this journey item?')) return;

    try {
      const response = await fetch(`/api/site/about/journey?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Journey item deleted!');
        fetchJourneyItems();
      } else {
        toast.error('Failed to delete journey item');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleCancelJourney = () => {
    setShowAddJourney(false);
    setEditingJourneyId(null);
    setJourneyForm({ yearRange: '', title: '', company: '', description: '' });
  };

  // Education CRUD functions
  const handleSaveEducation = async () => {
    if (!educationForm.degree || !educationForm.institution || !educationForm.year) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const url = '/api/site/about/education';
      const method = editingEducationId ? 'PUT' : 'POST';
      const body = editingEducationId
        ? JSON.stringify({ ...educationForm, id: editingEducationId })
        : JSON.stringify(educationForm);

      console.log('Sending education data:', body);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      console.log('Response status:', response.status);
      console.log('Response ok?:', response.ok);

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response data:', data);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        console.error('Response was:', responseText);
        toast.error(`Server error: ${responseText.substring(0, 100)}`);
        return;
      }

      if (response.ok) {
        toast.success(editingEducationId ? 'Education item updated!' : 'Education item added!');
        fetchEducationItems();
        setShowAddEducation(false);
        setEditingEducationId(null);
        setEducationForm({ degree: '', institution: '', year: '', description: '' });
      } else {
        const errorMsg = data.error || data.details || 'Failed to save education item';
        console.error('Server returned error:', errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Error saving education:', error);
      toast.error('An error occurred');
    }
  };

  const handleEditEducation = (item: any) => {
    setEditingEducationId(item.id || null);
    // Map database fields to form fields
    setEducationForm({
      degree: item.qualification,
      institution: item.institution,
      year: item.year,
      description: item.description || '',
    });
    setShowAddEducation(true);
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education item?')) return;

    try {
      const response = await fetch(`/api/site/about/education?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Education item deleted!');
        fetchEducationItems();
      } else {
        toast.error('Failed to delete education item');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleCancelEducation = () => {
    setShowAddEducation(false);
    setEditingEducationId(null);
    setEducationForm({ degree: '', institution: '', year: '', description: '' });
  };

  // Achievements CRUD functions
  const handleSaveAchievement = async () => {
    if (!achievementForm.title || !achievementForm.year) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const url = '/api/site/about/achievements';
      const method = editingAchievementId ? 'PUT' : 'POST';
      const body = editingAchievementId
        ? JSON.stringify({ ...achievementForm, id: editingAchievementId })
        : JSON.stringify(achievementForm);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (response.ok) {
        toast.success(editingAchievementId ? 'Achievement updated!' : 'Achievement added!');
        fetchAchievements();
        setShowAddAchievement(false);
        setEditingAchievementId(null);
        setAchievementForm({ title: '', year: '', description: '' });
      } else {
        toast.error('Failed to save achievement');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleEditAchievement = (item: Achievement) => {
    setEditingAchievementId(item.id || null);
    setAchievementForm(item);
    setShowAddAchievement(true);
  };

  const handleDeleteAchievement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;

    try {
      const response = await fetch(`/api/site/about/achievements?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Achievement deleted!');
        fetchAchievements();
      } else {
        toast.error('Failed to delete achievement');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleCancelAchievement = () => {
    setShowAddAchievement(false);
    setEditingAchievementId(null);
    setAchievementForm({ title: '', year: '', description: '' });
  };

  // Speaking CRUD functions
  const handleSaveSpeaking = async () => {
    if (!speakingForm.title || !speakingForm.event || !speakingForm.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const url = '/api/site/about/speaking';
      const method = editingSpeakingId ? 'PUT' : 'POST';
      const body = editingSpeakingId
        ? JSON.stringify({ ...speakingForm, id: editingSpeakingId })
        : JSON.stringify(speakingForm);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (response.ok) {
        toast.success(editingSpeakingId ? 'Speaking engagement updated!' : 'Speaking engagement added!');
        fetchSpeakingEngagements();
        setShowAddSpeaking(false);
        setEditingSpeakingId(null);
        setSpeakingForm({ title: '', event: '', date: '', location: '' });
      } else {
        toast.error('Failed to save speaking engagement');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleEditSpeaking = (item: SpeakingEngagement) => {
    setEditingSpeakingId(item.id || null);
    setSpeakingForm(item);
    setShowAddSpeaking(true);
  };

  const handleDeleteSpeaking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this speaking engagement?')) return;

    try {
      const response = await fetch(`/api/site/about/speaking?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Speaking engagement deleted!');
        fetchSpeakingEngagements();
      } else {
        toast.error('Failed to delete speaking engagement');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleCancelSpeaking = () => {
    setShowAddSpeaking(false);
    setEditingSpeakingId(null);
    setSpeakingForm({ title: '', event: '', date: '', location: '' });
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile & Stats', icon: 'fa-user' },
    { id: 'journey' as const, label: 'Professional Journey', icon: 'fa-road' },
    { id: 'education' as const, label: 'Education', icon: 'fa-graduation-cap' },
    { id: 'achievements' as const, label: 'Achievements', icon: 'fa-trophy' },
    { id: 'speaking' as const, label: 'Speaking', icon: 'fa-microphone' },
  ];

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
        <h1 className="text-3xl font-bold text-gray-900">About Page Configuration</h1>
        <p className="text-gray-600 mt-2">Manage your complete about page content</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <i className={`fas ${tab.icon} mr-2`} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Profile & Stats Tab */}
      {activeTab === 'profile' && (
        <Card>
          <CardBody>
            <form className="space-y-8">
              {/* Hero Stats Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Hero Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    label="Years Experience"
                    name="heroYears"
                    value={formData.heroYears}
                    onChange={handleChange}
                    placeholder="15+"
                  />
                  <Input
                    label="Clients Served"
                    name="heroClients"
                    value={formData.heroClients}
                    onChange={handleChange}
                    placeholder="500+"
                  />
                  <Input
                    label="Publications"
                    name="heroPublications"
                    value={formData.heroPublications}
                    onChange={handleChange}
                    placeholder="50+"
                  />
                  <Input
                    label="Speaking Engagements"
                    name="heroSpeaking"
                    value={formData.heroSpeaking}
                    onChange={handleChange}
                    placeholder="100+"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    name="profileName"
                    value={formData.profileName}
                    onChange={handleChange}
                    required
                    placeholder="Moses Agbesi Katamani"
                  />

                  <Input
                    label="Title/Position"
                    name="profileTitle"
                    value={formData.profileTitle}
                    onChange={handleChange}
                    required
                    placeholder="Founder & CEO, Kambel Consult"
                  />

                  <ImageUpload
                    label="Profile Picture"
                    value={formData.profilePicture}
                    onChange={(url) => setFormData((prev) => ({ ...prev, profilePicture: url }))}
                    folder="about"
                  />

                  <Textarea
                    label="Bio Summary"
                    name="bioSummary"
                    value={formData.bioSummary}
                    onChange={handleChange}
                    rows={5}
                    placeholder="A brief professional biography..."
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Education Expert,Career Coach,Business Advisor"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate tags with commas
                    </p>
                  </div>

                  <Textarea
                    label="Philosophy Quote"
                    name="philosophyQuote"
                    value={formData.philosophyQuote}
                    onChange={handleChange}
                    rows={3}
                    placeholder="A quote that represents your philosophy..."
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Call-to-Action Section</h2>
                <div className="space-y-4">
                  <Input
                    label="CTA Title"
                    name="ctaTitle"
                    value={formData.ctaTitle}
                    onChange={handleChange}
                    placeholder="Ready to Work Together?"
                  />

                  <Textarea
                    label="CTA Description"
                    name="ctaDescription"
                    value={formData.ctaDescription}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Let's discuss how I can help you achieve your goals"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 border-t border-gray-200 pt-6">
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

              <div className="flex space-x-4 border-t border-gray-200 pt-6">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Journey Tab */}
      {activeTab === 'journey' && (
        <Card>
          <CardBody>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Professional Journey</h2>
              <button
                onClick={() => setShowAddJourney(!showAddJourney)}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <i className={`fas ${showAddJourney ? 'fa-times' : 'fa-plus'} mr-2`} />
                {showAddJourney ? 'Cancel' : 'Add Item'}
              </button>
            </div>

            {showAddJourney && (
              <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  {editingJourneyId ? 'Edit Journey Item' : 'Add Journey Item'}
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Year Range*"
                    value={journeyForm.yearRange}
                    onChange={(e) => setJourneyForm({ ...journeyForm, yearRange: e.target.value })}
                    placeholder="e.g., 2015-2020"
                  />
                  <Input
                    label="Title/Position*"
                    value={journeyForm.title}
                    onChange={(e) => setJourneyForm({ ...journeyForm, title: e.target.value })}
                    placeholder="e.g., Senior Consultant"
                  />
                  <Input
                    label="Company/Organization*"
                    value={journeyForm.company}
                    onChange={(e) => setJourneyForm({ ...journeyForm, company: e.target.value })}
                    placeholder="e.g., Kambel Consult"
                  />
                  <Textarea
                    label="Description"
                    value={journeyForm.description}
                    onChange={(e) => setJourneyForm({ ...journeyForm, description: e.target.value })}
                    rows={4}
                    placeholder="Describe your role and achievements..."
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveJourney}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      <i className="fas fa-save mr-2" />
                      {editingJourneyId ? 'Update' : 'Add'}
                    </button>
                    <button
                      onClick={handleCancelJourney}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {journeyItems.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No journey items added yet.</p>
              ) : (
                journeyItems.map((item: any) => (
                  <div key={item.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                            {item.period}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        </div>
                        <p className="text-gray-600 font-medium mb-2">{item.organization}</p>
                        {item.description && (
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEditJourney(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <i className="fas fa-edit" />
                        </button>
                        <button
                          onClick={() => handleDeleteJourney(item.id!)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Education Tab */}
      {activeTab === 'education' && (
        <Card>
          <CardBody>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Education & Qualifications</h2>
              <button
                onClick={() => setShowAddEducation(!showAddEducation)}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <i className={`fas ${showAddEducation ? 'fa-times' : 'fa-plus'} mr-2`} />
                {showAddEducation ? 'Cancel' : 'Add Item'}
              </button>
            </div>

            {showAddEducation && (
              <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  {editingEducationId ? 'Edit Education Item' : 'Add Education Item'}
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Degree/Qualification*"
                    value={educationForm.degree}
                    onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                    placeholder="e.g., Master of Business Administration"
                  />
                  <Input
                    label="Institution*"
                    value={educationForm.institution}
                    onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                    placeholder="e.g., University of Ghana"
                  />
                  <Input
                    label="Year*"
                    value={educationForm.year}
                    onChange={(e) => setEducationForm({ ...educationForm, year: e.target.value })}
                    placeholder="e.g., 2010 or 2010-2014"
                  />
                  <Textarea
                    label="Description"
                    value={educationForm.description}
                    onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })}
                    rows={3}
                    placeholder="Additional details, honors, specializations..."
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveEducation}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      <i className="fas fa-save mr-2" />
                      {editingEducationId ? 'Update' : 'Add'}
                    </button>
                    <button
                      onClick={handleCancelEducation}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {educationItems.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No education items added yet.</p>
              ) : (
                educationItems.map((item: any) => (
                  <div key={item.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium">
                            {item.year}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900">{item.qualification}</h3>
                        </div>
                        <p className="text-gray-600 font-medium mb-2">{item.institution}</p>
                        {item.description && (
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEditEducation(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <i className="fas fa-edit" />
                        </button>
                        <button
                          onClick={() => handleDeleteEducation(item.id!)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <Card>
          <CardBody>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Achievements & Recognition</h2>
              <button
                onClick={() => setShowAddAchievement(!showAddAchievement)}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <i className={`fas ${showAddAchievement ? 'fa-times' : 'fa-plus'} mr-2`} />
                {showAddAchievement ? 'Cancel' : 'Add Achievement'}
              </button>
            </div>

            {showAddAchievement && (
              <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  {editingAchievementId ? 'Edit Achievement' : 'Add Achievement'}
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Title*"
                    value={achievementForm.title}
                    onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                    placeholder="e.g., Best Leadership Award"
                  />
                  <Input
                    label="Year*"
                    value={achievementForm.year}
                    onChange={(e) => setAchievementForm({ ...achievementForm, year: e.target.value })}
                    placeholder="e.g., 2022"
                  />
                  <Textarea
                    label="Description"
                    value={achievementForm.description}
                    onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                    rows={3}
                    placeholder="Details about the achievement..."
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveAchievement}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      <i className="fas fa-save mr-2" />
                      {editingAchievementId ? 'Update' : 'Add'}
                    </button>
                    <button
                      onClick={handleCancelAchievement}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {achievements.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No achievements added yet.</p>
              ) : (
                achievements.map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium">
                            {item.year}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEditAchievement(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <i className="fas fa-edit" />
                        </button>
                        <button
                          onClick={() => handleDeleteAchievement(item.id!)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Speaking Tab */}
      {activeTab === 'speaking' && (
        <Card>
          <CardBody>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Speaking Engagements</h2>
              <button
                onClick={() => setShowAddSpeaking(!showAddSpeaking)}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <i className={`fas ${showAddSpeaking ? 'fa-times' : 'fa-plus'} mr-2`} />
                {showAddSpeaking ? 'Cancel' : 'Add Engagement'}
              </button>
            </div>

            {showAddSpeaking && (
              <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  {editingSpeakingId ? 'Edit Speaking Engagement' : 'Add Speaking Engagement'}
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Title*"
                    value={speakingForm.title}
                    onChange={(e) => setSpeakingForm({ ...speakingForm, title: e.target.value })}
                    placeholder="e.g., Keynote on Leadership"
                  />
                  <Input
                    label="Event*"
                    value={speakingForm.event}
                    onChange={(e) => setSpeakingForm({ ...speakingForm, event: e.target.value })}
                    placeholder="e.g., TEDx Accra"
                  />
                  <Input
                    label="Date*"
                    value={speakingForm.date}
                    onChange={(e) => setSpeakingForm({ ...speakingForm, date: e.target.value })}
                    placeholder="e.g., March 2023"
                  />
                  <Input
                    label="Location"
                    value={speakingForm.location}
                    onChange={(e) => setSpeakingForm({ ...speakingForm, location: e.target.value })}
                    placeholder="e.g., Accra, Ghana"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveSpeaking}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      <i className="fas fa-save mr-2" />
                      {editingSpeakingId ? 'Update' : 'Add'}
                    </button>
                    <button
                      onClick={handleCancelSpeaking}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {speakingEngagements.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No speaking engagements added yet.</p>
              ) : (
                speakingEngagements.map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                            {item.date}
                          </span>
                          {item.location && (
                            <span className="text-sm text-gray-500">
                              <i className="fas fa-map-marker-alt mr-1" />
                              {item.location}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-gray-600 font-medium">{item.event}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEditSpeaking(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <i className="fas fa-edit" />
                        </button>
                        <button
                          onClick={() => handleDeleteSpeaking(item.id!)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>
      )}
    </AdminLayout>
  );
}
