// src/app/products/[id]/page.js
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductActionButtons from './ProductActionButtons'; 

// Helper function to get a single product by ID
async function getProductDetails(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/${id}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      console.error('Failed to fetch product details. Status:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    if (!data.success) {
        console.error('API Error:', data.error);
        return null;
    }
    return data.data;
  } catch (error) {
    console.error('Network or parsing error:', error);
    return null;
  }
}

export default async function ProductDetailsPage({ params }) {
  // এখানে `params` অবজেক্টটিকে `await` করুন।
  const { id } = await params;
  const product = await getProductDetails(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {product.name}
          </h1>
          <div className="flex items-center text-yellow-500 dark:text-yellow-400 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.786.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" /></svg>
            <span className="ml-2 text-gray-600 dark:text-gray-300">
              {product.ratings.toFixed(1)} রেটিং ({product.numOfReviews} রিভিউ)
            </span>
          </div>
          <p className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {product.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 dark:bg-indigo-500 rounded-full">
              {product.category}
            </span>
            {product.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <ProductActionButtons product={product} />

          <div className="mt-10 space-y-8">
            {product.colors.map((color, colorIndex) => (
              <div key={colorIndex} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-6 h-6 rounded-full mr-3 border border-gray-300 dark:border-gray-600" style={{ backgroundColor: color.code }}></span>
                  রঙ: {color.name}
                </h3>

                <div className="flex flex-wrap gap-4 mt-4">
                  {color.images.length > 0 ? (
                    color.images.map((image, imageIndex) => (
                      <img
                        key={imageIndex}
                        src={image.url}
                        alt={`${product.name} - ${color.name} - ${imageIndex + 1}`}
                        className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg shadow-md border-2 border-transparent hover:border-indigo-500 transition-transform duration-200 transform hover:scale-105"
                      />
                    ))
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">No images available for this color.</span>
                  )}
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">সাইজ ও দাম:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {color.sizes.map((size, sizeIndex) => (
                      <div key={sizeIndex} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 flex flex-col justify-between">
                        <span className="font-bold text-gray-900 dark:text-white text-md">
                          সাইজ: {size.size}
                        </span>
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400 text-lg">
                          ৳{size.price}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                          স্টক: {size.stock}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {product.category === 'electronics' && (
            <div className="mt-10 bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">অতিরিক্ত তথ্য</h3>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">ব্র্যান্ড:</span> {product.brand || 'N/A'}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">মডেল:</span> {product.model || 'N/A'}
              </p>
              {product.specifications && product.specifications.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">নির্দিষ্ট বিবরণ:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {product.specifications.map((spec, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">{spec.key}:</span> {spec.value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}