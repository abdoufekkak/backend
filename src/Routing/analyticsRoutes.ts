import express from 'express';
import { getTotalSales, getTrendingProducts, getCategorySales } from '../Controllers/analyticsController';

const router = express.Router();

router.get('/trending_products', getTrendingProducts);
router.get('/category_sales', getCategorySales);
router.get('/total_sales', getTotalSales);

export default router;
