const models = require("../models");

async function recipeIdInDatabase(req, res, next) {
  const { id } = req.params;
  const result = await models.recipes.findOne({ where: { id } });
  if (result) {
    req.result = result;
    next();
  } else {
    res.status(404).send({ error: "That recipe id does not exist" });
  }
}

module.exports = recipeIdInDatabase;
