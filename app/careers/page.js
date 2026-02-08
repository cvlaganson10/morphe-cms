import Link from 'next/link';
import { getCareers } from '@/lib/api';

export default async function CareersPage() {
  let careers = [];
  
  try {
    const response = await getCareers();
    careers = response.data || [];
  } catch (error) {
    console.error('Failed to fetch careers:', error);
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
            <Link href="/services" className="hover:text-blue-600">Services</Link>
            <Link href="/careers" className="text-blue-600 font-semibold">Careers</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl text-gray-600">Build the future with us</p>
        </div>
        
        {careers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No open positions at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {careers.map((career) => (
              <div key={career.id} className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{career.title}</h2>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>📍 {career.location}</span>
                      <span>💼 {career.type.replace('_', ' ')}</span>
                      {career.department && <span>🏢 {career.department}</span>}
                    </div>
                  </div>
                  {career.salary && (
                    <div className="text-lg font-semibold text-blue-600">
                      {career.salary}
                    </div>
                  )}
                </div>
                <div 
                  className="text-gray-600 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: career.description }}
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
