'use client';

import Container from '@/components/layout/Container';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import SmartImage from '@/components/ui/SmartImage';
import { useEffect, useState } from 'react';

interface GalleryItem {
  id: string;
  title: string;
  caption: string | null;
  description: string | null;
  mediaType: string;
  image: string | null;
  videoUrl: string | null;
  thumbnail: string | null;
  isFeatured: boolean;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    }
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    return item.mediaType === filter;
  });

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 bg-gradient-to-br from-primary-600 to-primary-900 text-white">
        <Container className="text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">Gallery</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-100 max-w-3xl mx-auto">
            Explore our collection of images and videos showcasing our work and events
          </p>
        </Container>
      </section>

      {/* Filter Buttons */}
      <section className="py-8 bg-gray-50 border-b border-gray-200 sticky top-20 z-40">
        <Container>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('image')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${filter === 'image'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              <i className="fas fa-image mr-2" />
              Images
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${filter === 'video'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              <i className="fas fa-video mr-2" />
              Videos
            </button>
          </div>
        </Container>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <Container>
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-gray-200"
                  onClick={() => setSelectedItem(item)}
                >
                  {item.mediaType === 'image' && item.image ? (
                    <SmartImage
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      unoptimized={item.image?.startsWith('/uploads/')}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : item.mediaType === 'video' ? (
                    <>
                      {item.thumbnail ? (
                        <SmartImage
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : item.videoUrl && getYouTubeVideoId(item.videoUrl) ? (
                        <SmartImage
                          src={`https://img.youtube.com/vi/${getYouTubeVideoId(item.videoUrl)}/maxresdefault.jpg`}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-800">
                          <i className="fas fa-video text-6xl text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <i className="fas fa-play-circle text-6xl text-white opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <i className="fas fa-image text-6xl text-gray-400" />
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                      <h3 className="text-white font-bold text-base line-clamp-2">
                        {item.title}
                      </h3>
                      {item.caption && (
                        <p className="text-gray-200 text-sm italic line-clamp-1">
                          {item.caption}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                      <p className="text-primary-400 text-xs font-medium mt-2">
                        <i className="fas fa-expand mr-1" />
                        Click to view
                      </p>
                    </div>
                  </div>

                  {item.isFeatured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                      <i className="fas fa-star mr-1" />
                      Featured
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <i className="fas fa-images text-6xl text-gray-300 mb-4" />
              <p className="text-xl text-gray-500">No gallery items available</p>
            </div>
          )}
        </Container>
      </section>

      {/* Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-10"
            onClick={() => setSelectedItem(null)}
          >
            <i className="fas fa-times" />
          </button>

          <div className="max-w-7xl w-full h-[90vh] grid grid-cols-1 lg:grid-cols-2 gap-6" onClick={(e) => e.stopPropagation()}>
            {/* Left Side - Scrollable Details */}
            <div className="flex flex-col text-white bg-black/30 rounded-lg backdrop-blur-sm overflow-hidden">
              <div className="p-6 lg:p-8 overflow-y-auto max-h-full">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">{selectedItem.title}</h2>
                {selectedItem.caption && (
                  <p className="text-gray-200 text-lg lg:text-xl mb-6 italic">{selectedItem.caption}</p>
                )}
                {selectedItem.description && (
                  <div className="text-gray-300 text-base lg:text-lg leading-relaxed border-t border-gray-600 pt-6">
                    <p className="whitespace-pre-line">{selectedItem.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Fixed Media */}
            <div className="flex items-center justify-center overflow-hidden">
              {selectedItem.mediaType === 'image' && selectedItem.image ? (
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <SmartImage
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : selectedItem.mediaType === 'video' && selectedItem.videoUrl ? (
                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                  {(() => {
                    const videoId = getYouTubeVideoId(selectedItem.videoUrl);
                    if (videoId) {
                      return (
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={selectedItem.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      );
                    } else {
                      // Fallback for non-YouTube videos
                      return (
                        <video
                          src={selectedItem.videoUrl}
                          controls
                          className="w-full h-full"
                        >
                          Your browser does not support the video tag.
                        </video>
                      );
                    }
                  })()}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

