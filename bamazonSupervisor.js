var mysql = require ("mysql");
var inquirer = require ("inquirer");
var colors = require('colors');
var Table = require('cli-table');

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
      choices: ["View Product Sales by Department", "Create New Department" ]
    })
    .then(function(answer) {
     //   console.log(answer.report_option);
      switch (answer.report_option) {
        case "View Product Sales by Department":
        viewDepartmentSales();
        break;
      
        case "Create New Department":
        createNewSepartment();
        break;
      }
    });
}

function viewDepartmentSales(){
    connection.query("SELECT departments.department_id,departments.department_name,departments.over_head_costs,  sum(product_sales) AS product_sales FROM products right join departments on products.department_name = departments.department_name group by departments.department_id", function(err,result){
        if (err) throw err;
        
        var table = new Table({
            head: ["department_id","department_name","over_head_costs","product_sales","total_profit"]
          , colWidths: [20,20,20,20,20]
        });      

        for (var i = 0; i <result.length; i++){
           var total_profit = result[i].over_head_costs - result[i].product_sales;
            // console.log(lowInventory);
           
             table.push([result[i].department_id,result[i].department_name, result[i].over_head_costs, result[i].product_sales,total_profit]);
            
        }
        console.log(table.toString());
        console.log("\n \n");
        promptForNextAction();
    });
}

function createNewSepartment(){
    inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "Specify the new department name: "
      },
      {
        name: "cost",
        type: "input",
        message: "Specify the new department's overhead cost: "
      }
      
    ])
    .then(function(answer) {
    console.log(answer);
         connection.query(
        "INSERT INTO departments SET ?",
        {
          department_name: answer.department,
          over_head_costs: answer.cost,
        },
        function(err) {
          if (err) throw err;
          console.log("New department  has been successfully added!");
          console.log("\n");
          console.log("******************************");
          promptForNextAction();
        }
      );
   });
}

function promptForNextAction(){
    inquirer.prompt([
        {
          name:"action",
          type: "confirm",
          message: "Would you like to see the main menu?",
        } 
    ])
    .then(function(answer){
        if(answer.action===true){
            console.log("\n \n");
             console.log("******************************");
            startInquiry();
         } else {
            console.log(colors.yellow.bold("Thank you! Good bye!"));
            connection.end();
        }
    });
}