import Link from 'next/link';
import { getServices } from '@/lib/api';

export default async function ServicesPage() {
  let services = [];
  
  try {
    const response = await getServices();
    services = response.data || [];
  } catch (error) {
    console.error('Failed to fetch services:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">Morphe Labs</Link>
          <nav className="space-x-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/blog" className="hover:text-blue-600">Blog</Link>
            <Link href="/services" className="text-blue-600 font-semibold">Services</Link>
            <Link href="/careers" className="hover:text-blue-600">Careers</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-gray-600">Innovative solutions to transform your business</p>
        </div>
        
        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No services available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition">
                {service.icon && (
                  <div className="text-5xl mb-4">{service.icon}</div>
                )}
                <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
                <div 
                  className="text-gray-600"
                  dangerouslySetInnerHTML={{ __html: service.description }}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 Morphe Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
