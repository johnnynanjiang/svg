const svg = require('../app/svg.js')
const utils = require('../app/utils.js')

describe("Test cases for SVG", function() {
    it("Gets path from <path d='...'>", function() {
        const d = "M1.0 2.0L3.0 4.0L5.0 6.0 a-7 -8 b-9 -10Z;"

        const path = svg.getPathFromD(d)

        expect(path.toString()).toBe("M,1.0,2.0,L,3.0,4.0,L,5.0,6.0,a,-7,-8,b,-9,-10,Z,;")
    })

    it("Gets step between two paths in the same size, A = B", function() {
        const path1 = ["M", "1.0", "2.0", "L", "3.0", "4.0", "L", "5.0", "6.0", ";"]
        const path2 = ["M", "2.0", "4.0", "L", "6.0", "8.0", "L", "10.0", "12.0", ";"]

        const step = svg.getStepBetweenPaths(path1, path2)

        expect(step.toString()).toBe("M,1.00,2.00,L,3.00,4.00,L,5.00,6.00,;")
    })

    it("Gets step between two paths in different size, A < B", function() {
        const path1 = ["M", "1.0", "2.0", "L", "3.0", "4.0", ";"]
        const path2 = ["M", "2.0", "4.0", "L", "6.0", "8.0", "L", "10", "12", ";"]

        const step = svg.getStepBetweenPaths(path1, path2)

        expect(step.toString()).toBe("M,1.00,2.00,L,3.00,4.00,L,10.00,12.00,;")
    })

    it("Gets step between two paths in different size, A > B", function() {
        const path1 = ["M", "1.0", "2.0", "L", "3.0", "4.0","L", "5.0", "6.0", ";"]
        const path2 = ["M", "2.0", "4.0", "L", "6.0", "8.0",";"]

        const step = svg.getStepBetweenPaths(path1, path2)

        expect(step.toString()).toBe("M,1.00,2.00,L,3.00,4.00,;")
    })

    it("Gets step between two paths in different size, A is empty", function() {
        const path1 = []
        const path2 = ["M", "2.0", "4.0", "L", "6.0", "8.0",";"]

        const step = svg.getStepBetweenPaths(path1, path2)

        expect(step.toString()).toBe("M,2.00,4.00,L,6.00,8.00,;")
    })

    it("Gets steps from a series of paths", function() {
        const path1 = ["M", "1.0", "2.0", "L", "3.0", "4.0","L", "5.0", "6.0", ";"]
        const path2 = ["M", "2.1", "4.1", "L", "6.1", "8.1",";"]
        const path3 = ["M", "1.2", "2.2", "L", "3.2", "4.2","L", "5.2", "6.2", "L", "7.2", "8.2", ";"]
        const paths = [path1, path2, path3]

        const steps = svg.getStepsFromPaths(paths)

        expect(steps.length).toBe(2)
        expect(steps[0].toString()).toBe("M,1.10,2.10,L,3.10,4.10,;")
        expect(steps[1].toString()).toBe("M,-0.90,-1.90,L,-2.90,-3.90,L,5.20,6.20,L,7.20,8.20,;")
    })

    it("Gets steps from a series of paths of only one path", function() {
        const path1 = ["1", "2", "3"]
        const paths = [path1]

        const steps = svg.getStepsFromPaths(paths)

        expect(steps.length).toBe(1)
        expect(steps[0].toString()).toBe("1,2,3")
    })

    it("Gets new path by applying step to path, step = path in size", function() {
        const step = ["M", "10.0", "20.0", "L", "30.0", "40.0", "L", "50.0", "60.0"]
        const path = ["M", "10.0", "20.0", "L", "30.0", "40.0","L", "50.0", "60.0"]

        const newPath = svg.getNewPathByApplyingStepToPath(step, path)

        expect(newPath.toString()).toBe("M,20.00,40.00,L,60.00,80.00,L,100.00,120.00,;")
    })

    it("Gets new path by applying step to path, step = path in size", function() {
        const step = ["M", "10.0", "20.0", "L", "30.0", "40.0", "L", "50.0", "60.0"]
        const path = ["M", "10.0", "20.0", "L", "30.0", "40.0","L", "50.0", "60.0"]

        const newPath = svg.getNewPathByApplyingStepToPath(step, path)

        expect(newPath.toString()).toBe("M,20.00,40.00,L,60.00,80.00,L,100.00,120.00,;")
    })

    it("Gets new path by applying step to path, step = path in size, and has negative values", function() {
        const step = ["M", "10.0", "20.0"]
        const path = ["M", "-10.0", "-20.0"]

        const newPath = svg.getNewPathByApplyingStepToPath(step, path)

        expect(newPath.toString()).toBe("M,0.00,0.00,;")
    })

    it("Gets new path by applying step to path, step > path in size", function() {
        const step = ["M", "10.0", "20.0", "L", "30.0", "40.0", "L", "50.0", "60.0"]
        const path = ["M", "10.0", "20.0", "L", "30.0", "40.0","L"]

        const newPath = svg.getNewPathByApplyingStepToPath(step, path)

        expect(newPath.toString()).toBe("M,20.00,40.00,L,60.00,80.00,L,50.00,60.00,;")
    })

    it("Gets new path by applying step to path, step < path in size", function() {
        const step = ["M", "10.0", "20.0", "L", "30.0", "40.0", "L"]
        const path = ["M", "10.0", "20.0", "L", "30.0", "40.0","L", "50.0", "60.0"]

        const newPath = svg.getNewPathByApplyingStepToPath(step, path)

        expect(newPath.toString()).toBe("M,20.00,40.00,L,60.00,80.00,L,;")
    })

    it("Gets new paths by applying steps to path", function() {
        const path = ["M", "10.0", "20.0", "L", "30.0", "40.0","L", "50.0", "60.0"]
        const steps = [
            ["M", "10.0", "20.0", "L", "30.0", "40.0", "L", "50.0", "60.0"],
            ["M", "20.0", "40.0", "L", "60.0", "80.0", "L", "100.0", "120.0"]
        ]

        const newPaths = svg.getNewPathsByApplyingStepsToPath(steps, path)

        expect(newPaths.length).toBe(3)
        expect(newPaths[0].toString()).toBe("M,10.0,20.0,L,30.0,40.0,L,50.0,60.0,;")
        expect(newPaths[1].toString()).toBe("M,20.00,40.00,L,60.00,80.00,L,100.00,120.00,;")
        expect(newPaths[2].toString()).toBe("M,40.00,80.00,L,120.00,160.00,L,200.00,240.00,;")
    })

    it("Gets paths from animation", function() {
        const animation = "M1 2 c3 4 l5 6z; M7 8 c-9 -10z;"

        const paths = svg.getPathsFromAnimation(animation)

        expect(paths.length).toBe(2)
        expect(paths[0].toString()).toBe("M,1,2,c,3,4,l,5,6,z")
        expect(paths[1].toString()).toBe("M,7,8,c,-9,-10,z")
    })

    it("Gets steps from animation", function() {
        const animation = "M1 2 c3 4 l5 6z; M7 8 c-9 -10z;"

        const steps = svg.getStepsFromAnimation(animation)

        expect(steps.length).toBe(1)
        expect(steps[0].toString()).toBe("M,6.00,6.00,c,-12.00,-14.00,z")
    })

    it("Gets animation from steps", function() {
        const steps = [
            ["M", "10.0", "20.0", "L", "30.0", "40.0", ";"],
            ["M", "20.0", "40.0", "L", "60.0", "80.0", ";"]
        ]

        const animation = svg.getAnimationFromSteps(steps)

        expect(animation).toBe("M 10.0 20.0 L 30.0 40.0 ;M 20.0 40.0 L 60.0 80.0 ;")
    })
})