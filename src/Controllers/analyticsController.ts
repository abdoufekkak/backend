import { Request, Response } from 'express';
import { Sale } from '../models/saleModel';

export const getTotalSales = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    // Validation des dates
    if (!startDate || !endDate) {
      res.status(400).json({ message: 'Les dates de début et de fin sont requises.' });
      return;
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    // Vérifiez si les dates sont valides
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ message: 'Les dates de début et de fin doivent être valides.' });
      return;
    }
 
    // Agrégation des ventes
    const totalSales = await Sale.aggregate([
      {
        $match: {
          Date: { 
            $gte: start.toISOString().split("T")[0], // Date de début au format "YYYY-MM-DD"
            $lt: end.toISOString().split("T")[0],   // Date de fin au format "YYYY-MM-DD"
          },
        },
      },
      {
        $addFields: {
          TotalAmountNum: { $toDouble: "$TotalAmount" }, // Convertir TotalAmount en nombre
        },
      },
      {
        $group: {
          _id: null,
          totalSalesAmount: { $sum: "$TotalAmountNum" }, // Somme des montants
        },
      },
    ]);
    
    console.log(totalSales);

    // Réponse avec le total
    res.json({
      totalSalesAmount: totalSales.length > 0 ? totalSales[0].totalSalesAmount : 0,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Erreur lors de la récupération des ventes totales.',
    });
  }
};

export const getTrendingProducts = async (req: Request, res: Response) => {
  try {
    const trendingProducts = await Sale.aggregate([
      // Ajouter une étape pour convertir `Quantity` et `TotalAmount` en nombres
      {
        $addFields: {
          Quantity: { $toDouble: '$Quantity' }, // Convertir la quantité en nombre
          TotalAmount: { $toDouble: '$TotalAmount' }, // Convertir le montant total en nombre
        },
      },
      // Grouper par ProductID et calculer la quantité totale vendue et les revenus totaux
      {
        $group: {
          _id: '$ProductID',
          totalSales: { $sum: '$Quantity' }, // Somme des quantités vendues
          totalRevenue: { $sum: '$TotalAmount' }, // Somme des montants totaux
        },
      },
      // Trier par quantité vendue décroissante
      { $sort: { totalSales: -1 } },
      // Limiter aux 3 produits les plus vendus
      { $limit: 3 },
      // Joindre avec la collection `products` pour récupérer les détails du produit
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'ProductID',
          as: 'productDetails',
        },
      },
      // Aplatir le tableau `productDetails`
      { $unwind: '$productDetails' },
      // Projeter uniquement les champs nécessaires
      {
        $project: {
          _id: 0, // Supprimer l'identifiant interne
          name: '$productDetails.ProductName', // Nom du produit
          quantity: '$totalSales', // Quantité totale vendue
          totalSales: '$totalRevenue', // Montant total des ventes
        },
      },
    ]);

    // Retourner les produits populaires
    res.json(trendingProducts);
  } catch (err) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des produits populaires.',
      error: (err as Error).message,
    });
  }
};

export const getCategorySales = async (req: Request, res: Response) => {
  try {
    // Premièrement, on récupère les ventes par catégorie avec l'agrégation
    const categorySales = await Sale.aggregate([
      // Joindre la collection `products` pour obtenir les détails du produit (y compris la catégorie)
      {
        $lookup: {
          from: 'products',
          localField: 'ProductID',
          foreignField: 'ProductID',
          as: 'product',
        },
      },
      // Aplatir le tableau `product` pour accéder directement aux champs
      { $unwind: '$product' },
      // Convertir `Quantity` en nombre
      {
        $addFields: {
          Quantity: { $toDouble: '$Quantity' }, // Convertir Quantity en nombre
        },
      },
      // Grouper par catégorie et calculer les ventes totales
      { 
        $group: { 
          _id: '$product.Category', 
          totalSales: { $sum: '$Quantity' } 
        }
      },
      // Trier les résultats par ordre décroissant des ventes
      { $sort: { totalSales: -1 } },
    ]);

    // Calcul du total des ventes
    const totalSales = categorySales.reduce((total, category) => total + category.totalSales, 0);

    // Calcul du pourcentage des ventes par catégorie
    const categorySalesWithPercentage = categorySales.map(category => ({
      category: category._id,
      totalSales: category.totalSales,
      percentage: totalSales > 0 ? ((category.totalSales / totalSales) * 100).toFixed(2) : 0, // Calcul du pourcentage
    }));

    // Réponse avec les ventes par catégorie, incluant le nombre et le pourcentage des ventes
    res.json(categorySalesWithPercentage);
  } catch (err) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des ventes par catégorie.',
    });
  }
};


  