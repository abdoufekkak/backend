import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  SaleID: { type: String, required: true },
  ProductID: { type: String, required: true}, // Référence à un produit
  Quantity: { type: Number, required: true },
  Date: { type: String, required: true },
  TotalAmount: { type: Number, required: true }, // Calculé lors de l'enregistrement des ventes
});

export const Sale = mongoose.model('sale', saleSchema);
