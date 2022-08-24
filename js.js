function assemble() {
    this.field = $('#field');
    this.rows = $('.row');
    this.boxes = $('.box');
    this.cells = $('.cell');
}
const {random, max, min, floor} = Math;

class Sudoku {
    constructor() {
        // Object.assign(this, assemble())
        this.grid = this.generateGrid();
    }

    generateField() {
        const generationOrder = [7,6,6,5,5,5,4,3,3];
        
        [1,2,3,4,5,6,7,8,9].forEach((n, i) => {
            
        })
    }

    generateGrid() {
        const digits = [1,2,3,4,5,6,7,8,9];
        const blankTemplate = () => Array(9).fill(0).map(() => []);
        let 
            columns = blankTemplate(),
            rows    = blankTemplate(),
            boxes   = blankTemplate()
        ;
        for (let y = 1; y < 9; y++) {
            let line = [];
            for (let x = 1; x < 9; x++) {
                let 
                    box = findBox(x, y),

                    deprecatedDigits = [...columns[x], ...rows[y], ...box],
                    allowedDigits = digits.filter(n => deprecatedDigits.some(_n => n === _n)) || digits,
                    nextDigit = getNextDigit(
                        min(...allowedDigits),
                        max(...allowedDigits)
                    )
                ;
                columns[x - 1].push(nextDigit);
                rows[y - 1].push(nextDigit);
                box.push(nextDigit);

                line.push(nextDigit)
            }
        }

        function getNextDigit(min, max) {
            return floor(random() * (max - min + 1)) + min
        }

        function findBox(x, y) {
            const index = 
                (x <=3 && y <= 3) ? 0 :
                (x <=6 && y <= 3) ? 1 :
                (x <=9 && y <= 3) ? 2 :
                (x <=3 && y <= 6) ? 3 :
                (x <=6 && y <= 6) ? 4 :
                (x <=9 && y <= 6) ? 5 :
                (x <=3 && y <= 9) ? 6 : 
                (x <=6 && y <= 9) ? 7 :
                                    8
            ;
            return boxes[index];
        }
    }
}


console.log(
    new Sudoku()
)





// generateGrid() {
    // const grid = [
    //     [1,2,3,4,5,6,7,8,9].sort(() => random() - 0.5) //first line
    // ];
    // let nextLine;
    // let count = 0;
    
    // for (let i = 0; i < 8; i++) {
    //     do {nextLine = getNextLine(); count++}
    //     while (incorrectLine());
    
    //     grid.push(nextLine);
    // }
    // console.log(count);
    // return grid;
    
    
    // function incorrectLine() {
    //     return grid.some(line => line.some((n, i) => n === nextLine[i]));
    //     // return nextLine.some((n, i) => n === firstLine[i])
    // }
    // function getNextLine() {
    //     return [1,2,3,4,5,6,7,8,9].sort(() => random() - 0.5)
    // }
// }