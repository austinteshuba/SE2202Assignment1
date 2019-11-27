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


        // the original month will keep track of when the transaction initially was.
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

        // Amount getter and setter
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
        // if the item is a revenue or the original month is the same as the current month, make it cleaner by only printing the current month
        if (this.getType() === "revenue" || this.getOriginalMonth() === this.getMonth()) {
            console.log(
                `Type: ${this.getType()}
            Amount: $${this.getAmount()}
            Month: ${this.textMonth(this.getOriginalMonth())}
        `);
        } else {
            // If the item is an expense and the month has been changed, show the changes.
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

module.exports =  LineItem;
