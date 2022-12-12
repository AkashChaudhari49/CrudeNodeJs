var express = require('express')
var app = express();
var Category = require('./models/Category.js');
var Product = require('./models/Product.js');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//connection for mongodb database
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/crude-store");
var connection = mongoose.connection;

connection.once('open', function () {
  console.log("mongodb connecrion succesfully");
});
// set view engine ejs
app.set('view engine', 'ejs');

//home page with category list
app.get('/', function (req, res) {
  Category.find({}, function (err, result) {
    res.render('categoryList', { categorys: result });
  });

});

app.get('/addCategory', function (req, res) {
  res.render("addCategory");
});

// Route add category 
app.post('/add', function (req, res) {
  //console.log(req.body.category);
  var category = new Category({
    name: req.body.category
  });
  category.save(() => {
    res.redirect("/");
  });

});


//route  for dlete category
app.get('/delete/:id', async function (req, res) {
  await Category.findByIdAndDelete(req.params.id);
  res.redirect('/');
})

//route get category data for Edit category
app.get('/edit/:id', function (req, res) {
  Category.findById(req.params.id, function (err, result) {
    //console.log(result);
    res.render('editProduct', { categorys: result });
  });

})
//route Edit category and post 
app.post('/update/:id', async function (req, res) {
  await Category.findByIdAndUpdate(req.params.id, { name: req.body.category });
  console.log(req.params.id);
  console.log(req.body);
  res.redirect('/');
});

//product routes start from  here
//route for get category data on add product page 
app.get('/addProduct/:id', function (req, res) {
  Category.findById(req.params.id, function (err, result) {
    // console.log(result);
    res.render('addProduct', { categorys: result });
  });

});

//route for add product data
app.post('/productlist', function (req, res) {
  // console.log(req.body);
  var product = new Product({
    CategoryId: req.body.catId,
    CategoryName: req.body.catName,
    ProductName: req.body.product
  });

  console.log(product)
  product.save(() => {
    res.redirect("/productList");
  })
});

//route for product list with server side  pagination
app.get('/productList', async function (req, res) {
  //no of record you want to show per page
  let perPage = 10;
  //total no. of records from db
  let total = await Product.count();
  console.log(total)
  //to calculate no. of pages 
  let pages = Math.ceil(total / perPage);
  //to get currpage no.
  let pageNumber = (req.query.page == null) ? 1 : req.query.page;
  //get record to skip
  let startForm = (pageNumber - 1) * perPage;
  let products = await Product.find({}).skip(startForm).limit(perPage);
  res.render("productList", { "pages": pages, "products": products })

})


//get the product data for updating product
app.get('/editProduct/:id', function (req, res) {
  Product.findById(req.params.id, function (err, result) {
    //console.log(result);
    res.render('editProduct', { products: result });
  });

})

//for update the product data
app.post('/updateProduct/:id', async function (req, res) {
  await Product.findByIdAndUpdate(req.params.id, {
    CategoryId: req.body.catId,
    CategoryName: req.body.catName,
    ProductName: req.body.product
  });
  //console.log(req.params.id);
  //console.log(req.body);
  res.redirect('/productList');
});

//route dlete Product
app.get('/deleteProduct/:id', async function (req, res) {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/productList');
})

app.listen(4000, function () {
  console.log("app is started on 4000 port");
});

