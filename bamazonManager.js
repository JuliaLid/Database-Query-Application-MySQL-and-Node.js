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
      
        // case "View Low Inventory report":
        //   viewLowInventory();
        //   break;
      
        // case "Replenish inventory levels":
        //   replenishInventory();
        //   break;
      
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
            console.log("Item "+ res.item_id + "|" + res.product_name + "|" + res.price + " dollars" + "|" + "res.stock_quantity");
        }
        console.log("\n \n");
        console.log("******************************");
        startInquiry();
    });
}
