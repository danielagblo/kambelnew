-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'Moses Agbesi Katamani',
    "description" TEXT,
    "pages" INTEGER NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "coverImage" TEXT,
    "purchaseLink" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultancy_services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT,
    "icon" TEXT NOT NULL DEFAULT 'fas fa-briefcase',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consultancy_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_features" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'fas fa-star',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "service_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "author" TEXT NOT NULL DEFAULT 'Kambel Team',
    "coverImage" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscriptions" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_config" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'Kambel Consult',
    "tagline" TEXT NOT NULL DEFAULT 'Professional Consulting and Training Services',
    "footerAbout" TEXT NOT NULL DEFAULT 'Your trusted partner in career development and business excellence. We provide professional consulting and training services to help individuals and organizations achieve their goals.',
    "privacyPolicy" TEXT NOT NULL DEFAULT 'Privacy Policy content goes here. You can edit this from the admin settings.',
    "termsConditions" TEXT NOT NULL DEFAULT 'Terms & Conditions content goes here. You can edit this from the admin settings.',
    "logo" TEXT,
    "favicon" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "address" TEXT,
    "location" TEXT,
    "facebookUrl" TEXT,
    "twitterUrl" TEXT,
    "linkedinUrl" TEXT,
    "instagramUrl" TEXT,
    "youtubeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_config" (
    "id" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL DEFAULT 'Welcome to Kambel Consult',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Your trusted partner in career development and business excellence',
    "profileName" TEXT NOT NULL DEFAULT 'Moses Agbesi Katamani',
    "profileTitle" TEXT NOT NULL DEFAULT 'Chief Executive Officer',
    "profilePicture" TEXT,
    "yearsExperience" TEXT NOT NULL DEFAULT '15+',
    "yearsLabel" TEXT NOT NULL DEFAULT 'Years Experience',
    "yearsDescription" TEXT NOT NULL DEFAULT 'Professional Development',
    "clientsCount" TEXT NOT NULL DEFAULT '5000+',
    "clientsLabel" TEXT NOT NULL DEFAULT 'Clients',
    "clientsDescription" TEXT NOT NULL DEFAULT 'Successfully Helped',
    "publicationsCount" TEXT NOT NULL DEFAULT '50+',
    "publicationsLabel" TEXT NOT NULL DEFAULT 'Publications',
    "publicationsDescription" TEXT NOT NULL DEFAULT 'Authored Works',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_config" (
    "id" TEXT NOT NULL,
    "heroYears" TEXT NOT NULL DEFAULT '15+',
    "heroClients" TEXT NOT NULL DEFAULT '500+',
    "heroPublications" TEXT NOT NULL DEFAULT '50+',
    "heroSpeaking" TEXT NOT NULL DEFAULT '100+',
    "profileName" TEXT NOT NULL DEFAULT 'Moses Agbesi Katamani',
    "profileTitle" TEXT NOT NULL DEFAULT 'Founder & CEO, Kambel Consult',
    "profilePicture" TEXT,
    "bioSummary" TEXT NOT NULL DEFAULT 'A visionary leader and expert consultant',
    "tags" TEXT NOT NULL DEFAULT 'Education Expert,Career Coach,Business Advisor,Author,Speaker',
    "philosophyQuote" TEXT NOT NULL DEFAULT 'Education is the foundation of all progress',
    "ctaTitle" TEXT NOT NULL DEFAULT 'Ready to Work Together?',
    "ctaDescription" TEXT NOT NULL DEFAULT 'Let''s discuss how I can help you achieve your goals',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_journey_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'briefcase',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aboutConfigId" TEXT NOT NULL,

    CONSTRAINT "professional_journey_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education_qualifications" (
    "id" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT 'graduation-cap',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aboutConfigId" TEXT NOT NULL,

    CONSTRAINT "education_qualifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'trophy',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aboutConfigId" TEXT NOT NULL,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speaking_engagements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "location" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aboutConfigId" TEXT NOT NULL,

    CONSTRAINT "speaking_engagements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "privacy_policies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Privacy Policy',
    "subtitle" TEXT NOT NULL DEFAULT 'Your privacy is important to us',
    "content" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "privacy_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terms_conditions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Terms & Conditions',
    "subtitle" TEXT NOT NULL DEFAULT 'Please read these terms carefully',
    "content" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "terms_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "masterclasses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "instructor" TEXT NOT NULL DEFAULT 'Moses Agbesi Katamani',
    "date" TIMESTAMP(3) NOT NULL,
    "duration" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalSeats" INTEGER NOT NULL DEFAULT 30,
    "seatsAvailable" INTEGER NOT NULL DEFAULT 30,
    "coverImage" TEXT,
    "videoUrl" TEXT,
    "isUpcoming" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "masterclasses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_media_links" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "iconClass" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_media_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "caption" TEXT,
    "description" TEXT,
    "mediaType" TEXT NOT NULL DEFAULT 'image',
    "image" TEXT,
    "videoUrl" TEXT,
    "videoFile" TEXT,
    "thumbnail" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "masterclass_registrations" (
    "id" TEXT NOT NULL,
    "masterclassTitle" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "company" TEXT,
    "experienceYears" TEXT,
    "motivation" TEXT,
    "subscribeNewsletter" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "masterclassId" TEXT,

    CONSTRAINT "masterclass_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_views" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "title" TEXT,
    "referrer" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "contentType" TEXT,
    "contentId" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_summary" (
    "id" TEXT NOT NULL,
    "totalPageViews" INTEGER NOT NULL DEFAULT 0,
    "totalBlogPosts" INTEGER NOT NULL DEFAULT 0,
    "totalPublications" INTEGER NOT NULL DEFAULT 0,
    "totalMasterclasses" INTEGER NOT NULL DEFAULT 0,
    "totalServices" INTEGER NOT NULL DEFAULT 0,
    "totalContacts" INTEGER NOT NULL DEFAULT 0,
    "totalNewsletterSubscribers" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analytics_summary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscriptions_email_key" ON "newsletter_subscriptions"("email");

-- CreateIndex
CREATE INDEX "page_views_path_idx" ON "page_views"("path");

-- CreateIndex
CREATE INDEX "page_views_contentType_contentId_idx" ON "page_views"("contentType", "contentId");

-- CreateIndex
CREATE INDEX "page_views_viewedAt_idx" ON "page_views"("viewedAt");

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_features" ADD CONSTRAINT "service_features_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "consultancy_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_journey_items" ADD CONSTRAINT "professional_journey_items_aboutConfigId_fkey" FOREIGN KEY ("aboutConfigId") REFERENCES "about_config"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education_qualifications" ADD CONSTRAINT "education_qualifications_aboutConfigId_fkey" FOREIGN KEY ("aboutConfigId") REFERENCES "about_config"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_aboutConfigId_fkey" FOREIGN KEY ("aboutConfigId") REFERENCES "about_config"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speaking_engagements" ADD CONSTRAINT "speaking_engagements_aboutConfigId_fkey" FOREIGN KEY ("aboutConfigId") REFERENCES "about_config"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "masterclass_registrations" ADD CONSTRAINT "masterclass_registrations_masterclassId_fkey" FOREIGN KEY ("masterclassId") REFERENCES "masterclasses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
