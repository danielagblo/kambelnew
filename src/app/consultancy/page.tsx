import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import { Card, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

async function getConsultancyServices() {
  return await prisma.consultancyService.findMany({
    where: { isActive: true },
    include: {
      features: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { order: 'asc' },
  });
}

export default async function ConsultancyPage() {
  const services = await getConsultancyServices();

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-600 to-primary-900 text-white">
        <Container className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Consultancy Services</h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Expert guidance and professional support to help you achieve your goals
          </p>
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <Container>
          <div className="space-y-16">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-8 items-center`}
              >
                {/* Image */}
                <div className="w-full lg:w-1/2">
                  <div className="aspect-video relative bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden">
                    {service.coverImage ? (
                      <Image
                        src={service.coverImage}
                        alt={service.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <i className={`${service.icon} text-8xl text-primary-600`} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                      <i className={`${service.icon} text-2xl text-primary-600`} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{service.name}</h2>
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-6">{service.description}</p>

                  {/* Features */}
                  {service.features.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900">Key Features:</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {service.features.map((feature) => (
                          <div key={feature.id} className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-1">
                              <i className={`${feature.icon} text-primary-600 text-sm`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                              <p className="text-sm text-gray-600">{feature.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {services.length === 0 && (
            <div className="text-center py-20">
              <i className="fas fa-briefcase text-6xl text-gray-300 mb-4" />
              <p className="text-xl text-gray-500">No services available at the moment</p>
            </div>
          )}
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <Container className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Contact us today to discuss how our consultancy services can help you achieve your goals
          </p>
          <Link href="/contact">
            <Button size="lg">
              Schedule a Consultation <i className="fas fa-arrow-right ml-2" />
            </Button>
          </Link>
        </Container>
      </section>

      <Footer />
    </>
  );
}

