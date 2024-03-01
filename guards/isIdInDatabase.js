const models = require("../models");

async function isIdInDatabase(req, res, next) {
  const { id } = req.params;
  try {
    const result = models.recipes.findOne({ where: { id } });
    req.recipe = result;
    next();
  } catch (error) {
    res.status(404).send(error);
  }
}

module.exports = isIdInDatabase;
