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
    yearsExperience: '',
    yearsLabel: '',
    clientsCount: '',
    clientsLabel: '',
    publicationsCount: '',
    publicationsLabel: '',
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
        setHeroConfig({
          heroTitle: heroData.heroTitle || '',
          heroSubtitle: heroData.heroSubtitle || '',
          yearsExperience: heroData.yearsExperience || '',
          yearsLabel: heroData.yearsLabel || '',
          clientsCount: heroData.clientsCount || '',
          clientsLabel: heroData.clientsLabel || '',
          publicationsCount: heroData.publicationsCount || '',
          publicationsLabel: heroData.publicationsLabel || '',
        });
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
      // Save site config first
      console.log('Saving site config:', siteConfig);
      const siteRes = await fetch('/api/site/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteConfig),
      });
      
      const siteResponseText = await siteRes.text();
      console.log('Site config response status:', siteRes.status);
      console.log('Site config response text:', siteResponseText);
      
      let siteData;
      try {
        siteData = JSON.parse(siteResponseText);
      } catch (parseError) {
        console.error('Failed to parse site response as JSON:', parseError);
        toast.error('Server returned an error. Please check the console.');
        setIsLoading(false);
        return;
      }
      
      if (!siteRes.ok) {
        toast.error(siteData.error || 'Failed to update site settings');
        setIsLoading(false);
        return;
      }

      // Then save hero config
      console.log('Saving hero config:', heroConfig);
      const heroRes = await fetch('/api/site/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroConfig),
      });
      
      const heroResponseText = await heroRes.text();
      console.log('Hero config response status:', heroRes.status);
      console.log('Hero config response text:', heroResponseText);
      
      let heroData;
      try {
        heroData = JSON.parse(heroResponseText);
      } catch (parseError) {
        console.error('Failed to parse hero response as JSON:', parseError);
        toast.error('Server returned an error. Please check the console.');
        setIsLoading(false);
        return;
      }
      
      if (!heroRes.ok) {
        toast.error(heroData.error || 'Failed to update hero settings');
        setIsLoading(false);
        return;
      }

      toast.success('All settings saved successfully!');
      fetchConfigs(); // Refresh the data
    } catch (error) {
      console.error('Error saving settings:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while saving settings';
      console.error('Full error:', errorMessage);
      toast.error(errorMessage);
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Input
                    label="Years Experience"
                    name="yearsExperience"
                    value={heroConfig.yearsExperience}
                    onChange={handleHeroChange}
                    placeholder="15+"
                  />
                  <Input
                    label="Years Label"
                    name="yearsLabel"
                    value={heroConfig.yearsLabel}
                    onChange={handleHeroChange}
                    placeholder="Years Experience"
                  />
                </div>

                <div>
                  <Input
                    label="Clients Count"
                    name="clientsCount"
                    value={heroConfig.clientsCount}
                    onChange={handleHeroChange}
                    placeholder="5000+"
                  />
                  <Input
                    label="Clients Label"
                    name="clientsLabel"
                    value={heroConfig.clientsLabel}
                    onChange={handleHeroChange}
                    placeholder="Clients"
                  />
                </div>

                <div>
                  <Input
                    label="Publications Count"
                    name="publicationsCount"
                    value={heroConfig.publicationsCount}
                    onChange={handleHeroChange}
                    placeholder="50+"
                  />
                  <Input
                    label="Publications Label"
                    name="publicationsLabel"
                    value={heroConfig.publicationsLabel}
                    onChange={handleHeroChange}
                    placeholder="Publications"
                  />
                </div>
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

