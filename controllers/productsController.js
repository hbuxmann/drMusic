const fs = require("fs");
const path = require("path");
// acceso a BD
let db = require("../database/models");
// const ProdCategory = require("../database/models/ProdCategory");
const Op = db.Sequelize.Op;

const productsFilePath = path.join(__dirname, "../data/productos.json");
const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const {validationResult} = require("express-validator")

// Validacion Backend
function grabaRegistros(products) {
  let prdoctsJSON = JSON.stringify(products, null, 2);
  fs.writeFileSync(productsFilePath, prdoctsJSON);
}


const controlProducts = {  
  list: function (req, res) {
  // Show all products from BD
    db.Product.findAll({include: [{association: "prod_price" }, {association: "prod_image" }]})
        .then(function(products){
            res.render('productList', { products: products} )
        })
  },
  // Shows one product
  detail: function (req, res) {
    db.Product.findByPk(req.params.id, {
      include: [
          {association: "color" }, 
          {association: "prod_size" }, 
          {association: "prod_category" }, 
          {association: "prod_image" }, 
          {association: "prod_price" }
      ]
  })
      .then((products) => { 
          let prodJson = JSON.parse(JSON.stringify(products));
          console.log(prodJson)
          let selectedProduct = {
            prodId:       prodJson.id_product,
            nombre:       prodJson.brand,
            descripcion:  prodJson.description,
            precio:       (prodJson.prod_price[0].price),
            imagen:       prodJson.prod_image[0].name,
            categoria:    prodJson.prod_category.description,
            // medidas:      (prodJson.prod_size.type ? 'inch' : 'cm'),
            // alto:         prodJson.prod_size.height,
            // ancho:        prodJson.prod_size.width, 
            // profundidad:  prodJson.prod_size.depth, 
            color:        prodJson.color.name
          };
          console.log(selectedProduct);
          res.render("productDescription", { selectedProduct });
      })
      .catch((error) => res.send("Ups, se produjo un error Detail-> " + error));
  },
  search: function(req, res) {     
    db.Product.findAll({
            include: [
                {association: "prod_image" }, 
                {association: "prod_price" }
            ],
            where: {
              // busca ya sea por el campo 'brand' como por 'description'
              [Op.or]: [
                {brand:        { [Op.like]: '%' + req.query.keyword + '%' }},
                {description:  { [Op.like]: '%' + req.query.keyword + '%' }}
              ]
          }
        })
        .then(products =>{
          res.render('productList', { products: products} )
        })
        .catch((error) => res.send("Ups, se produjo un error Search-> " + error));
  },
  create: function (req, res) {
    let promProduct = db.Product.findAll();
    let promColor = db.Color.findAll();
    let promProdCat = db.ProdCategory.findAll();
    let promProdPrice = db.ProdPrice.findAll();
    let promProdSize = db.ProdSize.findAll();
    let promProdImage = db.ProdImage.findAll();

    Promise.all([promProduct, promColor, promProdCat, promProdPrice, promProdSize, promProdImage])
      .then(([allProducts, allColors, allProdCats, allProdPrices, allProdSizes, allProdImages]) => {
         res.render(path.resolve(__dirname, "..", "views", "product_create"), {
          allProducts,
          allColors,
          allProdCats,
          allProdPrices,
          allProdSizes,
          allProdImages
        }
       );
      })
      .catch((error) => res.send(error));
  },
  store: function (req, res) {
    // const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
    // let prodToCreate = {};

    const resultValidation = validationResult(req);
    

    if (resultValidation.isEmpty()){    

    let img = "default-img.png";
    if (req.file != undefined) {
      img = req.file.filename;
    }
  db.ProdSize.create({
    type: req.body.categoria,
    height: req.body.alto,
    width: req.body.ancho,
    depth: req.body.profundidad
})
.then((size)=> {
    console.log('id tamaño' + size.id_prod_size);
    db.Product.create({
        description: req.body.descripcion,
        brand: req.body.name,
        creation_date: Date(),
        modif_date: Date(),
        active: 1,
        id_colors: req.body.color,
        id_prod_category: req.body.categoria,
        id_prod_size: size.id_prod_size
    })
  .then((product)=> {         
    console.log(product)
    db.ProdPrice.create({
      price:req.body.precio,
      creation_date:Date(),
      modif_date: Date(),
      active: 1,
      id_product: product.id_product,
  }); return product
})
  .then((product)=> {         
    console.log(product)
    db.ProdImage.create({
    name: img,
    id_product: product.id_product
}); return product
})  
  .then(() => {
    return res.redirect("/products/list");
  })
  .catch(function(error){
    res.send(error)         
  })  
})
} else {
  return res.render("product_create", { errors: resultValidation.mapped(), oldData: req.body })
} 
  },

  //
  edit: (req, res) => {
    
    db.Product.findByPk(req.params.id, {
      include: [{association: "prod_price"},{association: "prod_image"},{association: "prod_category"},{association: "prod_size"}]
    })

      .then(function(product){
        res.render('product_edit', {product: product})
    });   
  },
  //
  update: (req, res) => {

    const resultValidation1 = validationResult(req);
    

    if (resultValidation1.isEmpty()){    

    db.Product.update(
      {         
        description: req.body.descripcion,
        brand: req.body.name,
        creation_date: Date(),
        modif_date: Date(),
        active: 1,
        id_colors: req.body.color,
        id_prod_category: req.body.categoria,
      },
      {
        where: { id_product: req.params.id}
        }
    )
    .then(function() {              
        db.ProdImage.update({
        name: req.file.filename  
      },    
    {
      where: { id_product: req.params.id}
      }
    )}) 
    db.ProdPrice.update({
      price:req.body.precio,
      creation_date:Date(),
      modif_date: Date(),
      active: 1,
    },    
  {
    where: { id_product: req.params.id}
    })
  .then(() => {
    return res.redirect("/products/list");
  })
  .catch(function(error){
    res.send(error)         
  })  
} else {
  return res.send(resultValidation1)
  
} 

    
  },
  delete: (req, res) => {
    //
    //const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
    //let id = req.params.id;
    //let productsNew = products.filter(removeID);
    //function removeID(prod) {
    // return prod.prodId != id;
    //}
    //grabaRegistros(productsNew);
    //res.redirect("/products/list");
    /*
    db.Product.destroy({
      where: {
          id_product: req.params.id
      }
  })
    .then(function(){
          res.redirect('/products/list')
      })
    .catch(function(){
      res.send("hay errores")
    })
    */
    
    db.ProdPrice.destroy({
      where: {
          id_product: req.params.id
      }
    })
      .then(function() {
        db.ProdImage.destroy({
          where: {
            id_product: req.params.id
          }
        })
          .then(function() {
            db.Product.destroy({
              where: {
                  id_product: req.params.id
              }
          })
            .then(function(){
                  res.redirect('/products/list')
              })
            .catch(function(){
              res.send("hay errores")
            })            
          })        
      })
  },
  formDelete: (req, res) => {
    //
    //const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
    //let product;
    //for (prod of products) {
    //  if (prod.prodId == req.params.id) {
    //    product = prod;
    //    break;
    //  }
    //}
    //res.render("product_delete", { product: product });
    db.Product.findByPk(req.params.id, {
      include: [{association: "prod_price"},{association: "prod_image"}]
    })
      .then(function(product){
        res.render('product_delete', {product: product})
    });   
  },


  //APIS

  //Listado de productos
  productList: (req, res) => {
    //listado de productos
    let products      =  db.Product.findAll({
      include: [{association: "prod_price"},{association: "prod_image"}]
    });
    // cantidad de productos por categoria
    let prod_category =  db.ProdCategory.findAll({
      attributes: ['id_prod_category', 'description', [db.Sequelize.fn('COUNT', 'id_prod_category'), 'countByIdCat']],
      include: [ { model: db.Product, as: 'product' , attributes: [] } ],
      group: ['id_prod_category'],
    });
    // ultimo producto creado
    let lastProduct      =  db.Product.findAll({
      include: [{association: "prod_price"},{association: "prod_image"}],
      order :   db.Sequelize.literal('Product.creation_date DESC'),
      limit: 1
    });

    //    
    Promise.all([products, prod_category, lastProduct])
      .then(function([products, categories, lastProduct]){
        let prd_aux = products.map(function(prd) {
          prd.dataValues.detailUrl = 'http://localhost:3000/products/api/productdetail/'+prd.dataValues.id_product;
          return prd;
        });
        lastProduct[0].dataValues.detailUrl = 'http://localhost:3000/products/api/productdetail/'+lastProduct[0].dataValues.id_product;
        return res.status(200)
        .json({
            products : prd_aux,
            productCount: products.length,
            lastProductCreated: lastProduct,
            categories: categories,
            categoriesCount: categories.length,            
            status: 200
        })

      })
  },
  //Detalle de productos
  productDetail: (req, res) => {
    db.Product.findByPk(req.params.id, {
      include: [{association: "prod_price"},{association: "prod_image"}]
    })
    .then(function(movie){

      // console.log(movie);
      if (!movie){
        movie = 'ID not found';
      }
      return res.status(200).json({
          data: movie,
          status: 200

      });
    })
    .catch(function (err) {
      return res.status(200).json({
        error: err,
        status: 500

      });
    });
  }, 
  category: (req, res) => {

    db.Product.findAll({
      include: [
          {association: "prod_image" }, 
          {association: "prod_price" }
      ],
      where: {
          id_prod_category: req.params.id
    }
    })
    .then(products =>{
      res.render('productList', { products: products} )
    })
    .catch((error) => res.send("Ups, se produjo un error Search-> " + error));

  }

};

module.exports = controlProducts;
