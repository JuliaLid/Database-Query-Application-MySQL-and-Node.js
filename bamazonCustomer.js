var mysql = require ("mysql");
var inquirer = require ("inquirer");
var colors = require('colors');

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
          message: "Please specify the quantity: ",
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
        // console.log(itemId, itemQty);
        checkOrder(itemId,itemQty);
    })
}

function checkOrder(itemId, itemQty){
    connection.query("SELECT stock_quantity,price FROM products WHERE item_id=?", [itemId], function(err,result){
        if (err) throw err;
        // console.log(result);
        var databaseQty = result[0].stock_quantity;
        var itemCost = result[0].price;
        if (databaseQty<itemQty){
            console.log("Sorry, insufficient Quantity");
            promptForShopping();
        } else {
            var updateDatabaseQty = databaseQty-itemQty;

            console.log("One moment while your order is being processed");
            updateProductQty(itemId,updateDatabaseQty,itemQty,itemCost);
        }
      
    });
}

function updateProductQty(itemId,updatedQty,itemQty,itemCost){
    var purchasePrice = itemQty * itemCost;
 
    var query = connection.query(
    "UPDATE products SET stock_quantity =?, product_sales=? WHERE item_id= ?",
    [updatedQty,purchasePrice,itemId], 
    function(err, res) {
    //   console.log(res.affectedRows + " products updated!\n");
        // var purchasePrice = itemQty * itemCost;
        console.log("Your total cost is $" + purchasePrice +" . Thank you for your purchase!");
        promptForShopping();
    });
}

function promptForShopping(){
    inquirer.prompt([
        {
          name:"shopping",
          type: "confirm",
          message: "Would you like to shop again?",
        } 
    ])
    .then(function(answer){
        if(answer.shopping===true){
            displayItems();
         } else {
            console.log(colors.yellow.bold("Thanks for shopping with us. Please visit us again soon!"));
            connection.end();
        }
    });
}



