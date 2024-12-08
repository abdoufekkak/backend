import { Request, Response, Router } from 'express';
import { Product } from '../models/productModel';


export const getProduct = async (req: Request, res: Response) => {
  try {
    // Agrégation pour obtenir les produits et leurs ventes
    const productsWithSales = await Product.aggregate([
      {
        $lookup: {
          from: 'sales',
          localField: 'ProductID',
          foreignField: 'ProductID',
          as: 'sales',
        },
      },
      {
        $addFields: {
          totalSales: {
            $sum: {
              $map: {
                input: '$sales',
                as: 'sale',
                in: { $toDouble: '$$sale.Quantity' },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          ProductName: 1,
          Price: 1,
          Category: 1,
          totalSales: { $ifNull: ['$totalSales', 0] }, // Garantir que totalSales n'est pas null
        },
      },
    ]);
    

    res.status(200).json(productsWithSales);
  } catch (error) {
    console.error('Error fetching products with sales:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


  