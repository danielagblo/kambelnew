import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import { Card, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';

async function getHomeData() {
  noStore();
  
  const [hero, services, publications, blogPosts, masterclasses] = await Promise.all([
    prisma.heroConfig.findFirst({ where: { isActive: true } }),
    prisma.consultancyService.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: 4,
    }),
    prisma.book.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: { category: true },
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.masterclass.findMany({
      where: { isActive: true, isUpcoming: true },
      orderBy: { date: 'asc' },
      take: 2,
    }),
  ]);

  return { hero, services, publications, blogPosts, masterclasses };
}

export default async function HomePage() {
  const { hero, services, publications, blogPosts, masterclasses } = await getHomeData();

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <Container className="relative z-10 text-center py-16 md:py-32">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight px-4">
            {hero?.heroTitle || 'Welcome to Kambel Consult'}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-gray-100 max-w-3xl mx-auto px-4">
            {hero?.heroSubtitle || 'Your trusted partner in career development and business excellence'}
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-8 mt-8 md:mt-12 mb-8 md:mb-12 px-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-6">
              <div className="text-2xl md:text-4xl font-bold">{hero?.yearsExperience || '15+'}</div>
              <div className="text-xs md:text-sm mt-1 md:mt-2">{hero?.yearsLabel || 'Years Experience'}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-6">
              <div className="text-2xl md:text-4xl font-bold">{hero?.clientsCount || '5000+'}</div>
              <div className="text-xs md:text-sm mt-1 md:mt-2">{hero?.clientsLabel || 'Clients'}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-6">
              <div className="text-2xl md:text-4xl font-bold">{hero?.publicationsCount || '50+'}</div>
              <div className="text-xs md:text-sm mt-1 md:mt-2">{hero?.publicationsLabel || 'Publications'}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link href="/consultancy">
              <Button size="lg" className="px-8">
                Our Services <i className="fas fa-arrow-right ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-8 bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary-700">
                Get in Touch
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive consulting solutions tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Card key={service.id} hover className="text-center">
                <CardBody>
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`${service.icon} text-3xl text-primary-600`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm">{service.description.substring(0, 100)}...</p>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/consultancy">
              <Button variant="outline">View All Services</Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Publications Section */}
      <section className="py-20">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Publications</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our latest books and resources
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {publications.map((book) => (
              <Card key={book.id} hover>
                <div className="aspect-[3/4] relative bg-gray-200">
                  {book.coverImage && (
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover"
                      unoptimized={book.coverImage.startsWith('/uploads/')}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                </div>
                <CardBody>
                  <div className="text-sm text-primary-600 font-medium mb-1">
                    {book.category?.name}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">By {book.author}</p>
                  {book.purchaseLink && (
                    <a href={book.purchaseLink} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="w-full">
                        Get Book <i className="fas fa-external-link-alt ml-2" />
                      </Button>
                    </a>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/publications">
              <Button variant="outline">View All Publications</Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Masterclass Section */}
      {masterclasses.length > 0 && (
        <section className="py-20 bg-gray-50">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Masterclasses</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join our expert-led training sessions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {masterclasses.map((masterclass) => (
                <Card key={masterclass.id} hover>
                  {masterclass.coverImage && (
                    <div className="aspect-video relative bg-gray-200">
                      <Image
                        src={masterclass.coverImage}
                        alt={masterclass.title}
                        fill
                        className="object-cover"
                        unoptimized={masterclass.coverImage.startsWith('/uploads/')}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <CardBody>
                    <h3 className="text-xl font-semibold mb-2">{masterclass.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <i className="fas fa-calendar mr-2" />
                      {new Date(masterclass.date).toLocaleDateString()}
                      <span className="mx-2">•</span>
                      <i className="fas fa-clock mr-2" />
                      {masterclass.duration}
                    </div>
                    <p className="text-gray-600 mb-4">
                      {masterclass.description.substring(0, 150)}...
                    </p>
                    <Link href={`/masterclass#${masterclass.id}`}>
                      <Button className="w-full">
                        Register Now
                      </Button>
                    </Link>
                  </CardBody>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/masterclass">
                <Button variant="outline">View All Masterclasses</Button>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* Blog Section */}
      {blogPosts.length > 0 && (
        <section className="py-20">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Insights</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Read our latest articles and updates
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} hover>
                  {post.coverImage && (
                    <div className="aspect-video relative bg-gray-200">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        unoptimized={post.coverImage.startsWith('/uploads/')}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <CardBody>
                    <div className="text-sm text-gray-500 mb-2">
                      {new Date(post.createdAt).toLocaleDateString()} • {post.author}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {post.excerpt || post.content.substring(0, 100)}...
                    </p>
                    <Link href={`/blog/${post.id}`}>
                      <Button size="sm" variant="ghost">
                        Read More <i className="fas fa-arrow-right ml-2" />
                      </Button>
                    </Link>
                  </CardBody>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/blog">
                <Button variant="outline">View All Articles</Button>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <Container className="text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Future?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let's work together to achieve your personal and professional goals
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100">
              Get Started Today <i className="fas fa-arrow-right ml-2" />
            </Button>
          </Link>
        </Container>
      </section>

      <Footer />
    </>
  );
}

