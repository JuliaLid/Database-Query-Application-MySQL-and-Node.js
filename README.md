# Database Query Application using MySQL and Node.js

## Project Overview
This app creates an Amazon-like storefront and back-end reporting using `MySQL` queries and `Node.js`. There are three apps that represent three users:
* **Customer**
    * The app takes orders from Customers and deplete stock from the store's inventory.
    ![customer](https://user-images.githubusercontent.com/31745567/36397840-d9ddf20e-1589-11e8-964f-b6228d07b420.png)
    * [Customer View Video](https://drive.google.com/file/d/1JWSviYTJhtvrMdhrPJQsEKiVwnORARyf/view)
* **Manager**
    * The app gives a Manager options to view inventory levels for all products, view items with low inventory, add inventory to a selected item, and add a new item to the store.
    ![manager](https://user-images.githubusercontent.com/31745567/36397901-21c0b020-158a-11e8-8f69-0cfcef232757.png)
    * [Manager View Video](https://drive.google.com/file/d/1VQJtMLHT6wMPjSC2Gda26TBU3id-a9fC/view)
* **Supervisor**
    * The app gives a Supervisor options to view total sales and profit by department and to add a new department. 
    ![supervisor](https://user-images.githubusercontent.com/31745567/36397941-4d72947c-158a-11e8-82bf-12e041c0e7e5.png)
    * [Supervisor View Video](https://drive.google.com/file/d/1EJtBilcUKByjNnmzIaFGQ9u4RjThGDOP/view)

## Technology Stack
* JavaScript 
* Node.js
* npm packages
    * [mysql](https://www.npmjs.com/package/mysql): used for quering a `MySQL` database on a local server.        
    * [inquire](https://www.npmjs.com/package/inquirer): used for getting an input from a specific user depending on the app.
    * [colors](https://www.npmjs.com/package/colors): used for styling app commands and outputs.
    * [cli-table](https://github.com/Automattic/cli-table): used for displaying query results in a table.
  
## Comments
* Learned a lot about `MySQL` queries. I used `MySQL Workbench` to fine-tune the queries before adding them to the `Node.js` apps.
* Learned how to change the column value types to allow decimal values and to replace `null` values to`0` in order to perform calculations.  

## Feedback and Questions
 * I welcome overall code structure feedback and what I can do to further refactor it. 
