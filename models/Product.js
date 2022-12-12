const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    CategoryId:String,
    CategoryName:String,
    ProductName:String
    
});

module.exports = mongoose.model('products', productSchema);