import {  Router } from 'express';
import { Product } from '../models/productModel';
import { getProduct } from '../Controllers/productsController';

const router = Router();

router.get('/',getProduct);

export default router;
