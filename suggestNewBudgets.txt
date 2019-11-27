// This is a function that will be used to call the suggest new budgets
// Function called for outputs.
// Uses a random input to start

// Import the appropriate functions / classes
let suggestBudget = require('./suggestBudget');
let createSampleInput = require('./createSampleInput');
function suggestNewBudgets(lineItems=createSampleInput()) {
    let newLineItems = suggestBudget(lineItems);
    console.log("////////////////// New Inputs ///////////////////");
    for (let o of newLineItems) {
        o.printItem();
    }
}
module.exports = suggestNewBudgets;
