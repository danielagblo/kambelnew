import { prisma } from '@/lib/prisma';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardBody } from '@/components/ui/Card';
import { format } from 'date-fns';

async function getContactMessages() {
  try {
    return await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return [];
  }
}

export default async function AdminContactsPage() {
  const messages = await getContactMessages();

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-gray-600 mt-2">View and manage contact form submissions</p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <Card>
            <CardBody>
              <p className="text-center text-gray-500 py-8">
                No contact messages yet.
              </p>
            </CardBody>
          </Card>
        ) : (
          messages.map((message) => (
            <Card key={message.id}>
              <CardBody>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{message.name}</h3>
                    <p className="text-sm text-gray-600">{message.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {format(new Date(message.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                    <span
                      className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        message.isRead
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {message.isRead ? 'Read' : 'Unread'}
                    </span>
                  </div>
                </div>
                {message.subject && (
                  <p className="font-medium text-gray-800 mb-2">
                    Subject: {message.subject}
                  </p>
                )}
                <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  );
}

