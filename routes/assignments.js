const mongoose = require('mongoose');
let Assignment = require('../model/assignment');

// ===============================
// GET /api/assignments  (avec pagination)
// ===============================
function getAssignments(req, res) {
  // On lit page & limit depuis la query string, avec valeurs par défaut
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  // On construit un aggregate vide (on pourrait filtrer / trier ici)
  const aggregate = Assignment.aggregate();

  Assignment.aggregatePaginate(aggregate, { page, limit })
    .then(result => {
      // result ressemble à :
      // {
      //   docs: [...],
      //   totalDocs: number,
      //   limit: number,
      //   page: number,
      //   totalPages: number,
      //   hasPrevPage: boolean,
      //   hasNextPage: boolean,
      //   prevPage: number | null,
      //   nextPage: number | null,
      //   ...
      // }
      res.json(result);
    })
    .catch(err => {
      console.error('Erreur dans getAssignments (pagination) :', err);
      res.status(500).json({
        message: 'Erreur lors de la récupération des assignments',
        error: err.message
      });
    });
}

// ===============================
// GET /api/assignments/:id
// (par _id Mongo OU par id logique)
// ===============================
function getAssignment(req, res) {
  const paramId = req.params.id;

  // Cas 1 : l'ID est un _id Mongo valide
  if (mongoose.Types.ObjectId.isValid(paramId)) {
    Assignment.findById(paramId, (err, assignment) => {
      if (err) {
        console.error(`Erreur dans getAssignment (findById, _id=${paramId}) :`, err);
        return res.status(500).json({
          message: "Erreur interne lors de la récupération de l'assignment",
          error: err.message
        });
      }

      if (!assignment) {
        return res.status(404).json({
          message: `Aucun assignment trouvé avec _id=${paramId}`
        });
      }

      return res.json(assignment);
    });
  }
  // Cas 2 : sinon, on essaie de traiter comme un id logique (Number)
  else {
    const logicalId = Number(paramId);

    Assignment.findOne({ id: logicalId }, (err, assignment) => {
      if (err) {
        console.error(`Erreur dans getAssignment (findOne, id=${logicalId}) :`, err);
        return res.status(500).json({
          message: "Erreur interne lors de la récupération de l'assignment",
          error: err.message
        });
      }

      if (!assignment) {
        return res.status(404).json({
          message: `Aucun assignment trouvé avec id logique=${logicalId}`
        });
      }

      return res.json(assignment);
    });
  }
}

// ===============================
// POST /api/assignments
// ===============================
function postAssignment(req, res) {
  let assignment = new Assignment();
  assignment.id = req.body.id;
  assignment.nom = req.body.nom;
  assignment.dateDeRendu = req.body.dateDeRendu;
  assignment.rendu = req.body.rendu;

  console.log('POST assignment reçu :');
  console.log(assignment);

  assignment.save((err) => {
    if (err) {
      console.error('Erreur dans postAssignment :', err);
      return res.status(500).json({ message: 'Erreur lors de l\'ajout', error: err });
    }
    res.json({ message: `${assignment.nom} saved!` });
  });
}

// ===============================
// PUT /api/assignments
// ===============================
function updateAssignment(req, res) {
  console.log('UPDATE reçu assignment : ');
  console.log(req.body);

  Assignment.findByIdAndUpdate(
    req.body._id,
    req.body,
    { new: true },
    (err, assignment) => {
      if (err) {
        console.error('Erreur dans updateAssignment :', err);
        return res.status(500).json({ message: 'Erreur de mise à jour', error: err });
      } else {
        res.json({ message: 'updated' });
      }
    }
  );
}

// ===============================
// DELETE /api/assignments/:id
// ===============================
function deleteAssignment(req, res) {
  Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
    if (err) {
      console.error('Erreur dans deleteAssignment :', err);
      return res.status(500).json({ message: 'Erreur lors de la suppression', error: err });
    }
    res.json({ message: `${assignment?.nom} deleted` });
  });
}

module.exports = {
  getAssignments,
  postAssignment,
  getAssignment,
  updateAssignment,
  deleteAssignment,
};
