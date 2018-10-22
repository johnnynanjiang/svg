describe("Test cases for SVG", function() {
    it("Parses <path d='...'>", function() {
        let d = "M1.0 2.0L3.0 4.0L5.0 6.0Z;"
        let results = parseDInPath(d)
        expect(results.toString()).toBe("M,1.0,2.0,L,3.0,4.0,L,5.0,6.0,Z,;")
    });
});

const concat = (x,y) =>
    x.concat(y)

const flatMap = (f,xs) =>
    xs.map(f).reduce(concat, [])

Array.prototype.flatMap = function(f) {
    return flatMap(f,this)
}


function parseDInPath(value) {
    return value.split(" ")
        .flatMap(e => e.split(/(M)/g))
        .flatMap(e => e.split(/(L)/g))
        .flatMap(e => e.split(/(Z)/g))
        .flatMap(e => e.split(/(;)/g))
        .filter(e => e != '')
}