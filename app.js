const express  = require('express');
const mongoose = require('mongoose');
const Livre    = require('./models/Livre');

const app  = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connexion MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI 
  || 'mongodb+srv://assiabensghir5_db_user:TycnpruKEMRjbSyc@cluster0.eapnrk8.mongodb.net/ma_bibliotheque?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connecté à MongoDB Atlas'))
  .catch(err => console.error('❌ Erreur MongoDB :', err));

// ─── ROUTES CRUD ───────────────────────────────────────

// POST /livres → Ajouter un livre
app.post('/livres', async (req, res) => {
  try {
    const livre = new Livre(req.body);
    await livre.save();
    res.status(201).json(livre);
  } catch (err) {
    res.status(400).json({ erreur: err.message });
  }
});

// GET /livres → Afficher tous les livres
app.get('/livres', async (req, res) => {
  try {
    const livres = await Livre.find();
    res.json(livres);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

// PUT /livres/:id → Modifier un livre
app.put('/livres/:id', async (req, res) => {
  try {
    const livre = await Livre.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(livre);
  } catch (err) {
    res.status(400).json({ erreur: err.message });
  }
});

// DELETE /livres/:id → Supprimer un livre
app.delete('/livres/:id', async (req, res) => {
  try {
    await Livre.findByIdAndDelete(req.params.id);
    res.json({ message: '🗑️ Livre supprimé' });
  } catch (err) {
    res.status(400).json({ erreur: err.message });
  }
});

// ───────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});