let mongoose = require('mongoose');
let Assignment = require('./model/assignment');

// URI de connexion MongoDB
const uri = 'mongodb+srv://hamaimouyassine_db_user:9mTEEMZk5bx5skGt@cluster0.kibjczp.mongodb.net/?appName=Cluster0';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

console.log('🔍 Test de connexion à MongoDB...\n');

// Test de connexion
mongoose.connect(uri, options)
  .then(async () => {
    console.log('✅ Connecté à MongoDB avec succès !');
    console.log('📍 URI: ' + uri);
    console.log('\n📊 Test des opérations MongoDB...\n');

    try {
      // Test 1: Vérifier l'état de la connexion
      console.log('1️⃣  État de la connexion:', mongoose.connection.readyState === 1 ? '✅ Connecté' : '❌ Non connecté');
      
      // Test 2: Lister les collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('2️⃣  Collections disponibles:', collections.length > 0 ? collections.map(c => c.name).join(', ') : 'Aucune collection');
      
      // Test 3: Compter les documents dans la collection assignments
      const count = await Assignment.countDocuments();
      console.log('3️⃣  Nombre d\'assignments dans la base:', count);
      
      // Test 4: Créer un document de test
      console.log('\n4️⃣  Test d\'insertion d\'un document...');
      const testAssignment = new Assignment({
        id: 999,
        nom: 'Test MongoDB',
        dateDeRendu: new Date(),
        rendu: false
      });
      
      const savedAssignment = await testAssignment.save();
      console.log('   ✅ Document inséré avec succès:', savedAssignment._id);
      
      // Test 5: Lire le document
      console.log('\n5️⃣  Test de lecture du document...');
      const foundAssignment = await Assignment.findOne({ id: 999 });
      if (foundAssignment) {
        console.log('   ✅ Document trouvé:', foundAssignment.nom);
      } else {
        console.log('   ❌ Document non trouvé');
      }
      
      // Test 6: Supprimer le document de test
      console.log('\n6️⃣  Nettoyage - Suppression du document de test...');
      await Assignment.deleteOne({ id: 999 });
      console.log('   ✅ Document de test supprimé');
      
      console.log('\n🎉 Tous les tests MongoDB ont réussi !');
      
    } catch (error) {
      console.error('❌ Erreur lors des tests:', error.message);
    } finally {
      // Fermer la connexion
      await mongoose.connection.close();
      console.log('\n🔌 Connexion fermée.');
      process.exit(0);
    }
  })
  .catch(err => {
    console.error('❌ Erreur de connexion à MongoDB:', err.message);
    console.error('   Détails:', err);
    process.exit(1);
  });

