// dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');

// mysql connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'employee_db',
});

// connection and initial prompt questions
connection.connect(async (err) => {
  if (err) throw err;
  console.log(`Employee Tracker connection id ${connection.threadId}\n`);
  start();
});

const start = async () => {
  try {
    const mainQuestions = await inquirer.prompt([
      {
        name: 'userOption',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View all employees?',
          'View all employee roles?',
          'View all departments?',
          'Add employee?',
          'Add role?',
          'Add department?',
          'Exit?'
        ],
      }
    ]);
    selections(mainQuestions.userOption);
  } catch (e) {
    console.log(e);
  }
};


const selections = async (userChoice) => {

  if (userChoice === 'View all employees?') {
    viewEmployee();
  }
  if (userChoice === 'View all employee roles?') {
    viewRole();
  }
  if (userChoice === 'View all departments?') {
    viewDepartment();
  }
  if (userChoice === 'Add employee?') {
    addEmployee();
  }
  if (userChoice === 'Add role?') {
    addRole();
  }
  if (userChoice === 'Add department?') {
    addDepartment();
  }
  if (userChoice === 'Exit?') {
    console.log('Thank you for using Employee Tracker.')
    connection.end();
  }
};


const viewEmployee = () => {
  const query = `SELECT * FROM employees`;
  connection.query(query, (err, employees) => {
    if (err) throw err;
    console.table(employees);
    start();

  });
};

const viewRole = () => {
  const query = `SELECT * FROM role`;
  connection.query(query, (err, role) => {
    if (err) throw err;
    console.table(role);
    start();

  });
};

const viewDepartment = () => {
  const query = `SELECT * FROM departments`;
  connection.query(query, (err, departments) => {
    if (err) throw err;
    console.table(departments);
    start();

  });
};

const addEmployee = async () => {
  try {
    const { first, last, role, manager } = await inquirer.prompt([
      {
        name: 'first',
        type: 'input',
        message: 'What is the employees first name?',

      },
      {
        name: 'last',
        type: 'input',
        message: 'What is the employees last name?',
      },
      {
        name: 'role',
        type: 'list',
        message: 'What is the employees role?',
        choices: [

          { name: 'Lead Engineer', value: 1 },
          { name: 'Engineer', value: 2 },
          { name: 'Sales Lead', value: 3 },
          { name: 'Sales Person', value: 4 },
          { name: 'HR', value: 5 },
          { name: 'Lawyer', value: 6 },

        ]
      },
      {
        name: 'manager',
        type: 'list',
        message: 'Who is the employees manager?',
        choices: [

          { name: 'Ali Wong', value: 1 },
          { name: 'Amy Schumer', value: 4 },
          { name: 'Tom Segura', value: 6 },
          { name: 'Iliza Shlesinger', value: 9 },
          { name: 'Bernie Mac', value: 10 },
          { name: 'None', value: null }

        ]
      }
    ]);
    const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)';
    connection.query(query, [first, last, role, manager], (err, result) => {
      if (err) throw err;
      console.log(`NEW EMPLOYEE ADDED:${first} ${last} `);
      start();

    });
  } catch (err) {
    console.log(err);
    connection.end();
  }
}

const addRole = async () => {
  try {
    const { title, salary, department } = await inquirer.prompt([
      {
        name: 'title',
        type: 'input',
        message: 'What is the title of the new role?',
      },
      {
        name: 'salary',
        type: 'number',
        message: 'What is the salary for the new role?',
      },
      {
        name: 'department',
        type: 'list',
        message: 'What department is the new role for?',
        choices: [

          { name: 'Engineer', value: 1 },
          { name: 'Sales', value: 2 },
          { name: 'HR', value: 3 },
          { name: 'Legal', value: 4 }

        ]
      },
    ]);
    const query = 'INSERT INTO role SET ?';
    connection.query(query, { title, salary, department_id: department }, (err, title) => {
      console.log(`NEW ROLE ADDED:${title}`);
      start();
    });
  } catch (err) {
    console.log(err);
    connection.end();
  }
};


const addDepartment = async () => {
  try {
    const newDept = await inquirer.prompt([
      {
        name: "name",
        type: 'input',
        message: "What Department would you like to add?"
      }
    ]);
    connection.query('INSERT INTO departments(name) VALUES(?)', newDept.name);
    console.log(`New department added: ${newDept.name}`);
    start();
  } catch (err) {
    console.log(err);
    connection.end();
  }
};