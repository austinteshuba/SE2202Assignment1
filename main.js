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
            if (typeof month === "number" && month >=1 && month <= 12) {
                _month = month;
                return;
            }
            throw new Error("Invalid Month");
        };
        this.getMonth = function() {
            return _month;
        };
        this.setMonth(month);

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
        console.log(
            `Type: ${this.getType()}
            Amount: $${this.getAmount()}
            Month: ${this.textMonth()}
        `);
    }
    // This is a helper method for the print function which displays the numerical month as the english month.
    textMonth() {
        switch(this.getMonth()) {
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
        }
    }
}
// The Changed Line Item class is a subclass of the LineItem that
// includes information about the original line item + the amount it has changed
class ChangedLineItem extends LineItem {
    constructor(amount, type, month) {
        super(amount, type, month);

        let _amountChanged = 0;
        // Scaling the amount takes a scaling ratio.
        // By multiplying the old amount of the lineitem by the scaling ratio
        // We can suggest an appropriate decrease of budget.
        // We will track the amount changed with a new local property, accessible by a public getter.
        this.scaleAmount = function(ratio) {
            if (this.getType() === "expense") {
                let oldAmount = this.getAmount();
                let newAmount = Number((oldAmount * ratio).toFixed(2));
                _amountChanged += Number((newAmount - oldAmount).toFixed(2));
                this.setAmount(newAmount);
            }
        };
        this.getAmountChanged = function() {
            return _amountChanged;
        }
    }

    // This is an override of the printitem method from the superclass.
    // This simply adds the amount changed property.
    printItem() {
        console.log(
            `Type: ${this.getType()}
            Amount: $${this.getAmount()}
            Month: ${this.textMonth()}
            amountChanged: $${this.getAmountChanged()}
        `);
    }


}
// This class includes all of the relevant information about a month which
// Will allow us to make appropriate scaling decisions.
// Total income tracks the month's revenues,
// total expenses tracks the month's expenses,
// and the carried surplus is the excess capital from the month previous that we have access to
class MonthSummary {
    constructor(totalIncome, totalExpenses, carriedSurplus) {
        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        // The carried surplus cannot be negative.
        this.carriedSurplus = Math.max(carriedSurplus,0);

        // The working income is how much money we have available to cover expenses in this month
        this.workingIncome = this.totalIncome + this.carriedSurplus;

        // THIS IS IMPORTANT
        // The scaling ratio is the amount we have to multiply all of the expenses by for
        // that month to ensure the total expenses does not exceed the total revenue for the month
        // We get this by getting the quotient of working income and total expenses.
        // If this number is above one, set the scaling ratio to one.
        this.scalingRatio = Math.min(1, this.workingIncome / this.totalExpenses);
    }
}


// This gets all of the summaries and actions needed for the month.
// O(nlogn) due to sort.
// Process
// 1: Sort the list so all of the l;ine items are in chronilogical order.
function getIncomeSummaries(lineItems) {
    // Sort in ascending order by month (January -> December)
    lineItems.sort((a,b) => a.getMonth() >= b.getMonth() ? 1: -1);

    // Uncomment this for testing

    // for (let o of lineItems) {
    //     o.printItem();
    // }


    let incomeSummaries = {}; // stores income summaries
    let carriedSurplus = 0; // stored the excess funds available from the previous months

    let currentMonth = 1; // start at january
    let currentIncome = 0; // Start with an empty counter of income and expenses
    let currentExpenses = 0;

    for (let i = 0; i<=lineItems.length; i++) {
        // If we have reached the end of the list
        if (i===lineItems.length) {
            // Create object for last month
            incomeSummaries[currentMonth] = new MonthSummary(currentIncome, currentExpenses, carriedSurplus);
            // Update the accumulated surplus
            if (currentIncome >= currentExpenses) {
                // There are excess funds available
                carriedSurplus += currentIncome - currentExpenses;
            } else {
                // We have to dip into the carried surplus. Do not subtract more than the available balance.
                carriedSurplus -= Math.min(carriedSurplus, currentExpenses - currentIncome);
            }

            // Input empty months for any skipped months
            for (let i = currentMonth+1; i<=12; i++) {
                incomeSummaries[i] = new MonthSummary(0,0,carriedSurplus);
            }
        } else {
            let o = lineItems[i]; // get the line item
            if (o.getMonth() !== currentMonth) {
                // If we have moved on to a new month, make a summary account for that month.
                incomeSummaries[currentMonth] = new MonthSummary(currentIncome, currentExpenses, carriedSurplus);
                // Update the accumulated surplus
                if (currentIncome >= currentExpenses) {
                    // excess income
                    carriedSurplus += currentIncome - currentExpenses;
                } else {
                    // We must dip into our reserve cash to pay expenses.
                    // Do not subtract more than the available balance
                    carriedSurplus -= Math.min(carriedSurplus, currentExpenses - currentIncome);
                }

                // Input empty months for any skipped months
                for (let i = currentMonth + 1; i < o.getMonth(); i++) {
                    incomeSummaries[i] = new MonthSummary(0, 0, carriedSurplus);
                }

                // Update the month to the current month, reset the expenses and income counters
                currentMonth = o.getMonth();
                currentExpenses = 0;
                currentIncome = 0;
            }
            // Now that we handled the case that we entered a new month, we can simply increment the appropriate counters.
            if (o.getType() === "revenue") {
                currentIncome += o.getAmount();
            } else {
                currentExpenses += o.getAmount();
            }
        }
    }
    // console.log(currentMonth);

    return incomeSummaries;
}

// This is a function that will be used to map old line items to a new, changed line item object with a scaled amount
function changeLineItem(lineItem, incomeSummaries) {
    let changedLineItem = new ChangedLineItem(lineItem.getAmount(), lineItem.getType(), lineItem.getMonth());
    changedLineItem.scaleAmount(incomeSummaries[lineItem.getMonth()].scalingRatio); // scale the amount by the scaling ratio in the relevant month
    return changedLineItem;
}

// This is a map function that will change all of the LineItem instances in the lineItems list to ChangedLineItem objects
function mapLineItems(lineItems, incomeSummaries, mapFunction) {
    let newLineItems = [];
    for (let o of lineItems) {
        newLineItems.push(mapFunction(o, incomeSummaries));
    }
    return newLineItems;
}

// This is the function that will call the appropriate functions to suggest new budgets
// By default, if an input is not given, it will use a random one generated for testing.
function suggestNewBudgets(lineItems = createSampleInput()) {
    let incomeSummaries = getIncomeSummaries(lineItems);
    let changedItems = mapLineItems(lineItems, incomeSummaries, changeLineItem);

    // Print!
    console.log("Previous Line Items:");
    for (let o of lineItems) {
        o.printItem();
    }

    console.log("This is the suggested budget, based on an equal scaling method");
    console.log("All budgets scaled by the same percentage/ratio");
    for (let o of changedItems) {
        o.printItem();
    }
    return changedItems;
}

// Test Section

// Create Sample Input function is just for testing purposes which will create a list of placeholder objects for
// testing purposes
// n is the number of entries desired.
function createSampleInput(n=30) {
    let retArr = [];
    for (let i = 0; i<n; i++) {
        retArr.push(new LineItem(getRandInt(1000,3000), getRandInt(0,1) === 1 ? "expense": "revenue", getRandInt(1,12)));
    }
    return retArr;
}
// this gets a random int that is between min and max, inclusive.
function getRandInt(min, max) {
    return min + Math.floor(Math.random()*(max-min+1));
}

// Test Command
suggestNewBudgets();








