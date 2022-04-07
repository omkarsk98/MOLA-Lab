const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 3001;
mongoose.set('debug', false);
const DB_URL = "mongodb://127.0.0.1:27017/MOLA_Lab"
mongoose.connect(DB_URL, function (err, res) {
  if (err) {
    console.log('ERROR connecting to:', DB_URL, ' - ', err);
  } else {
    console.log('Succeeded connected to: ' + DB_URL);
  }
});
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    callback(null, true)
  },
  allowedHeaders: "Accept, Origin, Content-Type",
};
app.use(cors(corsOptions));
// app.use(helmet());
app.use(express.static('public'))
// app.use(bodyParser.urlencoded({
//   extended: false, // set to false to accept form data
//   limit: '50mb'
// }));

const Responses = require("./modules/Responses")
const QUESTIONS = require("./quiz.json")


app.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Server running', status: 200 })
})

app.get('/questions', (req, res, next) => {
  const questions = [...QUESTIONS]
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);

  return res.status(200).json({ questions, status: 200 });
})

app.post('/submit-quiz', (req, res) => {
  return Responses.add(req.body)
    .then(data => res.status(data.status).json(data))
    .catch(err => res.status(err.status || 500).json(err));
})

app.get('/download', (req, res) => {
  return Responses.get(req.body)
    .then(data => {
      res.setHeader('Content-Disposition', `attachment; filename=Responses.csv`);
      return res.end(data.data);
    })
    .catch(err => {
      console.log("Error in downlaod:", err);
      return res.status(err.status || 500).json(err)
    });
})

app.listen(PORT, () => console.info(`MOLA Lab Quiz running on http://localhost:${PORT}`));
