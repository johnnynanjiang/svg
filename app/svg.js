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

function getStepBetweenPaths(path1, path2) {
    return manipulateBetweenPaths(path1, path2, (p1, p2) => p2 - p1)
}

function getStepsFromPaths(steps) {
    if (isAnInvalidArray(steps)) return undefined

    if (steps.length < 2) return [steps]

    let resultArrays = []

    for (let i=1; i<steps.length; i++) {
        resultArrays.push(getStepBetweenPaths(steps[i-1], steps[i]))
    }

    return resultArrays
}

function getNewPathByApplyingStepToPath(step, path) {
    let newPath = manipulateBetweenPaths(path, step, (p, s) => p + s)
    newPath.push(";")

    return newPath
}

function getNewPathsByApplyingStepsToPath(steps, path) {
    if (isAnInvalidArray(steps) || isAnInvalidArray(path)) return undefined

    path.push(";")
    let newPaths = [path]

    for (let i=0; i<steps.length; i++) {
        newPaths.push(getNewPathByApplyingStepToPath(steps[i], newPaths[newPaths.length - 1]))
    }

    return newPaths
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

function getStepsFromAnimation(animation) {
    const paths = getPathsFromAnimation(animation)
    const steps = getStepsFromPaths(paths)

    return steps
}

function getAnimationFromSteps(steps) {
    if (isAnInvalidArray(steps)) return undefined

    let animation = ""

    for (let i=0; i<steps.length; i++) {
        animation += steps[i].join(" ")
    }

    return animation
}

module.exports = {
    getPathFromD: getPathFromD,
    getStepBetweenPaths: getStepBetweenPaths,
    getStepsFromPaths: getStepsFromPaths,
    getNewPathByApplyingStepToPath: getNewPathByApplyingStepToPath,
    getNewPathsByApplyingStepsToPath: getNewPathsByApplyingStepsToPath,
    getPathsFromAnimation: getPathsFromAnimation,
    getStepsFromAnimation: getStepsFromAnimation,
    getAnimationFromSteps: getAnimationFromSteps
}