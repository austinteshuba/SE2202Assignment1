// Create Sample Input function is just for testing purposes which will create a list of placeholder objects for
// testing purposes
// n is the number of entries desired.

// Import the appropriate functions / classes
// let getRandInt = require('./getRandInt');
// let LineItem = require('./LineItem');
function createSampleInput(getRandInt,LineItem, n=30) {
    let retArr = [];
    for (let i = 0; i<n/2; i++) {
        retArr.push(new LineItem(getRandInt(2000,3000), "revenue", getRandInt(1,12)));
        retArr.push(new LineItem(getRandInt(2000,3000), "expense", getRandInt(1,12)));

    }
    return retArr;
}
module.exports = createSampleInput;
