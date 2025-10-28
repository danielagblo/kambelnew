import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

async function getGalleryItems() {
  return await prisma.galleryItem.findMany({
    orderBy: {
      order: 'asc',
    },
  });
}

// Extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

export default async function AdminGalleryPage() {
  const items = await getGalleryItems();

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
          <p className="text-gray-600 mt-2">Manage your media gallery</p>
        </div>
        <Link href="/admin/gallery/new">
          <Button>
            <i className="fas fa-plus mr-2" />
            Add Media
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <Card className="col-span-full">
            <CardBody>
              <p className="text-center text-gray-500 py-8">
                No gallery items found. Add your first item!
              </p>
            </CardBody>
          </Card>
        ) : (
          items.map((item) => {
            const videoId = item.videoUrl ? getYouTubeVideoId(item.videoUrl) : null;
            
            return (
            <Card key={item.id}>
              <CardBody>
                <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                  {item.mediaType === 'image' && item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : item.mediaType === 'video' ? (
                    <>
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : videoId ? (
                        <img
                          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <i className="fas fa-video text-4xl text-gray-400" />
                      )}
                      {(item.thumbnail || videoId) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <i className="fas fa-play-circle text-5xl text-white opacity-80 drop-shadow-lg" />
                        </div>
                      )}
                    </>
                  ) : (
                    <i className="fas fa-image text-4xl text-gray-400" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                {item.caption && (
                  <p className="text-sm text-gray-600 mb-2">{item.caption}</p>
                )}
                <div className="flex justify-between items-center">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <Link
                    href={`/admin/gallery/${item.id}`}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <i className="fas fa-edit" />
                  </Link>
                </div>
              </CardBody>
            </Card>
          );
          })
        )}
      </div>
    </AdminLayout>
  );
}

