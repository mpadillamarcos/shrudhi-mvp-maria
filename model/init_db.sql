--
-- Drop Tables
--

SET foreign_key_checks = 0;

DROP TABLE IF EXISTS `RecipeIngredients`;
DROP TABLE IF EXISTS `Recipes`;
DROP TABLE IF EXISTS `Ingredients`;

SET foreign_key_checks = 1;
--


CREATE TABLE `Ingredients`(
    `IngredientID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Name` VARCHAR(255) NOT NULL
);
CREATE TABLE `Recipes`(
    `RecipeID` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Name` VARCHAR(255) NOT NULL,
    `Instructions` LONGTEXT NOT NULL
);
CREATE TABLE `RecipeIngredients`(
    `RecipeID` INT UNSIGNED NOT NULL,
    `IngredientID` INT UNSIGNED NOT NULL,
    `Quantity` DECIMAL(5,2) NOT NULL,
    `Unit` VARCHAR(20) NOT NULL
);
ALTER TABLE
    `RecipeIngredients` ADD CONSTRAINT `recipeingredients_ingredientid_foreign` FOREIGN KEY(`IngredientID`) REFERENCES `Ingredients`(`IngredientID`);
ALTER TABLE
    `RecipeIngredients` ADD CONSTRAINT `recipeingredients_recipeid_foreign` FOREIGN KEY(`RecipeID`) REFERENCES `Recipes`(`RecipeID`);