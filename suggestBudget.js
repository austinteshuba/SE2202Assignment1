// This is a function that will take in a list of line items
// And output a list of changed line items to balance the budget
// by shifting expenses to later months.
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

        // Sort function that will prioritize months, then amounts. This will ensure we are paying the most relevant expenses first.
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
        expenses.sort(prioritize); // prioritize all current expenses.

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

module.exports = suggestBudget;
