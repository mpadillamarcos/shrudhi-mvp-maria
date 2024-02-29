--
-- Drop Tables
--
SET
    foreign_key_checks = 0;

DROP TABLE IF EXISTS `recipe_ingredients`;

DROP TABLE IF EXISTS `recipes`;

DROP TABLE IF EXISTS `ingredients`;

DROP TABLE IF EXISTS `users`;

SET
    foreign_key_checks = 1;

--
CREATE TABLE `users`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL
);

CREATE TABLE `recipe_ingredients`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `ingredient_id` BIGINT NOT NULL,
    `quantity` DECIMAL(8, 2) NOT NULL,
    `units` VARCHAR(20) NOT NULL,
    `recipe_id` BIGINT NOT NULL
);

CREATE TABLE `recipes`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `instructions` LONGTEXT NOT NULL,
    `user_id` BIGINT NOT NULL
);

CREATE TABLE `ingredients`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);

ALTER TABLE
    `recipes`
ADD
    CONSTRAINT `recipes_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `users`(`id`);

ALTER TABLE
    `recipe_ingredients`
ADD
    CONSTRAINT `recipe_ingredients_recipe_id_foreign` FOREIGN KEY(`recipe_id`) REFERENCES `recipes`(`id`);

ALTER TABLE
    `recipe_ingredients`
ADD
    CONSTRAINT `recipe_ingredients_ingredient_id_foreign` FOREIGN KEY(`ingredient_id`) REFERENCES `ingredients`(`id`);