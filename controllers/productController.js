const Product = require("../models/Product");
const {StatusCodes} = require("http-status-codes");
const CustomErrors = require("../errors")

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
    const product = await Product.findById(productId);
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
const uploadImage = (req, res)=>{
    res.send("uploadImage")
}

module.exports = {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}