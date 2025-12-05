let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

let AssignmentSchema = Schema({
  id: Number,
  dateDeRendu: Date,
  nom: String,
  rendu: Boolean
});

// 👉 Ajout du plugin de pagination
AssignmentSchema.plugin(aggregatePaginate);

// 👉 Important : on exporte le modèle basé sur ce schéma
module.exports = mongoose.model('Assignment', AssignmentSchema);
