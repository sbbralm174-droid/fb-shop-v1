// src/app/products/page.js
import Link from 'next/link';

// Helper function to get all product data from the API
async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    console.error('Failed to fetch products:', await res.text());
    return { success: false, data: [] };
  }

  const data = await res.json();
  return data;
}

export default async function AllProductsPage() {
  const { success, data: products } = await getProducts();

  if (!success || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            No Products Found
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            আপনার দোকানে এখনো কোনো পণ্য যোগ করা হয়নি।
          </p>
          <Link href="/add-product">
            <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
              একটি পণ্য যোগ করুন
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white text-center mb-10">
          আমাদের সমস্ত পণ্য
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link key={product._id} href={`/products/${product._id}`}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                {/* Product Image */}
                <div className="relative w-full aspect-square">
                  {product.colors[0]?.images[0]?.url ? (
                    <img
                      src={product.colors[0].images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {product.name}
                  </h2>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      ৳{product.colors[0]?.sizes[0]?.price || 'N/A'}
                    </span>
                    <div className="flex items-center text-yellow-500 dark:text-yellow-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.786.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" /></svg>
                      <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">
                        {product.ratings.toFixed(1)} ({product.numOfReviews})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}