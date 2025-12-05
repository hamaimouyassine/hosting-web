let mongoose = require('mongoose');
let Assignment = require('./model/assignment');

// URI de connexion MongoDB
const uri = 'mongodb+srv://hamaimouyassine_db_user:9mTEEMZk5bx5skGt@cluster0.kibjczp.mongodb.net/?appName=Cluster0';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

console.log('📝 Création d\'un document de test visible dans MongoDB Atlas...\n');

mongoose.connect(uri, options)
  .then(async () => {
    console.log('✅ Connecté à MongoDB !\n');
    
    try {
      // Vérifier le nom de la base de données
      const dbName = mongoose.connection.db.databaseName;
      console.log('📂 Base de données:', dbName);
      
      // Créer un document de test permanent
      const sampleAssignment = new Assignment({
        id: 1,
        nom: 'Premier Assignment - Visible dans Atlas',
        dateDeRendu: new Date('2024-12-31'),
        rendu: false
      });
      
      const saved = await sampleAssignment.save();
      console.log('✅ Document créé avec succès !');
      console.log('   ID MongoDB:', saved._id);
      console.log('   Nom:', saved.nom);
      console.log('   Collection: assignments');
      console.log('\n📍 Vous pouvez maintenant voir ce document dans MongoDB Atlas :');
      console.log('   - Allez dans votre cluster');
      console.log('   - Cliquez sur "Browse Collections"');
      console.log('   - Sélectionnez la base de données:', dbName);
      console.log('   - Ouvrez la collection "assignments"');
      console.log('   - Vous devriez voir le document créé !\n');
      
    } catch (error) {
      console.error('❌ Erreur:', error.message);
    } finally {
      await mongoose.connection.close();
      console.log('🔌 Connexion fermée.');
      process.exit(0);
    }
  })
  .catch(err => {
    console.error('❌ Erreur de connexion:', err.message);
    process.exit(1);
  });


