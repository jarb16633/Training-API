const Order = require("../models/orderModel");
const Product = require("../models/productModel");

exports.createProduct = async (req, res) => {
  const { name, price, stock , image} = req.body;
  try {
    //check whether product is already exists
    const existingProduct = await Product.findOne({name});
    if (existingProduct ) {
        return res.sendResponse(400, 'Product with this name is already exist.', [])
    }
    const product = new Product({ name, price, stock , image });
    await product.save();
    res.sendResponse(200, "Product created", product)
  } catch (error) {
    res.sendResponse(500, 'Server error', error);
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.sendResponse(200, 'Success', products)
  } catch (error) {
    res.sendResponse(500, 'Server error', []);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.sendResponse(403, "Product not found", []);
    }
    res.sendResponse(200, 'Success', product);
  } catch (error) {
    res.sendResponse(500, "Server Error", []);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const update = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!update) {
      return res.sendResponse(404, "Product not found", [])
    }
    res.sendResponse(200, "Product updated", update )
  } catch (error) {
    res.sendResponse(500, "Server Error", []);

  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const del = await Product.findByIdAndDelete(req.params.id);
    if (!del) {
      return res.sendResponse(400,"Product not found",[]);
    }
    res.sendResponse(200, "Product deleted", del );
  } catch (error) {
    res.sendResponse(500, "Server Error", []);
  }
};

exports.getProductOrdersById = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId)
    if (!product) {
      return res.sendResponse(404, 'Product not found', [])
    }

    
    const orders = await Order.find({'products.product': productId})
    if (!orders.length) {
      return res.sendResponse(404, 'Order not found')
    }
    console.log(`Orders found for product ${productId}:`, orders)

    
    res.sendResponse(200, 'Success', orders)
  } catch (error) {
    console.log(error);
    res.sendResponse(500, 'Server Error', [])
  }
}