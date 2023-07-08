const Order = require("../models/Order")
const Product = require("../models/Product")
const CustomErrors = require("../errors")
const {StatusCodes} = require("http-status-codes")
const { checkPermissions } = require("../utils")


const fakeStripeAPI = async ({amount, currency})=>{
    const client_secret = 'someRandomValue'
    return {client_secret, amount}
}

const getAllOrders = async (req, res) =>{

    res.send("getAllOrders")
}

const getSingleOrder = async (req, res) =>{
    res.send("getSingleOrder")
}

const getCurrentUserOrders = async (req, res) =>{
    res.send("getCurrentUserOrders")
}

const createOrder = async (req, res) =>{
    const {items, tax, shippingFee} = req.body;
    
    if (!items || items.length < 1) {
        throw new CustomErrors.BadRequestError("No cart items provided");
    }
    if (!tax || !shippingFee) {
        throw new CustomErrors.BadRequestError("Please provide tax and shipping fee");
    }

    let orderItems = [];
    let subtotal = 0;

    for (const item of items) {
        const dbProduct = await Product.findById(item.product);
        if (!dbProduct) {
            throw new CustomErrors.NotFound(`No product with id ${item.product}`)
        }
        const {name, price, image} = dbProduct;
        const singleOrderItem = {
            amount: item.amount,
            name, 
            price, 
            image,
            product: item.product
        }
        orderItems.push(singleOrderItem);
        subtotal += price * item.amount;
            
    }

    const total = tax + shippingFee + subtotal;

    //get client secret from stripe
    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'usd'
    });

    const order = await Order.create({
        tax,
        shippingFee,
        subtotal,
        total,
        clientSecret: paymentIntent.client_secret,
        cartItems: orderItems,
        user: req.user.userId
    });

    res.status(StatusCodes.CREATED).json({order, clientSecret: paymentIntent.client_secret})
}

const updateOrder = async (req, res) =>{
    res.send("updateOrder")
}

module.exports = {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder
}