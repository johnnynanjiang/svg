describe("Test cases for SVG", function() {
    it("Parses <path d='...'> to path", function() {
        const d = "M1.0 2.0L3.0 4.0L5.0 6.0Z;"

        const path = getPathFromD(d)

        expect(path.toString()).toBe("M,1.0,2.0,L,3.0,4.0,L,5.0,6.0,Z,;")
    })

    it("Gets diff between two paths in the same size, A = B", function() {
        const path1 = ["M", "1.0", "2.0", "L", "3.0", "4.0", "L", "5.0", "6.0", ";"]
        const path2 = ["M", "2.0", "4.0", "L", "6.0", "8.0", "L", "10.0", "12.0", ";"]

        const diff = getDiffBetweenPaths(path1, path2)

        expect(diff.toString()).toBe("M,1.00,2.00,L,3.00,4.00,L,5.00,6.00,;")
    })

    it("Gets diff between two paths in different size, A < B", function() {
        const path1 = ["M", "1.0", "2.0", "L", "3.0", "4.0", ";"]
        const path2 = ["M", "2.0", "4.0", "L", "6.0", "8.0", "L", "10", "12", ";"]

        const diff = getDiffBetweenPaths(path1, path2)

        expect(diff.toString()).toBe("M,1.00,2.00,L,3.00,4.00,L,10.00,12.00,;")
    })

    it("Gets diff between two paths in different size, A > B", function() {
        const path1 = ["M", "1.0", "2.0", "L", "3.0", "4.0","L", "5.0", "6.0", ";"]
        const path2 = ["M", "2.0", "4.0", "L", "6.0", "8.0",";"]

        const diff = getDiffBetweenPaths(path1, path2)

        expect(diff.toString()).toBe("M,1.00,2.00,L,3.00,4.00,;")
    })

    it("Gets diff between two paths in different size, A is empty", function() {
        const path1 = []
        const path2 = ["M", "2.0", "4.0", "L", "6.0", "8.0",";"]

        const diff = getDiffBetweenPaths(path1, path2)

        expect(diff.toString()).toBe("M,2.00,4.00,L,6.00,8.00,;")
    })

    it("Gets pattern from a series of paths", function() {
        const path1 = ["M", "1.0", "2.0", "L", "3.0", "4.0","L", "5.0", "6.0", ";"]
        const path2 = ["M", "2.1", "4.1", "L", "6.1", "8.1",";"]
        const path3 = ["M", "1.2", "2.2", "L", "3.2", "4.2","L", "5.2", "6.2", "L", "7.2", "8.2", ";"]
        const paths = [path1, path2, path3]

        const pattern = getPatternFromPaths(paths)

        expect(pattern.length).toBe(2)
        console.log(pattern[0])
        console.log(pattern[1])
        expect(pattern[0].toString()).toBe("M,1.10,2.10,L,3.10,4.10,;")
        expect(pattern[1].toString()).toBe("M,-0.90,-1.90,L,-2.90,-3.90,L,5.20,6.20,L,7.20,8.20,;")
    })

    it("Gets pattern from a series of paths of only one path", function() {
        const path1 = ["1", "2", "3"]
        const paths = [path1]

        const pattern = getPatternFromPaths(paths)

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
function getPathFromD(d) {
    return d.split(" ")
        .flatMap(e => e.split(/(M)/g))
        .flatMap(e => e.split(/(L)/g))
        .flatMap(e => e.split(/(Z)/g))
        .flatMap(e => e.split(/(;)/g))
        .filter(e => e != '')
}

function getDiffBetweenPaths(path1, path2) {
    const length = path2.length
    const result = [length]

    if (path1 === undefined) return path2

    for (let i=0; i<length; i++) {
        const e1 = path1[i]
        const e2 = path2[i]

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

function getPatternFromPaths(paths) {
    if (paths.length < 2) return [paths]

    let resultArrays = []

    for (let i=1; i<paths.length; i++) {
        resultArrays.push(getDiffBetweenPaths(paths[i-1], paths[i]))
    }

    return resultArrays
}

function applyPatternToPath(pattern, path) {

}