'use client';

import { useState } from 'react';

export default function ProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'clothing',
    colors: [{
      name: '',
      code: '',
      images: [{ public_id: '', url: '' }],
      sizes: [{ size: '', price: '', stock: '' }],
    }],
    brand: '',
    model: '',
    specifications: [{ key: '', value: '' }],
    tags: [],
    featured: false,
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  // --- Color Block handlers ---
  const addColorBlock = () => {
    setFormData((prevData) => ({
      ...prevData,
      colors: [...prevData.colors, {
        name: '',
        code: '',
        images: [{ public_id: '', url: '' }],
        sizes: [{ size: '', price: '', stock: '' }],
      }],
    }));
  };
  
  const removeColorBlock = (colorIndex) => {
    const newColors = formData.colors.filter((_, i) => i !== colorIndex);
    setFormData((prevData) => ({ ...prevData, colors: newColors }));
  };
  
  // --- Color Info & Image handlers ---
  const handleColorInfoChange = (colorIndex, e) => {
    const { name, value } = e.target;
    const newColors = [...formData.colors];
    const updatedColor = { ...newColors[colorIndex] };
    updatedColor[name] = value;
    newColors[colorIndex] = updatedColor;
    setFormData((prevData) => ({ ...prevData, colors: newColors }));
  };
  
  const handleColorImageChange = (colorIndex, imageIndex, e) => {
    const { name, value } = e.target;
    const newColors = [...formData.colors];
    const newImages = [...newColors[colorIndex].images];
    newImages[imageIndex] = { ...newImages[imageIndex], [name]: value };
    newColors[colorIndex].images = newImages;
    setFormData((prevData) => ({ ...prevData, colors: newColors }));
  };
  
  const addColorImageField = (colorIndex) => {
    const newColors = [...formData.colors];
    newColors[colorIndex].images.push({ public_id: '', url: '' });
    setFormData((prevData) => ({ ...prevData, colors: newColors }));
  };
  
  const removeColorImageField = (colorIndex, imageIndex) => {
    const newColors = [...formData.colors];
    newColors[colorIndex].images = newColors[colorIndex].images.filter((_, i) => i !== imageIndex);
    setFormData((prevData) => ({ ...prevData, colors: newColors }));
  };
  
  // --- Size, Price, Stock handlers ---
  const handleSizeChange = (colorIndex, sizeIndex, e) => {
    const { name, value } = e.target;
    const newColors = [...formData.colors];
    newColors[colorIndex].sizes[sizeIndex][name] = value;
    setFormData((prevData) => ({ ...prevData, colors: newColors }));
  };
  
  const addSizeField = (colorIndex) => {
    const newColors = [...formData.colors];
    newColors[colorIndex].sizes.push({ size: '', price: '', stock: '' });
    setFormData((prevData) => ({ ...prevData, colors: newColors }));
  };
  
  const removeSizeField = (colorIndex, sizeIndex) => {
    const newColors = [...formData.colors];
    newColors[colorIndex].sizes = newColors[colorIndex].sizes.filter((_, i) => i !== sizeIndex);
    setFormData((prevData) => ({ ...prevData, colors: newColors }));
  };
  
  // --- Tag handlers (newly updated for better UX) ---
  const addTag = (e) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData((prevData) => ({
          ...prevData,
          tags: [...prevData.tags, newTag],
        }));
        e.target.value = '';
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter((tag) => tag !== tagToRemove),
    }));
  };
  
  // --- Other handlers (specifications, tags) are same as before ---
  const handleSpecificationChange = (index, e) => {
    const { name, value } = e.target;
    const newSpecs = [...formData.specifications];
    newSpecs[index] = { ...newSpecs[index], [name]: value };
    setFormData((prevData) => ({ ...prevData, specifications: newSpecs }));
  };
  
  const addSpecificationField = () => {
    setFormData((prevData) => ({
      ...prevData,
      specifications: [...prevData.specifications, { key: '', value: '' }],
    }));
  };
  
  const removeSpecificationField = (index) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData((prevData) => ({ ...prevData, specifications: newSpecs }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const dataToSend = {
      ...formData,
      tags: formData.tags.filter(tag => tag),
      specifications: formData.specifications.filter(spec => spec.key || spec.value),
      colors: formData.colors.map(color => ({
        ...color,
        images: color.images.filter(img => img.url || img.public_id),
        sizes: color.sizes.map(size => ({
          ...size,
          price: parseFloat(size.price),
          stock: parseInt(size.stock, 10),
        })).filter(size => size.size && size.price > 0 && size.stock >= 0),
      })).filter(color => color.name),
    };
  
    console.log("Submitting:", dataToSend);
  
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (res.ok) {
        const result = await res.json();
        alert('Product added successfully!');
        console.log('Product added:', result);
        // Reset form
        setFormData({
          name: '', description: '', category: 'clothing',
          colors: [{ name: '', code: '', images: [{ public_id: '', url: '' }], sizes: [{ size: '', price: '', stock: '' }] }],
          brand: '', model: '', specifications: [{ key: '', value: '' }],
          tags: [], featured: false,
        });
      } else {
        const errorData = await res.json();
        alert(`Failed to add product: ${errorData.error || res.statusText}`);
        console.error('Failed to add product:', errorData);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('An unexpected error occurred.');
    }
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-10">
      <div className="mx-auto max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
          নতুন পণ্য যুক্ত করুন
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          সকল তথ্য সঠিকভাবে পূরণ করে আপনার পণ্যটি আপলোড করুন।
        </p>
  
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Product Info Section */}
          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl shadow-inner space-y-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">সাধারণ তথ্য</h3>
            {/* ... (Existing Name, Description, Category fields) ... */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">পণ্যের নাম</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} placeholder="উদাহরণ: Xiaomi Redmi Note 13 Pro" required className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"/>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">পণ্যের বিবরণ</label>
              <textarea name="description" id="description" value={formData.description} onChange={handleChange} placeholder="পণ্যের বিস্তারিত বিবরণ দিন" required rows="4" className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"/>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ক্যাটেগরি</label>
              <select name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300">
                <option value="clothing">Clothing</option>
                <option value="electronics">Electronics</option>
                <option value="accessories">Accessories</option>
                <option value="footwear">Footwear</option>
              </select>
            </div>
          </div>
          
          {/* Colors & Sizes Section */}
          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl shadow-inner space-y-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">পণ্যের ভিন্নতা (Variants)</h3>
            {formData.colors.map((color, colorIndex) => (
              <div key={colorIndex} className="border border-gray-300 dark:border-gray-600 p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-gray-800 dark:text-white">রং {colorIndex + 1}</h4>
                  <button type="button" onClick={() => removeColorBlock(colorIndex)} className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none transition-transform duration-300 transform hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                </div>
  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">রঙের নাম</label>
                    <input type="text" name="name" value={color.name} onChange={(e) => handleColorInfoChange(colorIndex, e)} placeholder="উদাহরণ: লাল" className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">রঙের কোড</label>
                    <input type="text" name="code" value={color.code} onChange={(e) => handleColorInfoChange(colorIndex, e)} placeholder="উদাহরণ: #FF0000" className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"/>
                  </div>
                </div>
  
                <div className="border border-gray-200 dark:border-gray-600 p-4 rounded-md mt-4">
                  <h5 className="font-medium text-gray-800 dark:text-white mb-2">এই রঙের জন্য ছবি</h5>
                  {color.images.map((image, imageIndex) => (
                    <div key={imageIndex} className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-2">
                      <input type="text" name="public_id" value={image.public_id} onChange={(e) => handleColorImageChange(colorIndex, imageIndex, e)} placeholder="Image Public ID" className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                      <input type="url" name="url" value={image.url} onChange={(e) => handleColorImageChange(colorIndex, imageIndex, e)} placeholder="Image URL" className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                      <button type="button" onClick={() => removeColorImageField(colorIndex, imageIndex)} className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-transform duration-300 transform hover:scale-105">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addColorImageField(colorIndex)} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-transform duration-300 transform hover:scale-105">Add Image</button>
                </div>
  
                <div className="border border-gray-200 dark:border-gray-600 p-4 rounded-md mt-4">
                  <h5 className="font-medium text-gray-800 dark:text-white mb-2">সাইজ, দাম ও স্টক</h5>
                  {color.sizes.map((sizeVariant, sizeIndex) => (
                    <div key={sizeIndex} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2 items-end">
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">সাইজ</label>
                        <input type="text" name="size" value={sizeVariant.size} onChange={(e) => handleSizeChange(colorIndex, sizeIndex, e)} placeholder="S, M, L" required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                      </div>
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">দাম (BDT)</label>
                        <input type="number" name="price" value={sizeVariant.price} onChange={(e) => handleSizeChange(colorIndex, sizeIndex, e)} placeholder="দাম" required min="0" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                      </div>
                      <div className="col-span-1 flex items-end space-x-2">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">স্টক</label>
                          <input type="number" name="stock" value={sizeVariant.stock} onChange={(e) => handleSizeChange(colorIndex, sizeIndex, e)} placeholder="স্টক সংখ্যা" required min="0" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                        </div>
                        <button type="button" onClick={() => removeSizeField(colorIndex, sizeIndex)} className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-transform duration-300 transform hover:scale-105 mb-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => addSizeField(colorIndex)} className="mt-2 flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-transform duration-300 transform hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>সাইজ যোগ করুন</span>
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addColorBlock}
              className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300"
            >
              আরেকটি রং যোগ করুন
            </button>
          </div>
          
          {/* Tags & Featured (UPDATED UI) */}
          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl shadow-inner space-y-4">
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ট্যাগ (লিখে Enter চাপুন)</label>
              <input
                type="text"
                id="tags"
                placeholder="উদাহরণ: মোবাইল, গ্যাজেট, স্মার্টফোন"
                onKeyDown={addTag}
                className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="flex items-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1.5 text-red-500 hover:text-red-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
            {/* Featured */}
            <div className="flex items-center">
              <input id="featured" name="featured" type="checkbox" checked={formData.featured} onChange={handleChange} className="h-5 w-5 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"/>
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">ফিচার্ড পণ্য</label>
            </div>
          </div>
          
          {/* Conditional Fields for Electronics */}
          {formData.category === 'electronics' && (
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl shadow-inner space-y-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">ইলেকট্রনিক্সের জন্য অতিরিক্ত তথ্য</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ব্র্যান্ড</label>
                  <input type="text" name="brand" id="brand" value={formData.brand} onChange={handleChange} placeholder="উদাহরণ: Samsung" className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"/>
                </div>
                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300">মডেল</label>
                  <input type="text" name="model" id="model" value={formData.model} onChange={handleChange} placeholder="উদাহরণ: Galaxy S24 Ultra" className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"/>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">নির্দিষ্ট বিবরণ (Specifications)</label>
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-4">
                    <input type="text" name="key" value={spec.key} onChange={(e) => handleSpecificationChange(index, e)} placeholder="Key (যেমন: RAM, Storage)" className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"/>
                    <input type="text" name="value" value={spec.value} onChange={(e) => handleSpecificationChange(index, e)} placeholder="Value (যেমন: 8GB, 256GB SSD)" className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"/>
                    <button type="button" onClick={() => removeSpecificationField(index)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300 w-full md:w-auto">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={addSpecificationField} className="mt-2 w-full md:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300">Add Specification</button>
              </div>
            </div>
          )}
  
          {/* Submit Button */}
          <button type="submit" className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-3 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 transform hover:scale-105">পণ্য যোগ করুন</button>
        </form>
      </div>
    </div>
  );
}