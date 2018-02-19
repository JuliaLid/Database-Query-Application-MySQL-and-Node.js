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
    console.log(colors.magenta.bold("Welcome, Manager. \n"));
    startInquiry();
});

//Default function to display avaialble action options
function startInquiry(){
    inquirer
    .prompt({
      name: "report_option",
      type: "rawlist",
      message: colors.yellow.bold("What would you like to do?"),
      choices: ["View Current Inventory Report", "View Low Inventory Report","Replenish Inventory Levels","Add New Product" ]
    })
    .then(function(answer) {
    //   console.log(answer.report_option);
      switch (answer.report_option) {
        case "View Current Inventory Report":
        viewInventory();
        break;
      
        case "View Low Inventory Report":
        viewLowInventory();
        break;
      
        case "Replenish Inventory Levels":
        replenishInventory();
        break;
      
        case "Add New Product":
        addNewProduct();
        break; 
      }
    });
}

//Function to view inventory for all items in the database
function viewInventory(){
    console.log(colors.yellow.bold("Inventory Report is being retrieved..."));
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err,result){
        if (err) throw err;

        var table = new Table({
          head: ["Id","Item Name","Cost","Quantity"]
        , colWidths: [5,20,10,10]
         });   

        for (var i = 0; i <result.length; i++){
            var res = result[i];

        table.push([res.item_id,res.product_name, res.price,res.stock_quantity]);
        }
        console.log(colors.green.bold(table.toString()+"\n"));
        console.log(colors.yellow.bold("***************************************************"));
        promptForNextAction();
    });
}

//Function to view inventory for items with inventory of less than 100
function viewLowInventory(){
    connection.query("SELECT item_id, product_name,stock_quantity,price FROM products", function(err,result){
		if (err) throw err;

		var table = new Table({
			head: ["Id","Item Name","Quantity"]
			, colWidths: [5,20,10]

			});
        for (var i = 0; i <result.length; i++){
			var lowInventory = result[i].stock_quantity;
			
			if(lowInventory <100) {
				table.push([result[i].item_id,result[i].product_name, result[i].stock_quantity]);
			} 
		}
	  	console.log(colors.green.bold(table.toString()+"\n"));
      console.log(colors.yellow.bold("*******************************************"));
        promptForNextAction();
    });
 }

 // Function to add inventory to items
function replenishInventory(){
	connection.query("SELECT item_id, product_name, stock_quantity FROM products", function(err, results) {
        if (err) throw err;
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
              message: colors.yellow.bold("Which item would you like to add inventory to?")
            },
            {
                name: "add_inventory",
                type: "input",
                message:colors.yellow.bold( "How many units would you like to add?"),
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
                  console.log(colors.green.bold("\n Inventory levels successfully updated!"));
                  console.log(colors.green.bold("\n New inventory for "+ chosenItem + " is " + updatedInventory + "\n"));
                  console.log(colors.yellow.bold("*******************************************"));
                  promptForNextAction();
                }
            );
        });
    }); 
} 

//Function to add new product to the database
function addNewProduct(){
    inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: colors.yellow.bold("What item would you like to add?")
      },
      {
        name: "department",
        type: "input",
        message:colors.yellow.bold( "Specify department name: ")
      },
      {
        name: "price",
        type: "input",
        message: colors.yellow.bold("Specify the price: "),
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "quantity",
        type: "input",
        message: colors.yellow.bold("Specify quantity: "),
      } 
    ])
    .then(function(answer) {
         connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.item,
          department_name: answer.department,
          price: answer.price,
          stock_quantity: answer.quantity,
          product_sales:0
        },
        function(err) {
          if (err) throw err;
          console.log(colors.green.bold("New item  has been successfully added!"+"\n"));
          console.log(colors.yellow.bold("*******************************************"));
          promptForNextAction();
        }
      );
   });
}

//Function to allow manager to end the session or return to the main menu
function promptForNextAction(){
    inquirer.prompt([
        {
          name:"action",
          type: "confirm",
          message:colors.yellow.bold("Would you like to see the main menu?"),
        } 
    ])
    .then(function(answer){
        if(answer.action===true){
            console.log("\n \n");
            console.log(colors.yellow.bold("*******************************************"));
            startInquiry();
         } else {
            console.log(colors.magenta.bold("Thank you! Good bye!"));
            connection.end();
        }
    });
}


