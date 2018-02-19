//Required npm packages
var mysql = require ("mysql");
var inquirer = require ("inquirer");
var colors = require('colors');
var Table = require('cli-table');

//Establishing MySQL connection
var connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    user: "root",
    password: "",
    database:"bamazondb"
});

connection.connect(function(err){
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    displayItems();
});

//Default function to display items for sale
function displayItems(){
    console.log(colors.yellow.bold("Welcome to 'Bamazon'. Here are items available for purchase: "));
    connection.query("SELECT item_id, product_name, price FROM products", function(err,result){
        if (err) throw err;
        var table = new Table({
            head: ["ID","Item Name","Cost"]
           , colWidths: [5,20,10]
        });    

        for (var i = 0; i <result.length; i++){
            var res = result[i];
            table.push([res.item_id,res.product_name,res.price])
        }
        console.log(colors.green.bold(table.toString()+"\n"));
        placeOrder();
    });
}

//Function to place the order
function placeOrder(){
    inquirer.prompt([
        {
          name: "id",
          type: "input",
          message:colors.yellow.bold("What is the ID of the item you would like to purchase?")
        },
        {
          name:"item_qty",
          type: "input",
          message:colors.yellow.bold("Please specify the quantity: "),
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
        checkOrder(itemId,itemQty);
    })
}

//Function to complete or end the sale based on available product quantity
function checkOrder(itemId, itemQty){
    connection.query("SELECT stock_quantity,price FROM products WHERE item_id=?", [itemId], function(err,result){
        if (err) throw err;

        var databaseQty = result[0].stock_quantity;
        var itemCost = result[0].price;
        if (databaseQty<itemQty){
            console.log(colors.yellow.red("\n Sorry, it appears that there is insufficient quantity. Please tr again soon"));
            promptForShopping();
        } else {
            var updateDatabaseQty = databaseQty-itemQty;
            console.log(colors.yellow.bold("\n One moment while your order is being processed."));
            updateProductQty(itemId,updateDatabaseQty,itemQty,itemCost);
        }
      
    });
}

//Function to update product quantity if the sale was successful 
function updateProductQty(itemId,updatedQty,itemQty,itemCost){
    var purchasePrice = itemQty * itemCost;
 
    var query = connection.query(
    "UPDATE products SET stock_quantity =?, product_sales=? WHERE item_id= ?",
    [updatedQty,purchasePrice,itemId], 
    function(err, res) {
    console.log(colors.green.bold("\n  Your total cost is $" + purchasePrice +" . Thank you for your purchase!"+"\n"));
    promptForShopping();
    });
}

//Function to allow user to end the session or continue shopping
function promptForShopping(){
    inquirer.prompt([
        {
          name:"shopping",
          type: "confirm",
          message: colors.yellow.bold("Would you like to shop again?"),
        } 
    ])
    .then(function(answer){
        if(answer.shopping===true){
            displayItems();
         } else {
            console.log(colors.magenta.bold("Thanks for shopping with us. Please visit us again soon!"));
            connection.end();
        }
    });
}



