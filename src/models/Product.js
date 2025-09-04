import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SizeVariantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: [true, 'সাইজ প্রয়োজন'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'দাম প্রয়োজন'],
    min: [0, 'দাম শূন্যের কম হতে পারবে না']
  },
  stock: {
    type: Number,
    required: [true, 'স্টক সংখ্যা প্রয়োজন'],
    min: [0, 'স্টক শূন্যের কম হতে পারবে না']
  }
}, { _id: false });

const ColorVariantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'রঙের নাম প্রয়োজন'],
    trim: true
  },
  code: String,
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  sizes: [SizeVariantSchema]
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'পণ্যের নাম প্রয়োজন'],
    trim: true,
    maxLength: [100, 'পণ্যের নাম ১০০ অক্ষরের বেশি হতে পারবে না']
  },
  description: {
    type: String,
    required: [true, 'পণ্যের বিবরণ প্রয়োজন'],
    maxLength: [2000, 'বিবরণ ২০০০ অক্ষরের বেশি হতে পারবে না']
  },
  category: {
    type: String,
    required: [true, 'ক্যাটেগরি প্রয়োজন'],
    enum: {
      values: ['clothing', 'electronics', 'accessories', 'footwear'],
      message: 'সঠিক ক্যাটেগরি নির্বাচন করুন'
    }
  },
  colors: {
    type: [ColorVariantSchema],
    required: [true, 'কমপক্ষে একটি রঙের ভিন্নতা প্রয়োজন'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'কমপক্ষে একটি রঙের ভিন্নতা প্রয়োজন'
    }
  },
  brand: {
    type: String,
    maxLength: [50, 'ব্র্যান্ডের নাম ৫০ অক্ষরের বেশি হতে পারবে না']
  },
  model: {
    type: String,
    maxLength: [50, 'মডেলের নাম ৫০ অক্ষরের বেশি হতে পারবে না']
  },
  specifications: [{
    key: String,
    value: String
  }],
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  ratings: {
    type: Number,
    default: 0
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Review'
  }],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true
});

ProductSchema.index({ name: 'text', description: 'text', 'colors.name': 'text', 'colors.sizes.size': 'text', 'brand': 'text', 'model': 'text', 'tags': 'text' });

export const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);