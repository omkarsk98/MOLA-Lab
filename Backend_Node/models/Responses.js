const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const ResponsesSchema = new Schema({
  responses: { type: [Object], required: true },
  submittedAt: { type: Date, default: new Date() },
  startedAt: { type: Date, default: new Date() }
});

ResponsesSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Responses', ResponsesSchema);