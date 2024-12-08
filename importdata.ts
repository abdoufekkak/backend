import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import csv from 'csv-parser';

// Remplacez par votre URI MongoDB Atlas
const uri = 'mongodb+srv://abdoufekkak:SRO5Br1UUI0wtiz6@cluster0.nw9fxbh.mongodb.net/test';

// Le chemin du fichier CSV
const csvFilePath = 'C:/Users/fekkak/Downloads/mam/sales.csv';

// Connexion à la base de données MongoDB
async function connectToDatabase() {
  const client = new MongoClient(uri);
  await client.connect();
  console.log('Connected to MongoDB Atlas');
  return client;
}

// Fonction pour lire et importer le CSV dans MongoDB
async function importCsvToMongo() {
  const client = await connectToDatabase();
  const db = client.db('test'); // Remplacez par votre nom de base de données
  const collection = db.collection('sales'); // Remplacez par le nom de votre collection

  const records: any[] = [];

  // Lire le fichier CSV
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => {
      records.push(data); // Ajouter les enregistrements dans le tableau
    })
    .on('end', async () => {
      console.log(`CSV file loaded. Found ${records.length} records.`);

      // Insérer les données dans MongoDB
      try {
        const result = await collection.insertMany(records);
        console.log(`${result.insertedCount} records inserted into the database`);
      } catch (error) {
        console.error('Error inserting records:', error);
      }

      // Fermer la connexion à la base de données
      client.close();
    });
}

// Appeler la fonction pour importer le CSV
importCsvToMongo().catch((error) => {
  console.error('Error in importing CSV:', error);
});
