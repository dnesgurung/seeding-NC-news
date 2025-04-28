const endpoints = require("../../endpoints.json");
const { selectTopics } = require("../models/models");

exports.getApi = (request, response) => {
  response.status(200).send({ endpoints });
};

exports.getTopics = (req, res) => {
  return selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
