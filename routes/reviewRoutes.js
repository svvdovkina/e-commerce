const {authenticateUser} = require("../middleware/authentication")

const express = require("express");

const router = express.Router();

const {
    getAllReviews,
    getSingleReview,
    createReview,
    updateReview,
    deleteReview
} = require("../controllers/reviewController");

router.route('/')
    .get(authenticateUser, getAllReviews)
    .post(authenticateUser, createReview)

router.route('/:id')
    .get(getSingleReview)
    .patch(authenticateUser, updateReview)
    .delete(authenticateUser, deleteReview)

module.exports = router;