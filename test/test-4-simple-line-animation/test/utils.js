/* Utilities */

const concat = (x,y) =>
    x.concat(y)

const flatMap = (f,xs) =>
    xs.map(f).reduce(concat, [])

Array.prototype.flatMap = function(f) {
    return flatMap(f,this)
}

const testLog = (text) => {
    console.log(text)
}

module.exports = {
    testLog: testLog
}