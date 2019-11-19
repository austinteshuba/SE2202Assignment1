// SE2202 Assignment 1
// By Austin Teshuba, Benjamin Wolfman, Summers Wu, Paarth Ahuja
// This is a program that will take in a list of line items
// And suggest changes to the budget so that the expenses for any given month
// Does not exceed the surplus of the previous months + the revenue for the given month.


// Data Structures
// Class: LineItem
// This is an object to encapsulate the data of a lineitem (either expense or revenue)
// As well as the month it belongs to and how much it is.
class LineItem {
    constructor(amount, type, month) {
        // Month with getter and setter
        let _month;
        // 1 is january, 2 is february, etc.
        // Month must be a number, or this is invalid/
        this.setMonth = function(month) {
            if (typeof month === "number" && month >=1 && month <= 13) {
                _month = month;
                return;
            }
            throw new Error("Invalid Month");
        };
        this.incrementMonth = function () {
            this.setMonth(this.getMonth() + 1);
        };
        this.getMonth = function() {
            return _month;
        };
        this.setMonth(month);


        let _originalMonth = month;
        this.getOriginalMonth = function () {
            return _originalMonth;
        };


        // Type with getter and setter
        let _type;
        // Type must be a revenue or expense, otherwise an error will be thrown.
        this.setType = function(type) {
            if (type.toLowerCase() === "expense") {
                _type = "expense";
            } else if (type.toLowerCase() === "revenue") {
                _type = "revenue";
            } else {
                throw new Error("Invalid Type");
            }
        };
        this.getType = function() {
            return _type;
        };
        this.setType(type);

        // Amount
        let _amount;
        // Amount must be a dollar value, or an error will be thrown.
        this.setAmount = function(amount) {
            if (typeof amount === "number") {
                _amount = amount;
                return;
            }
            throw new Error("Invalid Amount");
        };
        this.getAmount = function() {
            return _amount;
        };
        this.setAmount(amount);
    }
    // This is a helper method to print out the instance's properties
    printItem() {
        if (this.getType() === "revenue") {
            console.log(
                `Type: ${this.getType()}
            Amount: $${this.getAmount()}
            Month: ${this.textMonth(this.getOriginalMonth())}
        `);
        } else {
            console.log(
                `Type: ${this.getType()}
            Amount: $${this.getAmount()}
            Original Month: ${this.textMonth(this.getOriginalMonth())}
            Suggested Month: ${this.textMonth(this.getMonth())}
        `);
        }
    }
    // This is a helper method for the print function which displays the numerical month as the english month.
    textMonth(month) {
        switch(month) {
            case 1:
                return "January";
            case 2:
                return "February";
            case 3:
                return "March";
            case 4:
                return "April";
            case 5:
                return "May";
            case 6:
                return "June";
            case 7:
                return "July";
            case 8:
                return "August";
            case 9:
                return "September";
            case 10:
                return "October";
            case 11:
                return "November";
            case 12:
                return "December";
            case 13:
                return "Next Fiscal Year";
        }
    }
}
function suggestBudget(lineItems) {

    // Step Zero: Print Input
    console.log("//////// Old Transactions ////////");
    lineItems.sort((a,b) => a.getMonth() > b.getMonth() ? 1:-1);
    for (let o of lineItems) {
        o.printItem();
    }
    // Step One: Populate hashmap (i.e. object) with the expenses
    let monthExpenses = {}; // Object to hold all expenses for the month. Month : [lineItems]
    let monthRevenues = {}; // Object to hold bank balances from each month
    let monthRevenuesLineItems = {}; // Object to hold revenue line items, purely for output.

    // Init all the objects with empty lists / empty dollar values
    for (let i = 1; i<=13; i++) {
        monthExpenses[i] = [];
        monthRevenues[i] = 0;
        monthRevenuesLineItems[i] = [];
    }
    //iterate through the line items and add to the appropriate object
    for (let o of lineItems) {
        if (o.getType() === 'expense') {
            monthExpenses[o.getMonth()].push(o);
        } else {
            monthRevenues[o.getMonth()] = monthRevenues[o.getMonth()] + o.getAmount();
            monthRevenuesLineItems[o.getMonth()].push(o);
        }
    }
    // Step Two: Suggest new months
    let currentBank = 0; // This is the current bank balance. It cannot go below 0
    for (let i = 1; i<=12; i++) {
        // add the revenues to the balance
        currentBank += monthRevenues[i];
        // Sort the expenses by the amount of money they are
        let expenses = monthExpenses[i];
        // Prioritize expenses that have been pushed off, then prioritize larger expenses.

        function prioritize(a,b) {
            if (a.getOriginalMonth() < b.getOriginalMonth()) {
                // A is earlier than b, a is first
                return -1;
            }
            else if (a.getAmount() > b.getAmount() && a.getOriginalMonth() === b.getOriginalMonth()) {
                // if a is worth more, it's first
                return -1;
            }
            return 1; // otherwise, a is last and b is first
        }
        expenses.sort(prioritize);

        monthExpenses[i] = []; // Start by emptying out the month expenses.
        for(let j = 0; j<expenses.length; j++) {
            if (expenses[j].getAmount() <= currentBank) { // if we can afford it, add it to the current month
                currentBank -= expenses[j].getAmount();
                monthExpenses[i].push(expenses[j]);
            } else {
                // We cannot afford this line item, so add it to the next month.
                expenses[j].incrementMonth();
                monthExpenses[i+1].push(expenses[j]);
            }
        }
    }

    // Step Three: Return a list with all of the line items
    let retArr = [];
    for (let i = 1; i<=13; i++) {
        retArr = retArr.concat(monthRevenuesLineItems[i]);
        retArr = retArr.concat(monthExpenses[i]);
        // console.log(retArr);
    }
    return retArr;
}

function suggestNewBudgets(lineItems=createSampleInput()) {
    let newLineItems = suggestBudget(lineItems);
    console.log("////////////////// New Inputs ///////////////////");
    for (let o of newLineItems) {
        o.printItem();
    }
}

// Test Section

// Create Sample Input function is just for testing purposes which will create a list of placeholder objects for
// testing purposes
// n is the number of entries desired.
function createSampleInput(n=30) {
    let retArr = [];
    for (let i = 0; i<n/2; i++) {
        retArr.push(new LineItem(getRandInt(2000,3000), "revenue", getRandInt(1,12)));
        retArr.push(new LineItem(getRandInt(2000,3000), "expense", getRandInt(1,12)));

    }
    return retArr;
}
// this gets a random int that is between min and max, inclusive.
function getRandInt(min, max) {
    return min + Math.floor(Math.random()*(max-min+1));
}

// Test Command
suggestNewBudgets();








