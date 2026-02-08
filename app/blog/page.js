import Link from 'next/link';
import { getPosts } from '@/lib/api';

export default async function BlogPage() {
  let posts = [];
  
  try {
    const response = await getPosts();
    posts = response.data || [];
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">Morphe Labs</Link>
          <nav className="space-x-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/blog" className="text-blue-600 font-semibold">Blog</Link>
            <Link href="/services" className="hover:text-blue-600">Services</Link>
            <Link href="/careers" className="hover:text-blue-600">Careers</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                {post.featuredImage && (
                  <img 
                    src={post.featuredImage} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2 hover:text-blue-600">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  )}
                  <div className="text-sm text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </div>
                </div>
              </article>
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
