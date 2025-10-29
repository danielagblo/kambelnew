import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kambelconsult.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@kambelconsult.com',
      passwordHash: hashedPassword,
      isActive: true,
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Course Books' },
      update: {},
      create: {
        name: 'Course Books',
        description: 'Educational course materials',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Guidance Books' },
      update: {},
      create: {
        name: 'Guidance Books',
        description: 'Personal and professional guidance',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Inspirational Books' },
      update: {},
      create: {
        name: 'Inspirational Books',
        description: 'Motivational and inspirational content',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Literature' },
      update: {},
      create: {
        name: 'Literature',
        description: 'Literary works and publications',
      },
    }),
  ]);
  console.log('✅ Created categories:', categories.length);

  // Create consultancy services
  const careerService = await prisma.consultancyService.create({
    data: {
      name: 'Career Development',
      serviceType: 'career',
      description: 'Professional career guidance and development services to help you achieve your career goals.',
      icon: 'fas fa-briefcase',
      order: 1,
      features: {
        create: [
          {
            title: 'Career Assessment',
            description: 'Comprehensive career evaluation and planning',
            icon: 'fas fa-clipboard-check',
            order: 1,
          },
          {
            title: 'Resume Building',
            description: 'Professional resume and portfolio creation',
            icon: 'fas fa-file-alt',
            order: 2,
          },
          {
            title: 'Interview Preparation',
            description: 'Interview skills training and mock interviews',
            icon: 'fas fa-handshake',
            order: 3,
          },
        ],
      },
    },
  });

  const businessService = await prisma.consultancyService.create({
    data: {
      name: 'Business Consulting',
      serviceType: 'business',
      description: 'Strategic business consulting and advisory services for growth and success.',
      icon: 'fas fa-chart-line',
      order: 2,
      features: {
        create: [
          {
            title: 'Strategic Planning',
            description: 'Business strategy development and execution',
            icon: 'fas fa-chess',
            order: 1,
          },
          {
            title: 'Market Analysis',
            description: 'Comprehensive market research and competitive analysis',
            icon: 'fas fa-search',
            order: 2,
          },
          {
            title: 'Growth Strategy',
            description: 'Business growth planning and scaling strategies',
            icon: 'fas fa-rocket',
            order: 3,
          },
        ],
      },
    },
  });

  const personalService = await prisma.consultancyService.create({
    data: {
      name: 'Personal Development',
      serviceType: 'personal',
      description: 'Personal growth and development programs to unlock your full potential.',
      icon: 'fas fa-user-graduate',
      order: 3,
      features: {
        create: [
          {
            title: 'Goal Setting',
            description: 'Personal goal achievement and life planning',
            icon: 'fas fa-bullseye',
            order: 1,
          },
          {
            title: 'Time Management',
            description: 'Productivity optimization and time management',
            icon: 'fas fa-clock',
            order: 2,
          },
          {
            title: 'Leadership Skills',
            description: 'Leadership development and soft skills training',
            icon: 'fas fa-crown',
            order: 3,
          },
        ],
      },
    },
  });

  console.log('✅ Created consultancy services:', 3);

  // Create site configuration
  const siteConfig = await prisma.siteConfig.create({
    data: {
      siteName: 'Kambel Consult',
      tagline: 'Professional Consulting and Training Services',
      contactEmail: 'info@kambelconsult.com',
      contactPhone: '+1 (555) 123-4567',
      address: '123 Business Street',
      location: 'City, State, Country',
    },
  });
  console.log('✅ Created site configuration');

  // Create hero configuration
  const heroConfig = await prisma.heroConfig.create({
    data: {
      heroTitle: 'Welcome to Kambel Consult',
      heroSubtitle: 'Your trusted partner in career development and business excellence',
      profileName: 'Moses Agbesi Katamani',
      profileTitle: 'Chief Executive Officer',
      yearsExperience: '15+',
      yearsLabel: 'Years Experience',
      yearsDescription: 'Professional Development',
      clientsCount: '5000+',
      clientsLabel: 'Clients',
      clientsDescription: 'Successfully Helped',
      publicationsCount: '50+',
      publicationsLabel: 'Publications',
      publicationsDescription: 'Authored Works',
    },
  });
  console.log('✅ Created hero configuration');

  // Create about configuration
  const aboutConfig = await prisma.aboutConfig.create({
    data: {
      heroYears: '15+',
      heroClients: '500+',
      heroPublications: '50+',
      heroSpeaking: '100+',
      profileName: 'Moses Agbesi Katamani',
      profileTitle: 'Founder & CEO, Kambel Consult',
      bioSummary: 'A visionary leader and expert consultant with over 15 years of experience in education, career development, and business advisory services.',
      tags: 'Education Expert,Career Coach,Business Advisor,Author,Speaker',
      philosophyQuote: 'Education is the foundation of all progress. Through knowledge, guidance, and strategic thinking, we can unlock the potential within every individual and organization.',
      ctaTitle: 'Ready to Work Together?',
      ctaDescription: "Let's discuss how I can help you achieve your goals and unlock your potential.",
    },
  });
  console.log('✅ Created about configuration');

  // Create sample blog posts
  const blogPosts = await Promise.all([
    prisma.blogPost.create({
      data: {
        title: 'Welcome to Kambel Consult',
        content: 'Welcome to our professional consulting and training services. We are committed to helping individuals and organizations achieve their goals through expert guidance and support.',
        excerpt: 'Welcome to our professional consulting and training services.',
        author: 'Kambel Team',
        isPublished: true,
      },
    }),
    prisma.blogPost.create({
      data: {
        title: 'The Importance of Professional Development',
        content: 'Professional development is crucial for career growth and personal success. In today\'s competitive world, continuous learning and skill development are essential.',
        excerpt: 'Professional development is crucial for career growth.',
        author: 'Moses Agbesi Katamani',
        isPublished: true,
      },
    }),
  ]);
  console.log('✅ Created blog posts:', blogPosts.length);

  // Create sample social media links
  const socialMedia = await Promise.all([
    prisma.socialMediaLink.create({
      data: {
        platform: 'facebook',
        url: 'https://facebook.com/kambelconsult',
        iconClass: 'fab fa-facebook',
        order: 1,
      },
    }),
    prisma.socialMediaLink.create({
      data: {
        platform: 'twitter',
        url: 'https://twitter.com/kambelconsult',
        iconClass: 'fab fa-twitter',
        order: 2,
      },
    }),
    prisma.socialMediaLink.create({
      data: {
        platform: 'linkedin',
        url: 'https://linkedin.com/company/kambelconsult',
        iconClass: 'fab fa-linkedin',
        order: 3,
      },
    }),
  ]);
  console.log('✅ Created social media links:', socialMedia.length);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

