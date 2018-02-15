var mysql = require ("mysql");
var inquirer = require ("inquirer");

var connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    user: "root",
    password: "",
    database:"bamazondb"
});

connection.connect(function(err){
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    displayItems();
});

function displayItems(){
    console.log("Welcome to 'Bamazon'. Here are the items available for purchase");
    connection.query("SELECT item_id, product_name, price FROM products", function(err,result){
        if (err) throw err;

        for (var i = 0; i <result.length; i++){
            var res = result[i];
            console.log("Item "+ res.item_id + "|" + res.product_name + "|" + res.price + " dollars" );
        }
        placeOrder();
    });
}

function placeOrder(){
    inquirer.prompt([
        {
          name: "id",
          type: "input",
          message:"What is the ID of the item you would like to purchase?"
        },
        {
          name:"item_qty",
          type: "input",
          message: "Please specify the quantity ",
          validate: function(value){
              if (isNaN(value)===false){
                  return true;
              }
              return false;
          }  
        } 
    ])
    .then(function(answer){
        var itemId = answer.id;
        var itemQty = answer.item_qty;
        console.log(itemId, itemQty);
        checkOrder(itemId,itemQty);
    })
}

function checkOrder(itemId, itemQty){
    connection.query("SELECT stock_quantity FROM products WHERE item_id=?", [itemId], function(err,result){
        if (err) throw err;
        console.log(result[0].stock_quantity);
      
    });
}
    