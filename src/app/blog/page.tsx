import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import { Card, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

async function getBlogPosts() {
  return await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 bg-gradient-to-br from-primary-600 to-primary-900 text-white">
        <Container className="text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">Blog & Insights</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-100 max-w-3xl mx-auto">
            Read our latest articles, insights, and updates on career development and professional growth
          </p>
        </Container>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <Container>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card key={post.id} hover>
                  {post.coverImage && (
                    <div className="h-48 relative bg-gray-200">
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
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <i className="fas fa-calendar mr-2" />
                      {formatDate(post.createdAt)}
                      <span className="mx-2">•</span>
                      <i className="fas fa-user mr-2" />
                      {post.author}
                    </div>
                    <h2 className="text-xl font-semibold mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt || post.content.substring(0, 150)}...
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
          ) : (
            <div className="text-center py-20">
              <i className="fas fa-blog text-6xl text-gray-300 mb-4" />
              <p className="text-xl text-gray-500">No blog posts available at the moment</p>
            </div>
          )}
        </Container>
      </section>

      <Footer />
    </>
  );
}

