// Data Structures
class LineItem {
    constructor(amount, type, month) {
        // Month
        let _month;
        this.setMonth = function(month) {
            if (typeof month === "number") {
                _month = month;
                return;
            }
            throw new Error("Invalid Month");
        };
        this.getMonth = function() {
            return _month;
        };
        this.setMonth(month);

        // Type
        let _type;
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
    printItem() {
        console.log(
            `Type: ${this.getType()}
            Amount: $${this.getAmount()}
            Month: ${this.textMonth()}
        `);
    }
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

class ChangedLineItem extends LineItem {
    constructor(amount, type, month) {
        super(amount, type, month);

        let _amountChanged = 0;
        this.scaleAmount = function(ratio) {
            if (this.getType() === "expense") {
                let oldAmount = this.getAmount();
                let newAmount = oldAmount * ratio;
                _amountChanged += newAmount - oldAmount;
                this.setAmount(newAmount);
            }
        };
        this.getAmountChanged = function() {
            return _amountChanged;
        }
    }

    printItem() {
        console.log(
            `Type: ${this.getType()}
            Amount: $${this.getAmount()}
            Month: ${this.textMonth()}
            amountChanged: $${this.getAmountChanged()}
        `);
    }


}

class MonthSummary {
    constructor(totalIncome, totalExpenses, carriedSurplus) {
        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.carriedSurplus = Math.max(carriedSurplus,0);

        this.workingIncome = this.totalIncome + this.carriedSurplus;
        this.scalingRatio = Math.min(1, this.workingIncome / this.totalExpenses);
    }
}


function createSampleInput() {
    let retArr = [];
    for (let i = 0; i<30; i++) {
        retArr.push(new LineItem(getRandInt(1000,3000), getRandInt(0,1) === 1 ? "expense": "revenue", getRandInt(1,12)));
    }
    return retArr;
}
function getRandInt(min, max) {
    return min + Math.floor(Math.random()*(max-min+1));
}


// This gets all of the summaries and actions needed for the month.
// O(nlogn) due to sort.
function getIncomeSummaries(lineItems) {
    // now sorted
    lineItems.sort((a,b) => a.getMonth() >= b.getMonth() ? 1: -1);

    for (let o of lineItems) {
        o.printItem();
    }
    // Will store the income summaries
    let incomeSummaries = {};


    let carriedSurplus = 0;

    let currentMonth = 1;
    let currentIncome = 0;
    let currentExpenses = 0;
    for (let i = 0; i<=lineItems.length; i++) {
        if (i===lineItems.length) {
            // Create object for last month
            incomeSummaries[currentMonth] = new MonthSummary(currentIncome, currentExpenses, carriedSurplus);
            // Update the accumulated surplus
            if (currentIncome >= currentExpenses) {
                carriedSurplus += currentIncome - currentExpenses;
            } else {
                carriedSurplus -= Math.min(carriedSurplus, currentExpenses - currentIncome);
            }

            // Input empty months for any skipped months
            for (let i = currentMonth+1; i<=12; i++) {
                incomeSummaries[i] = new MonthSummary(0,0,carriedSurplus);
            }
        } else {
            let o = lineItems[i];
            if (o.getMonth() !== currentMonth) {
                // Create object for last month
                incomeSummaries[currentMonth] = new MonthSummary(currentIncome, currentExpenses, carriedSurplus);
                // Update the accumulated surplus
                if (currentIncome >= currentExpenses) {
                    carriedSurplus += currentIncome - currentExpenses;
                } else {
                    carriedSurplus -= Math.min(carriedSurplus, currentExpenses - currentIncome);
                }

                // Input empty months for any skipped months
                for (let i = currentMonth + 1; i < o.getMonth(); i++) {
                    incomeSummaries[i] = new MonthSummary(0, 0, carriedSurplus);
                }

                // Update the values
                currentMonth = o.getMonth();
                currentExpenses = 0;
                currentIncome = 0;
            }
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

function changeLineItem(lineItem, incomeSummaries) {
    let changedLineItem = new ChangedLineItem(lineItem.getAmount(), lineItem.getType(), lineItem.getMonth());
    changedLineItem.scaleAmount(incomeSummaries[lineItem.getMonth()].scalingRatio);
    return changedLineItem;
}

function mapLineItems(lineItems, incomeSummaries) {
    let newLineItems = [];
    for (let o of lineItems) {
        newLineItems.push(changeLineItem(o, incomeSummaries));
    }
    return newLineItems;
}

// Test
let sampleInput = createSampleInput();
let incomeSummaries = getIncomeSummaries(sampleInput);
let newItems =  mapLineItems(sampleInput, incomeSummaries);
console.log("////////////////// New Items ///////////////////");
for (let o of newItems) {
    o.printItem();
}








