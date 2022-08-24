import { boxesSchem, digits, emptyGrid } from "./constants.js";

const { random, floor } = Math;

function domAssemble(main) {
    this.field = $('#field');
    this.cells = $('.cell')
        .attr('data-index', i => i)
        .on('mousedown', (e) => main.cellClick(e))
    ;
    this.rows = [...$('.row')].map(row => [...row.children]);

    this.columns = [...Array(9)].map((_,i) => this.rows.map(row => row[i]));

    this.boxes = boxesSchem.map(([
        [col1,col2],
        [row1,row2]
    ]) => [...this.cells].filter(({dataset}) => (
            (dataset.col >= col1 && dataset.col <= col2) &&
            (dataset.row >= row1 && dataset.row <= row2)
        ))
    );
}

class Sudoku {
    constructor() {
        Object.assign(this, new domAssemble(this))
        this.gridCount = 0;

        do this.grid = this.generateGrid()
        while (this.grid === undefined);

        this.values = this.grid.flat();
        this.hideDigits();
        this.displayGrid();
        console.log(this.gridCount);


        $(document).on('keydown', ({ key }) => {
            if (/[0-9]/.test(key)) this.digitInput(key);
        })
    }

    sameDigitsHighlight() {

    }

    findBox(x, y) {
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
        return this.boxes[index];
    }

    digitInput(key) {
        this.target.text(key)
    }

    cellClick({target}) {
        this.removeCellHighlight();
        this.target = $(target);
        const col = this.target.data('col') - 1,
              row = this.target.data('row') - 1
        ;
        this.setCellHighlight(col, row);

        if (target.innerText) sameDigitsHighlight(col, row);
    }

    removeCellHighlight() {
        this.highlightItems?.removeClass('--adjacent');
        this.target?.removeClass('--active');
    }


    setCellHighlight(col, row) {
        this.highlightItems = $([
            ...this.findBox(col+1, row+1),
            ...this.columns[col],
            ...this.rows[row]
        ]).addClass('--adjacent')

        this.target
            .removeClass('--adjacent')
            .addClass('--active')
        ;
    }


    hideDigits() {
        const { length } = this.values;
        const indexes = [...Array(length)]
            .map((_,i) => i)
            .sort(() => random() - 0.5)
            .slice(length / 2)
        ;
        this.displayValues = this.values;
        indexes.forEach(v => this.values[v] = '');
    }
    

    displayGrid() {
        this.cells.text(i => this.displayValues[i])
    }

    generateGrid() {
        const grid = emptyGrid();
        const { boxes } = this;

        for (const digit of digits) {
            const 
                columns = [],
                rows = []
            ;
            for (const box of boxes) {
                const 
                    affordableCells = box.filter(({dataset}) => {
                        const
                            col = dataset.col - 1,
                            row = dataset.row - 1
                        ;
                        return (
                            !columns.includes(col) &&
                            !rows.includes(row) &&
                            !grid[row][col]
                        )
                    }),

                    randomCell = pickRandomCell(affordableCells)
                ;
                if (!randomCell) { this.gridCount++; return };
                
                const
                    col = randomCell.dataset.col - 1,
                    row = randomCell.dataset.row - 1
                ;
                columns.push(col);
                rows.push(row);
                    
                grid[row][col] = digit;
            };
        };

        return grid;

        function pickRandomCell(affordable) {
            const 
                max = affordable.length,
                index = floor(random() * max)
            ;
            return affordable[index];
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



    
    // generateGrid() {
    //     const digits = '123456789';
    //     const blankSet = () => Array(9).fill(0).map(() => new Set());
    //     let 
    //         columns = blankSet(),
    //         rows    = blankSet(),
    //         boxes   = blankSet(),
    //         grid    = []
    //     ;
    //     for (let y = 0; y < 9; y++) {
    //         let line = [];
    //         for (let x = 0; x < 9; x++) {
    //             let 
    //                 box = findBox(x + 1, y + 1),

    //                 deprecatedDigits = [...new Set([
    //                     ...columns[x],
    //                     ...rows[y],
    //                     ...box])
    //                 ].join('|'),
    //                 allowedDigits = digits.replace(RegExp(deprecatedDigits, 'g'), ''),
    //                 nextDigit = getNextDigit(allowedDigits)
    //             ;
    //             if (!nextDigit) { this.gridCount++; return }

    //             rows[y].add(nextDigit);
    //             columns[x].add(nextDigit);
    //             box.add(nextDigit);

    //             line.push(nextDigit)
    //         }
    //         grid.push(line)
    //     }
    //     return grid;

    //     function getNextDigit(allowed) {
    //         const 
    //             max = allowed.length,
    //             index = floor(random() * max)
    //         ;
    //         // if (allowed[index] === undefined) debugger
    //         return +allowed[index]
    //     }

    //     function findBox(x, y) {
    //         const index = 
    //             (x <=3 && y <= 3) ? 0 :
    //             (x <=6 && y <= 3) ? 1 :
    //             (x <=9 && y <= 3) ? 2 :
    //             (x <=3 && y <= 6) ? 3 :
    //             (x <=6 && y <= 6) ? 4 :
    //             (x <=9 && y <= 6) ? 5 :
    //             (x <=3 && y <= 9) ? 6 : 
    //             (x <=6 && y <= 9) ? 7 :
    //                                 8
    //         ;
    //         return boxes[index];
    //     }
    // }


