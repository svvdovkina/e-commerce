const Review = require("../models/Review")
const Product = require("../models/Product")
const CustomErrors = require("../errors")

const {StatusCodes} = require("http-status-codes")
const { checkPermissions } = require("../utils")

const getAllReviews = async (req, res)=>{
    const reviews = await Review.find();
    res.status(StatusCodes.OK).json(reviews);
}

const getSingleReview = async (req, res)=>{
    const review = await Review.findById(req.params.id);
    if (!review) {
        throw new CustomErrors.NotFound(`No review with id ${req.params.id}`)
    }
    res.status(StatusCodes.OK).json(review);
}

const createReview = async (req, res)=>{

    const userId = req.user.userId;

    const {product: productId} = req.body;
    const isValidProduct = await Product.findById(productId);
    if (! isValidProduct) {
        throw new CustomErrors.NotFound(`No product with id ${productId}`)
    }

    const alreadySubmitted = await Review.findOne(
        {
            product: productId,
            user: userId
        }
    );

    if (alreadySubmitted) {
        throw new CustomErrors.BadRequestError(`User with id ${userId} already submitted a review for product ${productId}`);
    }
    
    req.body.user = userId;
    const review = await Review.create(req.body)

    res.status(StatusCodes.CREATED).json(review);
}

const updateReview = async (req, res)=>{
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new CustomErrors.NotFound(`No review with id ${req.params.id}`)
    }
    checkPermissions(req.user, review.user);

    const {rating, title, comment} = req.body;
    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;
    review.save();
    res.status(StatusCodes.OK).json(review);
}


const deleteReview = async (req, res)=>{
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new CustomErrors.NotFound(`No review with id ${req.params.id}`)
    }
    checkPermissions(req.user, review.user);
    await review.deleteOne();

    res.status(StatusCodes.OK).json({msg: "Review deleted"});

}

module.exports = {
    getAllReviews,
    getSingleReview,
    createReview,
    updateReview,
    deleteReview
}