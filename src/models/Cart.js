import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  images: [{
    public_id: String,
    url: String
  }],
  color: {
    name: String,
    code: String,
  },
  size: {
    size: String,
    price: Number
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
}, { _id: false });

const CartSchema = new mongoose.Schema({
  // Change the user field type from ObjectId to String
  user: {
    type: String,
    required: true,
    unique: true,
  },
  items: [CartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);