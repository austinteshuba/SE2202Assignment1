// This is a list of handmade test inputs for the program.
// Made for ease of debugging.

// Import the appropriate functions / classes

function createLineItems(LineItem) {
    let testInputs =
        [
            new LineItem(1000, "expense", 1),
            new LineItem(2000, "expense", 2),
            new LineItem(756, "expense", 3),
            new LineItem(1040, "expense", 3),
            new LineItem(1340, "expense", 4),
            new LineItem(10, "expense", 2),
            new LineItem(2555, "expense", 5),
            new LineItem(3333, "expense", 6),
            new LineItem(2000, "expense", 8),
            new LineItem(3000, "expense", 7),
            new LineItem(1100, "expense", 9),
            new LineItem(1001, "expense", 10),
            new LineItem(1004, "expense", 11),
            new LineItem(130, "expense", 10),
            new LineItem(300, "expense", 1),
            new LineItem(1, "expense", 2),
            new LineItem(4000, "expense", 12),
            new LineItem(20, "expense", 12),
            new LineItem(2000, "revenue", 12),
            new LineItem(1500, "revenue", 2),
            new LineItem(3000, "revenue", 2),
            new LineItem(500, "revenue", 4),
            new LineItem(4000, "revenue", 5),
            new LineItem(6000, "revenue", 8),
            new LineItem(9000, "revenue", 9),
            new LineItem(1000, "revenue", 12),
        ];
    return testInputs;
}

module.exports = createLineItems;
