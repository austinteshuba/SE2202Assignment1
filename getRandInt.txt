// this gets a random int that is between min and max, inclusive.
function getRandInt(min, max) {
    return min + Math.floor(Math.random()*(max-min+1));
}

module.exports = getRandInt;
