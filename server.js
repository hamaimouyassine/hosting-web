let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let assignment = require('./routes/assignments');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('debug', true);

// Logs de connexion Mongoose
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connecté à MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Erreur Mongoose:', err.message);
});

// ⚠️ Mets ici l’URI EXACT copié depuis Atlas (menu Connect → Drivers)
const uri = 'mongodb+srv://hamaimouyassine_db_user:9mTEEMZk5bx5skGt@cluster0.kibjczp.mongodb.net/?appName=Cluster0';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose
  .connect(uri, options)
  .then(() => {
    console.log('Connecté à la base MongoDB assignments dans le cloud !');
    console.log('at URI = ' + uri);
  })
  .catch((err) => {
    console.log('Erreur de connexion: ', err.message);
  });

let port = process.env.PORT || 8010;

// Middleware bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  next();
});

let prefix = '/api';

// route sur /assignments/:id
app
  .route(prefix + '/assignments/:id')
  .get(assignment.getAssignment)
  .delete(assignment.deleteAssignment);

// route sur /assignments
app
  .route(prefix + '/assignments')
  .get(assignment.getAssignments)
  .post(assignment.postAssignment)
  .put(assignment.updateAssignment);

// Démarrage du serveur
app.listen(port, '0.0.0.0');
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;





