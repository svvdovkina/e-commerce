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
    const orders = await Order.find()
    res.status(StatusCodes.OK).json(orders);
}

const getSingleOrder = async (req, res) =>{
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
        throw new CustomErrors.NotFound(`No order with id ${orderId}`)
    }

    const reqUser = req.user;
    const orderUserId = order.user;

    checkPermissions(reqUser, orderUserId);

    res.status(StatusCodes.OK).json(order);
}

const getCurrentUserOrders = async (req, res) =>{
    
    const userId = req.user.userId;
    
    const orders = await Order.find({user: userId});
    
    res.status(StatusCodes.OK).json(orders);
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
    const orderId = req.params.id;
    const {paymentIntentId} = req.body;

    const order = await Order.findByIdAndUpdate(orderId, req.body, {new: true});
    if (!order) {
        throw new CustomErrors.NotFound(`No order with id ${orderId}`)
    }

    const reqUser = req.user;
    const orderUserId = order.user;

    checkPermissions(reqUser, orderUserId);

    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';
    await order.save()

    res.status(StatusCodes.OK).json(order);
}

module.exports = {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder
}