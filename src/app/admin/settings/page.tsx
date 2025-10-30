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

  const handleSaveAll = async () => {
    if (isLoading) return;
    
    setIsLoading(true);

    try {
      // Save site config and hero config in parallel
      const [siteRes, heroRes] = await Promise.all([
        fetch('/api/site/config', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(siteConfig),
        }),
        fetch('/api/site/hero', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(heroConfig),
        }),
      ]);

      const siteData = await siteRes.json();
      const heroData = await heroRes.json();

      let hasError = false;
      let errorMessages: string[] = [];

      if (!siteRes.ok) {
        hasError = true;
        errorMessages.push(siteData.error || 'Failed to update site settings');
      }

      if (!heroRes.ok) {
        hasError = true;
        errorMessages.push(heroData.error || 'Failed to update hero settings');
      }

      if (hasError) {
        toast.error(errorMessages.join(', '));
      } else {
        toast.success('All settings saved successfully!');
        fetchConfigs(); // Refresh the data
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('An error occurred while saving settings');
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

            </div>
          </CardBody>
        </Card>

        {/* Save All Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 -mx-6 mt-6">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleSaveAll}
            className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-2" />
                Save All Settings
              </>
            )}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

