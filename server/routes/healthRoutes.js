/**
 * healthRoutes.js
 *
 * Routes for server and database health verification.
 */

const express = require("express");
const { getHealth, getDbHealth } = require("../controllers/healthController");

const router = express.Router();

router.get("/health", getHealth);
router.get("/health/db", getDbHealth);

module.exports = router;
