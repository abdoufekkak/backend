import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
// import analyticsRoutes from './routes/analytics';
import analyticsRoutes from "./src/Routing/analyticsRoutes"
import connectDB from './db';
import productRoutes from "./src/Routing/productsRoutes"
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import helmet from "helmet"
 connectDB()
const app = express();
app.use(compression({ level: 6 }));
app.use(cors());
app.use(
  express.json({
    limit: "100kb",
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
// Limit request from the same API
const limiter = rateLimit({
  max: 400,
  windowMs: 60 * 60 * 1000,
  message: "Too Many Request from this IP, please try again in an hour",
});
app.use("/api", limiter);
app.use(bodyParser.json());
app.use('/analytics', analyticsRoutes);
app.use('/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
