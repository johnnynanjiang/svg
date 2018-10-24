describe("Test cases for SVG", function() {
    it("Parses <path d='...'>", function() {
        const d = "M1.0 2.0L3.0 4.0L5.0 6.0Z;"
        const result = parseDInPath(d)

        expect(result.toString()).toBe("M,1.0,2.0,L,3.0,4.0,L,5.0,6.0,Z,;")
    })

    it("Gets diff between two arrays in the same size, A = B", function() {
        const array1 = ["M", "1.0", "2.0", "L", "3.0", "4.0", "L", "5.0", "6.0", ";"]
        const array2 = ["M", "2.0", "4.0", "L", "6.0", "8.0", "L", "10.0", "12.0", ";"]
        const diff = getDiffBetween(array1, array2)

        expect(diff.toString()).toBe("M,1,2,L,3,4,L,5,6,;")
    })

    it("Gets diff between two arrays in different size, A < B", function() {
        const array1 = ["M", "1.0", "2.0", "L", "3.0", "4.0", ";"]
        const array2 = ["M", "2.0", "4.0", "L", "6.0", "8.0", "L", "10.0", "12.0", ";"]
        const diff = getDiffBetween(array1, array2)

        expect(diff.toString()).toBe("M,1,2,L,3,4,L,10.0,12.0,;")
    })

    it("Gets diff between two arrays in different size, A > B", function() {
        const array1 = ["M", "1.0", "2.0", "L", "3.0", "4.0","L", "5.0", "6.0", ";"]
        const array2 = ["M", "2.0", "4.0", "L", "6.0", "8.0",";"]
        const diff = getDiffBetween(array1, array2)

        expect(diff.toString()).toBe("M,1,2,L,3,4,;")
    })
})

/* Utilities */
const concat = (x,y) =>
    x.concat(y)

const flatMap = (f,xs) =>
    xs.map(f).reduce(concat, [])

Array.prototype.flatMap = function(f) {
    return flatMap(f,this)
}

const testLog = (text) => {
    //console.log(text)
}

/* Functionality */
function parseDInPath(value) {
    return value.split(" ")
        .flatMap(e => e.split(/(M)/g))
        .flatMap(e => e.split(/(L)/g))
        .flatMap(e => e.split(/(Z)/g))
        .flatMap(e => e.split(/(;)/g))
        .filter(e => e != '')
}

function getDiffBetween(array1, array2) {
    const length = array2.length
    const result = [length]

    for (let i=0; i<length; i++) {
        const e1 = array1[i]
        const e2 = array2[i]

        const e1ToNumber = Number(e1)
        const e2ToNumber = Number(e2)

        if (isNaN(e2ToNumber) || e1 === undefined) {
            testLog(`${e2} is NaN`)
            result[i] = e2
        } else {
            testLog(`${e2} is not NaN`)
            result[i] = (e2ToNumber - e1ToNumber).toString()
        }
    }

    return result
}