const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require('../models/userModel');

exports.createOrder = async (req, res) => {
    const productId = req.params.id; //ดึง productId จาก URL
  const { quantity } = req.body; // ดึง quantity จาก body ของ request
  try {
    const product = await Product.findById(productId);
    //check stock
    if (!product || product.stock < quantity) {
      return res.sendResponse(400, `${product.name} is out of stock or insufficient quantity`, [])
    }

    // หักจำนวนสินค้าที่ถูกสั่งจากสต็อก
    await Product.findByIdAndUpdate(productId, { $inc: { stock: -quantity } });

    // สร้างคำสั่งซื้อใหม่
    const order = new Order({ user: req.user.id, products: [{product: productId, quantity }] });
    await order.save();

    // push order.id เข้า Array ใน field order ของ Product
    await Product.findByIdAndUpdate(productId, { $push: { orders: order._id } });

    const user = await User.findById(req.user.id);

    res.status(201).json({
        status: 201,
        message: 'Order created',
        data: {
            username: user.username,
            order
        }
    })
  } catch (error) {
    console.log(error)
    res.sendResponse(500,"Server Error")
  }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
        .populate('user', 'username') // populate เฉพาะ field username ของ user
        .populate('products.product', 'name'); // populate เฉพาะ field name ของ product
        res.sendResponse(200, "Success", orders);
    } catch (error) {
        res.sendResponse(500, "Server error", []);
    }
}

// exports.getOrderById = async (req, res) => {
//     try {
//         const order = await Product.findById(req.params.id)
//         // .populate('user').populate('products.product');
//         if (!order) {
//             return res.sendRespond(404, 'Order not found', [])
//         }
//         res.sendResponse(200, 'Success', order)
//     } catch (error) {
//         res.sendResponse(500, 'Server error', [])
//     }
// }

// exports.updateOrder = async (req, res) => {
//     try {
//         const order = await Order.findByIdAndUpdate(req.params.id, req.body, {new: true}).populate('user').populate('products.product');
//         if (!order) {
//             res.status(404).json({message: 'Order not found'});
//         }
//         res.status(200).json({message: 'Order updated', order });
//     } catch (error) {
//         res.status(500).json({message: 'Server error'});
//     }
// }

// exports.deleteOrder = async (req, res) => {
//     try {
//         const order = await Order.findByIdAndDelete(req.params.id);
//         if (!order) {
//             res.status(404).json({message: 'Order not found'});
//         }
//         res.status(200).json({message: 'Order deleted'})
//     } catch (error) {
//         res.status(500).json({message: 'Server error'});
//     }
// }

// exports.getProductOrders = async (req, res) => {
//     try {
//         const productId = req.params.id
//         const orders = await Order.find({'products.product': productId}).populate('user').populate('products.product')
//         if (!orders) {
//             return res.sendRespond(404, 'No order found for this product.', [])
//         }
//         res.sendRespond(200, 'Success', orders)
//     } catch (error) {
//         res.sendRespond(500, "Server Error", []);
//     }
// }