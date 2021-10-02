var Db  = require('./dboperations');
const dboperations = require('./dboperations');

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(router);


router.use((request,response,next)=>{
   console.log('middleware');
   next();
})

router.route('/customers').get((request,response)=>{
    dboperations.getCustomers().then(result => {
      response.json(result[0]);
    })

})

router.route('/customers/:id').get((request, response) => {
   dboperations.getCustomer(request.params.id).then((result) => {
     response.json(result[0][0]);
   })
 })


router.route('/suppliers').get((request,response)=>{

   dboperations.getSuppliers().then(result => {
      response.json(result[0]);
   })

})

router.route('/suppliers/:id').get((request, response) => {
  dboperations.getSupplier(request.params.id).then((result) => {
    response.json(result[0][0]);
  })
})

router.route('/products').get((request,response)=>{

   dboperations.getInventory().then(result => {
      response.json(result[0]);
   })

})

router.route('/products/:id').get((request, response) => {
  dboperations.getProduct(request.params.id).then((result) => {
    response.json(result[0][0]);
  })
})

router.route('/invoices').get((request,response)=>{

   dboperations.getInvoices().then(result => {
      response.json(result[0]);
   })

})

router.route('/invoices/:id').get((request, response) => {
  dboperations.getInvoice(request.params.id).then((result) => {
    response.json(result[0][0]);
  })
})

router.route('/orders').get((request,response)=>{

   dboperations.getOrders().then(result => {
      response.json(result[0]);
   })

})

router.route('/orders/:id').get((request, response) => {
  dboperations.getOrder(request.params.id).then((result) => {
    response.json(result[0][0]);
  })
})


router.route('/stats1').get((request,response)=>{

   dboperations.getStats1().then(result => {
      response.json(result[0]);
   })

})

router.route('/stats2').get((request,response)=>{

   dboperations.getStats2().then(result => {
      response.json(result[0]);
   })

})

router.route('/stats3').get((request,response)=>{

   dboperations.getStats3().then(result => {
      response.json(result[0]);
   })

})

router.route('/stats4').get((request,response)=>{

   dboperations.getStats4().then(result => {
      response.json(result[0]);
   })

})

router.route('/stats5').get((request,response)=>{

   dboperations.getStats5().then(result => {
      response.json(result[0]);
   })

})

var port = process.env.PORT || 8090;
app.listen(port);
console.log('Order API is runnning at ' + port);