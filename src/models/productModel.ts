import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  ProductID: { type: String, required: true },
  ProductName: { type: String, required: true },
  Category: { type: String, required: true },
  Price: { type: Number, required: true },
});

export const Product = mongoose.model('product', productSchema);
