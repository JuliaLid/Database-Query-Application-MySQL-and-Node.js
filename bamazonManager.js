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
    startInquiry();
});

function startInquiry(){
    inquirer
    .prompt({
      name: "report_option",
      type: "rawlist",
      message: "What would you like to do?",
      choices: ["View Current Inventory report", "View Low Inventory report","Replenish inventory levels","Add new product" ]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
    //   console.log(answer.report_option);
      switch (answer.report_option) {
        case "View Current Inventory report":
        viewInventory();
        break;
      
        case "View Low Inventory report":
        viewLowInventory();
        break;
      
        case "Replenish inventory levels":
        replenishInventory();
        break;
      
        // case "Add new product":
        //   addNewProduct();
        //   break; 
      }
    });
}

function viewInventory(){
    console.log("Inventory Report is being retrieved...");
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err,result){
        if (err) throw err;

        for (var i = 0; i <result.length; i++){
            var res = result[i];
            console.log("Item "+ res.item_id + "|" + res.product_name + "|" + res.price + " dollars" + "|" + res.stock_quantity);
        }
        console.log("\n \n");
        console.log("******************************");
        startInquiry();
    });
}

function viewLowInventory(){
    connection.query("SELECT item_id, product_name,stock_quantity,price FROM products", function(err,result){
        if (err) throw err;
        for (var i = 0; i <result.length; i++){
           
            var lowInventory = result[i].stock_quantity;
            // console.log(lowInventory);
            if(lowInventory <100) {
                console.log("Item "+ result[i].item_id + "| " + result[i].product_name + "| " +  result[i].stock_quantity);
            } 
        }
        console.log("\n \n");
        console.log("******************************");
        startInquiry();
    });
 }



function replenishInventory(){
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        // console.log(results.length);
        
        inquirer
          .prompt([
            {
              name: "select_product",
              type: "rawlist",
              choices: function() {
                var productArray = [];
                for (var i = 0; i < results.length; i++) {
                  productArray.push(results[i].product_name);
                }
                return productArray;
              },
              message: "Which item would you like to add inventory to?"
            },
            {
                name: "add_inventory",
                type: "input",
                message: "How many units would you like to add?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                  }
              }
        ])
          .then(function(answer) {
            for (var i = 0; i < results.length; i++) {
                if (results[i].product_name === answer.select_product) {
                    var chosenItem = results[i].product_name;
                    var chosenItemInventory = results[i].stock_quantity;
                    var updatedInventory = chosenItemInventory + parseInt(answer.add_inventory);
                    var chosenItemId = results[i].item_id;
                }
            }
            connection.query(
                
                "UPDATE products SET ? WHERE ?",
                [
                  {
                    stock_quantity: updatedInventory
                  },
                  {
                    item_id: chosenItemId
                  }
                ],
                function(error) {
                  if (error) throw err;
                  console.log("Inventory levels successfully updated!");
                  console.log("New inventory for "+ chosenItem + " is " + updatedInventory);
                  console.log("\n \n");
                  console.log("******************************");
                  startInquiry();
                }
            );
        });
    }); 
} 