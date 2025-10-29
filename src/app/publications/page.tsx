'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import { Card, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  pages: number;
  price: number;
  coverImage: string | null;
  purchaseLink: string | null;
  category: Category | null;
}

export default function PublicationsPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, categoriesRes] = await Promise.all([
        fetch('/api/publications'),
        fetch('/api/categories'),
      ]);

      if (booksRes.ok && categoriesRes.ok) {
        const booksData = await booksRes.json();
        const categoriesData = await categoriesRes.json();
        setBooks(booksData);
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = selectedCategory
    ? books.filter((book) => book.category?.id === selectedCategory)
    : books;

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 bg-gradient-to-br from-primary-600 to-primary-900 text-white">
        <Container className="text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">Publications</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-100 max-w-3xl mx-auto">
            Discover our collection of books and resources designed to inspire, educate, and empower
          </p>
        </Container>
      </section>

      {/* Publications Grid */}
      <section className="py-20">
        <Container>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <i className="fas fa-spinner fa-spin text-4xl text-primary-600" />
            </div>
          ) : (
            <>
              {/* Categories Filter */}
              <div className="flex flex-wrap gap-4 justify-center mb-12">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === null
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50'
                  }`}
                >
                  All Books ({books.length})
                </button>
                {categories.map((category) => {
                  const count = books.filter((book) => book.category?.id === category.id).length;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50'
                      }`}
                    >
                      {category.name} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Books Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
              <Card key={book.id} hover>
                <div className="aspect-[3/4] relative bg-gray-200">
                  {book.coverImage ? (
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover"
                      unoptimized={book.coverImage.startsWith('/uploads/')}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-300">
                      <i className="fas fa-book text-6xl text-gray-500" />
                    </div>
                  )}
                </div>
                <CardBody>
                  {book.category && (
                    <div className="text-xs text-primary-600 font-semibold mb-2 uppercase">
                      {book.category.name}
                    </div>
                  )}
                  <h3 className="text-lg font-semibold mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">By {book.author}</p>
                  
                  {book.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {book.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    {book.pages > 0 && (
                      <span className="text-sm text-gray-500">
                        <i className="fas fa-file-alt mr-1" />
                        {book.pages} pages
                      </span>
                    )}
                    {book.price > 0 && (
                      <span className="text-lg font-bold text-primary-600">
                        {formatCurrency(Number(book.price))}
                      </span>
                    )}
                  </div>

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

              {filteredBooks.length === 0 && (
                <div className="text-center py-20">
                  <i className="fas fa-book text-6xl text-gray-300 mb-4" />
                  <p className="text-xl text-gray-500">
                    {selectedCategory 
                      ? 'No publications in this category'
                      : 'No publications available at the moment'
                    }
                  </p>
                </div>
              )}
            </>
          )}
        </Container>
      </section>

      <Footer />
    </>
  );
}

