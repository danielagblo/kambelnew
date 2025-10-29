import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import { Card, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

async function getAboutData() {
  return await prisma.aboutConfig.findFirst({
    where: { isActive: true },
    include: {
      journeyItems: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
      },
      educationItems: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
      },
      achievements: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
      },
      speakingEngagements: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
      },
    },
  });
}

export default async function AboutPage() {
  const about = await getAboutData();

  if (!about) {
    return (
      <>
        <Header />
        <Container className="py-32">
          <p className="text-center text-gray-500">About information not available</p>
        </Container>
        <Footer />
      </>
    );
  }

  const tags = about.tags.split(',').map(t => t.trim());

  return (
    <>
      <Header />
      
      {/* Hero Stats */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-600 to-primary-900 text-white">
        <Container className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-12">About Me</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">{about.heroYears}</div>
              <div className="text-sm text-gray-200">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{about.heroClients}</div>
              <div className="text-sm text-gray-200">Clients Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{about.heroPublications}</div>
              <div className="text-sm text-gray-200">Publications</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{about.heroSpeaking}</div>
              <div className="text-sm text-gray-200">Speaking Engagements</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Profile Section */}
      <section className="py-20">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Profile Picture */}
          <div className="flex justify-center mb-8">
            {about.profilePicture ? (
              <div className="w-64 h-64 md:w-80 md:h-80 relative rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src={about.profilePicture}
                  alt={about.profileName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center shadow-xl">
                <i className="fas fa-user text-7xl text-primary-600" />
              </div>
            )}
          </div>

            {/* Name and Title */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">{about.profileName}</h2>
              <p className="text-xl text-primary-600 mb-6">{about.profileTitle}</p>
              
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bio and Quote */}
            <div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6 text-center">{about.bioSummary}</p>

              <div className="bg-primary-50 border-l-4 border-primary-600 p-6 rounded">
                <i className="fas fa-quote-left text-2xl text-primary-600 mb-4" />
                <p className="text-gray-700 italic">{about.philosophyQuote}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Professional Journey */}
      {about.journeyItems.length > 0 && (
        <section className="py-20 bg-gray-50">
          <Container>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Professional Journey
            </h2>
            <div className="space-y-8">
              {about.journeyItems.map((item, index) => (
                <Card key={item.id} hover>
                  <CardBody>
                    <div className="flex gap-6">
                      <div className="flex-shrink-0 w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                        <i className={`fas fa-${item.icon} text-2xl text-primary-600`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                          <span className="text-sm text-gray-500 font-medium">{item.period}</span>
                        </div>
                        <p className="text-primary-600 font-medium mb-2">{item.organization}</p>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Education & Qualifications */}
      {about.educationItems.length > 0 && (
        <section className="py-20">
          <Container>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Education & Qualifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {about.educationItems.map((item) => (
                <Card key={item.id} hover>
                  <CardBody>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                        <i className={`fas fa-${item.icon} text-xl text-secondary-600`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.qualification}</h3>
                        <p className="text-primary-600 text-sm mb-1">{item.institution}</p>
                        <p className="text-gray-500 text-sm mb-2">{item.year}</p>
                        {item.description && (
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Achievements */}
      {about.achievements.length > 0 && (
        <section className="py-20 bg-gray-50">
          <Container>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Achievements & Recognition
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {about.achievements.map((achievement) => (
                <Card key={achievement.id} hover>
                  <CardBody className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className={`fas fa-${achievement.icon} text-2xl text-primary-600`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    <p className="text-xs text-gray-500">{achievement.year}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Speaking Engagements */}
      {about.speakingEngagements.length > 0 && (
        <section className="py-20">
          <Container>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Speaking Engagements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {about.speakingEngagements.map((engagement) => (
                <Card key={engagement.id} hover>
                  <CardBody>
                    <h3 className="font-semibold text-gray-900 mb-2">{engagement.title}</h3>
                    <p className="text-primary-600 text-sm mb-2">{engagement.event}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <i className="fas fa-calendar mr-2" />
                      {engagement.date}
                      {engagement.location && (
                        <>
                          <span className="mx-2">•</span>
                          <i className="fas fa-map-marker-alt mr-2" />
                          {engagement.location}
                        </>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <Container className="text-center">
          <h2 className="text-3xl font-bold mb-4">{about.ctaTitle}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">{about.ctaDescription}</p>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100">
              Get in Touch <i className="fas fa-arrow-right ml-2" />
            </Button>
          </Link>
        </Container>
      </section>

      <Footer />
    </>
  );
}

