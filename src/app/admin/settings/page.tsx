'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [siteConfig, setSiteConfig] = useState({
    siteName: '',
    tagline: '',
    footerAbout: '',
    privacyPolicy: '',
    termsConditions: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    location: '',
    facebookUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
  });

  const [heroConfig, setHeroConfig] = useState({
    heroTitle: '',
    heroSubtitle: '',
    profileName: '',
    profileTitle: '',
    yearsExperience: '',
    clientsCount: '',
    publicationsCount: '',
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const [siteRes, heroRes] = await Promise.all([
        fetch('/api/site/config'),
        fetch('/api/site/hero'),
      ]);

      if (siteRes.ok) {
        const siteData = await siteRes.json();
        setSiteConfig({
          siteName: siteData.siteName || '',
          tagline: siteData.tagline || '',
          footerAbout: siteData.footerAbout || '',
          privacyPolicy: siteData.privacyPolicy || '',
          termsConditions: siteData.termsConditions || '',
          contactEmail: siteData.contactEmail || '',
          contactPhone: siteData.contactPhone || '',
          address: siteData.address || '',
          location: siteData.location || '',
          facebookUrl: siteData.facebookUrl || '',
          twitterUrl: siteData.twitterUrl || '',
          linkedinUrl: siteData.linkedinUrl || '',
          instagramUrl: siteData.instagramUrl || '',
          youtubeUrl: siteData.youtubeUrl || '',
        });
      }

      if (heroRes.ok) {
        const heroData = await heroRes.json();
        setHeroConfig(heroData);
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSiteSubmit = async () => {
    if (isLoading) return;
    
    console.log('Site submit clicked!');
    console.log('Site config data:', siteConfig);
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/site/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteConfig),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        toast.success('Site settings updated!');
        fetchConfigs(); // Refresh the data
      } else {
        const errorMsg = data.details ? `${data.error}: ${data.details}` : (data.error || 'Failed to update site settings');
        console.error('Update failed:', errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHeroSubmit = async () => {
    if (isLoading) return;
    
    console.log('Hero submit clicked!');
    console.log('Hero config data:', heroConfig);
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/site/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroConfig),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        toast.success('Hero settings updated!');
        fetchConfigs(); // Refresh the data
      } else {
        toast.error(data.error || 'Failed to update hero settings');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSiteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSiteConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHeroConfig((prev) => ({ ...prev, [name]: value }));
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
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your site configuration</p>
      </div>

      <div className="space-y-6">
        {/* Site Configuration */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Site Configuration</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <Input
                label="Site Name"
                name="siteName"
                value={siteConfig.siteName}
                onChange={handleSiteChange}
                required
              />

                  <Input
                    label="Tagline"
                    name="tagline"
                    value={siteConfig.tagline}
                    onChange={handleSiteChange}
                  />

                  <Textarea
                    label="Footer About Text"
                    name="footerAbout"
                    value={siteConfig.footerAbout}
                    onChange={handleSiteChange}
                    rows={4}
                    placeholder="Brief description about your company that appears in the footer"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Contact Email"
                  name="contactEmail"
                  type="email"
                  value={siteConfig.contactEmail || ''}
                  onChange={handleSiteChange}
                />

                <Input
                  label="Contact Phone"
                  name="contactPhone"
                  value={siteConfig.contactPhone || ''}
                  onChange={handleSiteChange}
                />
              </div>

              <Textarea
                label="Address"
                name="address"
                value={siteConfig.address || ''}
                onChange={handleSiteChange}
                rows={3}
              />

              <Input
                label="Location"
                name="location"
                value={siteConfig.location || ''}
                onChange={handleSiteChange}
              />

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h3>
                <div className="space-y-4">
                  <Input
                    label="Facebook URL"
                    name="facebookUrl"
                    type="url"
                    value={siteConfig.facebookUrl || ''}
                    onChange={handleSiteChange}
                    placeholder="https://facebook.com/yourpage"
                  />

                  <Input
                    label="Twitter URL"
                    name="twitterUrl"
                    type="url"
                    value={siteConfig.twitterUrl || ''}
                    onChange={handleSiteChange}
                    placeholder="https://twitter.com/yourhandle"
                  />

                  <Input
                    label="LinkedIn URL"
                    name="linkedinUrl"
                    type="url"
                    value={siteConfig.linkedinUrl || ''}
                    onChange={handleSiteChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />

                  <Input
                    label="Instagram URL"
                    name="instagramUrl"
                    type="url"
                    value={siteConfig.instagramUrl || ''}
                    onChange={handleSiteChange}
                    placeholder="https://instagram.com/yourhandle"
                  />

                  <Input
                    label="YouTube URL"
                    name="youtubeUrl"
                    type="url"
                    value={siteConfig.youtubeUrl || ''}
                    onChange={handleSiteChange}
                    placeholder="https://youtube.com/@yourchannel"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={isLoading}
                onClick={handleSiteSubmit}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2" />
                    Update Site Settings
                  </>
                )}
                  </button>
                </div>
              </CardBody>
            </Card>

            {/* Legal Pages */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Legal Pages</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-6">
                  <Textarea
                    label="Privacy Policy"
                    name="privacyPolicy"
                    value={siteConfig.privacyPolicy}
                    onChange={handleSiteChange}
                    rows={10}
                    placeholder="Enter your privacy policy content here. You can use line breaks for paragraphs."
                  />

                  <Textarea
                    label="Terms & Conditions"
                    name="termsConditions"
                    value={siteConfig.termsConditions}
                    onChange={handleSiteChange}
                    rows={10}
                    placeholder="Enter your terms & conditions content here. You can use line breaks for paragraphs."
                  />

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleSiteSubmit}
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save mr-2" />
                        Update Legal Pages
                      </>
                    )}
                  </button>
                </div>
              </CardBody>
            </Card>

            {/* Hero Configuration */}
            <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Hero Section</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <Input
                label="Hero Title"
                name="heroTitle"
                value={heroConfig.heroTitle}
                onChange={handleHeroChange}
                required
              />

              <Textarea
                label="Hero Subtitle"
                name="heroSubtitle"
                value={heroConfig.heroSubtitle}
                onChange={handleHeroChange}
                rows={3}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Profile Name"
                  name="profileName"
                  value={heroConfig.profileName}
                  onChange={handleHeroChange}
                />

                <Input
                  label="Profile Title"
                  name="profileTitle"
                  value={heroConfig.profileTitle}
                  onChange={handleHeroChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Years Experience"
                  name="yearsExperience"
                  value={heroConfig.yearsExperience}
                  onChange={handleHeroChange}
                  placeholder="15+"
                />

                <Input
                  label="Clients Count"
                  name="clientsCount"
                  value={heroConfig.clientsCount}
                  onChange={handleHeroChange}
                  placeholder="5000+"
                />

                <Input
                  label="Publications Count"
                  name="publicationsCount"
                  value={heroConfig.publicationsCount}
                  onChange={handleHeroChange}
                  placeholder="50+"
                />
              </div>

              <button
                type="button"
                disabled={isLoading}
                onClick={handleHeroSubmit}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2" />
                    Update Hero Settings
                  </>
                )}
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}

