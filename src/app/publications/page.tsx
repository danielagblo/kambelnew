'use client';

import Container from '@/components/layout/Container';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import SmartImage from '@/components/ui/SmartImage';
import { formatCurrency } from '@/lib/utils';
import { useEffect, useState } from 'react';

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
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  console.log('Selected book for modal:', selectedBook);

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

  const openModal = (book: Book) => {
    setSelectedBook(book);
    console.log('Opened modal for book:', book)
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (selectedBook) {
      // lock background scroll
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
      return () => {
        window.removeEventListener('keydown', onKey);
        document.body.style.overflow = prev;
      };
    }
    return () => { };
  }, [selectedBook]);

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
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === null
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
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category.id
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
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
                {filteredBooks.map((book) => (
                  <Card key={book.id} hover onClick={() => openModal(book)} className="cursor-pointer">
                    <div className="aspect-[3/4] relative bg-gray-200">
                      {book.coverImage ? (
                        <SmartImage
                          src={book.coverImage}
                          alt={book.title}
                          fill
                          className="object-cover"
                          unoptimized={book.coverImage.startsWith('/uploads/')}
                          sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-300">
                          <i className="fas fa-book text-3xl sm:text-6xl text-gray-500" />
                        </div>
                      )}
                    </div>
                    <CardBody className="p-2 sm:p-4 md:p-6">
                      {book.category && (
                        <div className="text-[10px] sm:text-xs text-primary-600 font-semibold mb-1 uppercase hidden sm:block">
                          {book.category.name}
                        </div>
                      )}
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1 line-clamp-2">{book.title}</h3>
                      <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-2 hidden sm:block">By {book.author}</p>

                      {book.description && (
                        // className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 md:mb-4 line-clamp-2 hidden sm:block">
                        <div className='sm:block hidden'>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 md:mb-4 line-clamp-4 ">
                            {book.description}
                          </p>
                        </div>

                      )}

                      <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4 gap-1">
                        {book.price > 0 && (
                          <span className="text-sm sm:text-base md:text-lg font-bold text-primary-600">
                            {formatCurrency(Number(book.price))}
                          </span>
                        )}
                        {book.pages > 0 && (
                          <span className="text-[10px] sm:text-xs text-gray-500 hidden sm:inline">
                            <i className="fas fa-file-alt mr-1" />
                            {book.pages}p
                          </span>
                        )}
                      </div>

                      {book.purchaseLink && (
                        <a href={book.purchaseLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" className="w-full text-[10px] sm:text-xs md:text-sm" onClick={(e) => e.stopPropagation()}>
                            Get Book
                          </Button>
                        </a>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </div>

              {/* Modal for selected book */}
              {selectedBook && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
                  <div
                    role="dialog"
                    aria-modal="true"
                    className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 sm:mx-6 overflow-hidden max-h-[90vh] sm:max-h-[80vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-start justify-between p-4 border-b border-gray-100">
                      <div>
                        <h2 className="text-xl font-bold text-primary-600">{selectedBook.title}</h2>
                        <p className="text-sm text-gray-600">By {selectedBook.author}</p>
                      </div>
                      <button
                        onClick={closeModal}
                        aria-label="Close"
                        className="text-primary-600 hover:text-primary-700 ml-4"
                      >
                        <i className="fas fa-times text-lg" />
                      </button>
                    </div>
                    <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden min-h-0">
                      <div className="md:col-span-1">
                        <div className="aspect-[3/4] bg-gray-100 relative">
                          {selectedBook.coverImage ? (
                            <SmartImage
                              src={selectedBook.coverImage}
                              alt={selectedBook.title}
                              fill
                              className="object-cover"
                              unoptimized={selectedBook.coverImage.startsWith('/uploads/')}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gray-300">
                              <i className="fas fa-book text-4xl text-gray-500" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="md:col-span-2 flex flex-col min-h-0">
                        {selectedBook.category && (
                          <div className="text-xs text-primary-600 font-semibold mb-2 uppercase">{selectedBook.category.name}</div>
                        )}

                        {/* Description area grows and scrolls if needed */}
                        <div className="prose prose-sm max-w-none text-gray-700 mb-2 overflow-auto no-scrollbar flex-1">
                          <p>{selectedBook.description}</p>
                        </div>

                        {/* Footer area stays visible - price/pages and action */}
                        <div className="mt-2 sm:mt-4 flex items-center gap-4">
                          {selectedBook.price > 0 && (
                            <div className="text-lg font-bold text-primary-600">{formatCurrency(Number(selectedBook.price))}</div>
                          )}
                          {selectedBook.pages > 0 && (
                            <div className="text-sm text-gray-500">{selectedBook.pages} pages</div>
                          )}

                          <div className="ml-auto">
                            {selectedBook.purchaseLink && (
                              <a
                                href={selectedBook.purchaseLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button className="bg-primary-600 text-white">Get Book</Button>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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

