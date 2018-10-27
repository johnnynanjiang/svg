/* Functionality */

function manipulateBetweenPaths(path1, path2, operator) {
    const length = path2.length
    const result = [length]

    if (isAnInvalidArray(path2)) return undefined
    if (isAnInvalidArray(path1)) return path2

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
            result[i] = operator(e1ToNumber, e2ToNumber).toFixed(2).toString()
        }
    }

    return result
}

function isNull(v) {
    return (v) ? false : true
}

function isArray(v) {
    return v.constructor === Array
}

function isAnInvalidArray(v) {
    return isNull(v) || !isArray(v)
}

/* Exported Functions */

function getPathFromD(d) {
    return d.split(" ")
        .flatMap(e => e.split(/([a-zA-Z;])/g))
        .filter(e => e.trim() != '')
}

function getDiffBetweenPaths(path1, path2) {
    return manipulateBetweenPaths(path1, path2, (p1, p2) => p2 - p1)
}

function getPatternFromPaths(paths) {
    if (isAnInvalidArray(paths)) return undefined

    if (paths.length < 2) return [paths]

    let resultArrays = []

    for (let i=1; i<paths.length; i++) {
        resultArrays.push(getDiffBetweenPaths(paths[i-1], paths[i]))
    }

    return resultArrays
}

function applyStepToPath(step, path) {
    let newPath = manipulateBetweenPaths(path, step, (p, s) => p + s)
    newPath.push(";")

    return newPath
}

function applyPatternToPath(pattern, path) {
    if (isAnInvalidArray(pattern) || isAnInvalidArray(path)) return undefined

    let results = [path]

    for (let i=0; i<pattern.length; i++) {
        results[i] = applyStepToPath(pattern[i], results[results.length - 1])
    }

    return results
}

function getPathsFromAnimation(animation) {
    let pathStrings = animation.split(";")
    let paths = []

    if (isAnInvalidArray(pathStrings)) return undefined

    for (let i=0; i<pathStrings.length-1; i++) {
        let path = pathStrings[i]
            .split(/([a-zA-Z ])/g)
            .filter(e => e.trim() != '')

        paths.push(path)
    }

    return paths
}

module.exports = {
    getPathFromD: getPathFromD,
    getDiffBetweenPaths: getDiffBetweenPaths,
    getPatternFromPaths: getPatternFromPaths,
    applyStepToPath: applyStepToPath,
    applyPatternToPath: applyPatternToPath,
    getPathsFromAnimation: getPathsFromAnimation
}