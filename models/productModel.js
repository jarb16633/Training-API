const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String, required: true},
  orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], // เมื่อ Order ถูกสร้างจะ push เข้ามาใน Array นี้ตาม ProductId
  
});

module.exports = mongoose.model('Product', productSchema);
