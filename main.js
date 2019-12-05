// SE2202 Assignment 1
// By Austin Teshuba, Benjamin Wolfman, Summers Wu, Paarth Ahuja
// This is a program that will take in a list of line items
// And suggest changes to the budget so that the expenses for any given month
// Does not exceed the surplus of the previous months + the revenue for the given month.

// Import the appropriate functions / classes
// Note that all of the modules have been changed to be completely resuable with different object types and helper functions
// As such, many of the below bindings will be passed into the functions as callbacks.



const loadModulesPromise = new Promise(function(resolve, reject) {
    try {
        let createLineItems = require('./testInputs');
        let suggestNewBudgets = require('./suggestNewBudgets');
        let LineItem = require('./LineItem');
        let suggestBudget = require('./suggestBudget');
        let getRandInt = require('./getRandInt');
        let createSampleInput = require('./createSampleInput');
        //
        resolve([createLineItems, suggestNewBudgets, LineItem, suggestBudget, getRandInt, createSampleInput]);
    } catch {
        reject("Not Found");
    }
});

loadModulesPromise.then((result) => {
    // If we need the random inputs, use this. But, we don't really need it since we have well defined outputs.
    let randomLineItems = result[5](result[4], result[2]);
    let lineItems = result[0](result[2]); // Get the test line items. Pass iun the line items prototype
    result[1](result[3], lineItems); // call the function which will trigger the appropriate calculations. Pass in the line items and the suggest budget module


}).catch((val) => console.log(val));

// suggestNewBudgets(testInputs);









