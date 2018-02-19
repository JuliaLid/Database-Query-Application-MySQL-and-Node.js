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
    console.log(colors.magenta.bold("Welcome, Supervisor. \n"));
    startInquiry();
});

//Default function to display avaialble action options
function startInquiry(){
    inquirer
    .prompt({
      name: "report_option",
      type: "rawlist",
      message: colors.yellow.bold("What would you like to do?"),
      choices: ["View Product Sales by Department", "Create New Department" ]
    })
    .then(function(answer) {
      switch (answer.report_option) {
        case "View Product Sales by Department":
        viewDepartmentSales();
        break;
      
        case "Create New Department":
        createNewDepartment();
        break;
      }
    });
}

//Funciton to view department sales
function viewDepartmentSales(){
    connection.query("SELECT departments.department_id,departments.department_name,departments.over_head_costs, IFNULL(product_sales, 0) AS product_sales FROM products right join departments on products.department_name = departments.department_name group by departments.department_id", function(err,result){
      
      if (err) throw err;
        
        var table = new Table({
            head: ["department_id","department_name","over_head_costs","product_sales","total_profit"]
          , colWidths: [20,20,20,20,20]
        });      

        for (var i = 0; i <result.length; i++){
           var total_profit = result[i].over_head_costs - result[i].product_sales;
           
            table.push([result[i].department_id,result[i].department_name, result[i].over_head_costs, result[i].product_sales,total_profit]);
            
        }
        console.log(colors.green.bold(table.toString()+"\n"));
        console.log(colors.yellow.bold("***************************************************"));
        promptForNextAction();
    });
}

//Function to add a new department 
function createNewDepartment(){
    inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: colors.yellow.bold("Specify the new department name: ")
      },
      {
        name: "cost",
        type: "input",
        message: colors.yellow.bold("Specify the new department's overhead cost: ")
      }
      
    ])
    .then(function(answer) {
         connection.query(
        "INSERT INTO departments SET ?",
        {
          department_name: answer.department,
          over_head_costs: answer.cost,
        },
        function(err) {
          if (err) throw err;
          console.log(colors.green.bold("New department  has been successfully added!" + "\n"));
          console.log(colors.yellow.bold("*******************************************"));
          promptForNextAction();
        }
      );
   });
}

//Function to allow supervisor to end the session or return to the main menu
var promptForNextAction = function(){
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

