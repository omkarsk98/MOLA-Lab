const { Parser } = require('json2csv');
const moment = require('moment');
const Responses = require('../models/Responses.js');

exports.add = function (body) {
  return new Promise((resolve, reject) => {
    const { responses, startedAt } = body;
    if (responses.length != 10)
      return reject({ status: 400, message: "10 responses required" })
    responses.forEach((response, id) => {
      if (!response.questiontext)
        return reject({ status: 400, message: `Question missing for ${id + 1}` })
      if (!response.response)
        return reject({ status: 400, message: `Response missing for ${id + 1}` })
      if (!response.attemptedAt)
        return reject({ status: 400, message: `Attempt time missing for ${id + 1}` })
    })
    const newResponse = new Responses({ responses, startedAt });
    return newResponse.save()
      .then(() => {
        return resolve({ status: 200, message: "Response recorded successfully!" })
      })
  })
}

exports.get = function () {
  return new Promise((resolve, reject) => {
    return Responses.find({}, (err, data) => {
      if (err)
        return reject(err);
      data = data.reduce((arr, row) => {
        row.responses.forEach(resp => {
          resp["Submitted at time"] = moment(row.submittedAt).format("MM-DD-YYYY hh:mm a");
          resp.Question = resp.questiontext;
          resp.Response = resp.response;
          resp["Attempted at time"] = moment(resp.attemptedAt).format("MM-DD-YYYY hh:mm a");
        })
        arr.push(...row.responses);
        return arr;
      }, []);
      const fields = ["Question", "Response", "Attempted at time", "Submitted at time"];
      const parser = new Parser({ fields });
      return resolve({ status: 200, data: parser.parse(data) });
    })
  })
}