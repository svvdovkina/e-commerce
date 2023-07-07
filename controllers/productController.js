const Product = require("../models/Product");
const {StatusCodes} = require("http-status-codes");
const CustomErrors = require("../errors")

const path = require("path");

const createProduct = async (req, res)=>{
    const userId = req.user.userId;
    const product = await Product.create({...req.body, user: userId})
    res.status(StatusCodes.CREATED).json(product);
}

const getAllProducts = async (req, res)=>{
    const products = await Product.find();
    res.status(StatusCodes.OK).json(products);
}

const getSingleProduct = async (req, res)=>{
    const {id: productId} = req.params;
    const product = await Product.findById(productId).populate('reviews');
    if (! product) {
        throw new CustomErrors.NotFound("No product with given id");
    }
    res.status(StatusCodes.OK).json(product);
}
const updateProduct = async (req, res)=>{
    const {id: productId} = req.params;
    const product = await Product.findByIdAndUpdate(productId, req.body, {new: true, runValidators: true});
    if (! product) {
        throw new CustomErrors.NotFound("No product with given id");
    }
    res.status(StatusCodes.OK).json(product);
    
}
const deleteProduct = async (req, res)=>{
    const {id: productId} = req.params;
    const product = await Product.findById(productId);
    if (! product) {
        throw new CustomErrors.NotFound("No product with given id");
    }
    await product.deleteOne();
    res.status(StatusCodes.OK).json({msg: "Product deleted"});
}
const uploadImage = async (req, res)=>{
    if (!req.files) {
        throw new CustomErrors.BadRequestError("Please attach the image");
    }
    const {image} = req.files;
    if (!image.mimetype.startsWith('image')){
        throw new CustomErrors.BadRequestError("Please attach the image");
    }
    const maxSize = 1024 * 1024;
    if (image.size > maxSize) {
        throw new CustomErrors.BadRequestError("Image size should be less than 1MB");
    }

    const imagePath = path.join(__dirname, `../public/uploads/${image.name}`)
    
    await image.mv(imagePath);
    
    res.status(StatusCodes.OK).json({image: `/uploads/${image.name}`})
}

module.exports = {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}