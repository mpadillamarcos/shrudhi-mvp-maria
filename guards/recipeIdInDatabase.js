const models = require("../models");

async function recipeIdInDatabase(req, res, next) {
  const { id } = req.params;
  try {
    const result = models.recipes.findOne({ where: { id } });
    req.result = result;
    next();
  } catch (error) {
    res.status(404).send(error);
  }
}

module.exports = recipeIdInDatabase;
