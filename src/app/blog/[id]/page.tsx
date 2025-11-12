import CopyLinkButton from '@/components/CopyLinkButton';
import Container from '@/components/layout/Container';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import SmartImage from '@/components/ui/SmartImage';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  author: string;
  coverImage: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post || !post.isPublished) {
    return {
      title: 'Kambel Consult - Blog',
      description: 'Kambel Consult blog',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const url = `${siteUrl}/blog/${post.id}`;
  const image = post.coverImage ? (post.coverImage.startsWith('/') ? `${siteUrl}${post.coverImage}` : post.coverImage) : undefined;

  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 150),
    keywords: ['consulting', 'career development', 'blog', 'kambel'],
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 50),
      url,
      images: image ? [{ url: image }] : [],
      type: 'article',
      locale: 'en_US',
    },
  };
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post || !post.isPublished) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

  return (
    <>
      <Header />

      {/* Article Header */}
      <section className="pt-32 pb-12">
        <Container size="md">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center justify-center text-gray-600">
              <i className="fas fa-calendar mr-2" />
              {formatDate(post.createdAt)}
              <span className="mx-3">•</span>
              <i className="fas fa-user mr-2" />
              {post.author}
            </div>
          </div>

          {post.coverImage && (
            <div className="h-64 md:h-96 relative rounded-lg overflow-hidden mb-8">
              <SmartImage
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                unoptimized={post.coverImage.startsWith('/uploads/')}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              />
            </div>
          )}
        </Container>
      </section>

      {/* Article Content */}
      <section className="pb-12">
        <Container size="md">
          <article className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
        </Container>
      </section>

      {/* Share Section */}
      <section className="pb-20">
        <Container size="md">
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
            <div className="flex flex-wrap gap-3">
              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${siteUrl}/blog/${post.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#0d66d9] transition-colors"
              >
                <i className="fab fa-facebook-f mr-2" />
                Facebook
              </a>

              {/* Twitter/X */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${siteUrl}/blog/${post.id}`)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#0d8bd9] transition-colors"
              >
                <i className="fab fa-twitter mr-2" />
                Twitter
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${siteUrl}/blog/${post.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors"
              >
                <i className="fab fa-linkedin-in mr-2" />
                LinkedIn
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + `${siteUrl}/blog/${post.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#1da851] transition-colors"
              >
                <i className="fab fa-whatsapp mr-2" />
                WhatsApp
              </a>

              {/* Email */}
              <a
                href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`Check out this article: ${siteUrl}/blog/${post.id}`)}`}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <i className="fas fa-envelope mr-2" />
                Email
              </a>

              {/* Copy Link (client) */}
              <CopyLinkButton id={post.id} />
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}

