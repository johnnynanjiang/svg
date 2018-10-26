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

        expect(diff.toString()).toBe("M,1.00,2.00,L,3.00,4.00,L,5.00,6.00,;")
    })

    it("Gets diff between two arrays in different size, A < B", function() {
        const array1 = ["M", "1.0", "2.0", "L", "3.0", "4.0", ";"]
        const array2 = ["M", "2.0", "4.0", "L", "6.0", "8.0", "L", "10", "12", ";"]

        const diff = getDiffBetween(array1, array2)

        expect(diff.toString()).toBe("M,1.00,2.00,L,3.00,4.00,L,10.00,12.00,;")
    })

    it("Gets diff between two arrays in different size, A > B", function() {
        const array1 = ["M", "1.0", "2.0", "L", "3.0", "4.0","L", "5.0", "6.0", ";"]
        const array2 = ["M", "2.0", "4.0", "L", "6.0", "8.0",";"]

        const diff = getDiffBetween(array1, array2)

        expect(diff.toString()).toBe("M,1.00,2.00,L,3.00,4.00,;")
    })

    it("Gets diff between two arrays in different size, A is empty", function() {
        const array1 = []
        const array2 = ["M", "2.0", "4.0", "L", "6.0", "8.0",";"]

        const diff = getDiffBetween(array1, array2)

        expect(diff.toString()).toBe("M,2.00,4.00,L,6.00,8.00,;")
    })

    it("Gets pattern from a series of paths", function() {
        const array1 = ["M", "1.0", "2.0", "L", "3.0", "4.0","L", "5.0", "6.0", ";"]
        const array2 = ["M", "2.1", "4.1", "L", "6.1", "8.1",";"]
        const array3 = ["M", "1.2", "2.2", "L", "3.2", "4.2","L", "5.2", "6.2", "L", "7.2", "8.2", ";"]
        const arrays = [array1, array2, array3]

        const pattern = getPatternFromPaths(arrays)

        expect(pattern.length).toBe(2)
        console.log(pattern[0])
        console.log(pattern[1])
        expect(pattern[0].toString()).toBe("M,1.10,2.10,L,3.10,4.10,;")
        expect(pattern[1].toString()).toBe("M,-0.90,-1.90,L,-2.90,-3.90,L,5.20,6.20,L,7.20,8.20,;")
    })

    it("Gets pattern from a series of paths, only one array element", function() {
        const array1 = ["1", "2", "3"]
        const arrays = [array1]

        const pattern = getPatternFromPaths(arrays)

        expect(pattern.length).toBe(1)
        expect(pattern[0].toString()).toBe("1,2,3")
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

    if (array1 === undefined) return array2

    for (let i=0; i<length; i++) {
        const e1 = array1[i]
        const e2 = array2[i]

        const e1ToNumber = Number(e1)
        const e2ToNumber = Number(e2)

        if (isNaN(e2ToNumber)) {
            result[i] = e2
        } else if (e1 == undefined) {
            result[i] = e2ToNumber.toFixed(2)
        } else {
            result[i] = (e2ToNumber - e1ToNumber).toFixed(2).toString()
        }
    }

    return result
}

function getPatternFromPaths(arrays) {
    if (arrays.length < 2) return [arrays]

    let resultArrays = []

    for (let i=1; i<arrays.length; i++) {
        resultArrays.push(getDiffBetween(arrays[i-1], arrays[i]))
    }

    return resultArrays
}