/**
 * models/index.js
 *
 * Central export point for MongoDB models and repositories.
 */

const userModel = require("./userModel");
const userRepository = require("../repositories/userRepository");

module.exports = {
  userModel,
  userRepository,
};
