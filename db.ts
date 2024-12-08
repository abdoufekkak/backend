import mongoose from 'mongoose';
// Remplacez par votre URI MongoDB Atlas
const uri = 'mongodb+srv://abdoufekkak:SRO5Br1UUI0wtiz6@cluster0.nw9fxbh.mongodb.net/test';
const connectDB = async () => {
    try {
      mongoose.set('bufferCommands', false); // Désactive le buffering des commandes
      mongoose.set('debug', true); // Active le mode debug de mongoose pour plus d'informations
  
      await mongoose.connect(uri, {

      });
  
      console.log('Connexion réussie à MongoDB Atlas');
    } catch (error) {
      console.error('Erreur de connexion à MongoDB Atlas:', error);
    }
  };
  
  export default connectDB;