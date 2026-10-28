/**
 * leaderboardController.js
 *
 * Controller handling public, server-verified leaderboard requests.
 * Ranks users deterministically by XP, breaks ties by registration date,
 * and enforces strict privacy protections (no emails, password hashes, or tokens).
 */

const userRepository = require("../repositories/userRepository");

/**
 * GET /api/leaderboard
 * Optional query parameters:
 *   - limit: number of users to return (default: 25, min: 1, max: 100)
 *   - page: page number (1-based, default: 1)
 *   - userId: optional player ID to look up current player rank
 */
async function handleGetLeaderboard(req, res, next) {
  try {
    const rawLimit = Number(req.query.limit);
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(100, Math.floor(rawLimit)) : 25;

    const rawPage = Number(req.query.page);
    const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
    const skip = (page - 1) * limit;

    // Resolve requesting user ID from auth context or query parameter
    const currentUserId = req.user?.id || req.query.userId || null;

    const { users, totalUsers, currentUserRank } = await userRepository.getLeaderboardUsers({
      limit,
      skip,
      currentUserId,
    });

    const totalPages = Math.max(1, Math.ceil(totalUsers / limit));

    return res.status(200).json({
      success: true,
      users,
      totalUsers,
      currentUserRank,
      page,
      limit,
      totalPages,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleGetLeaderboard,
};
