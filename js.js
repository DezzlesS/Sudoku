import { boxesSchem, collectRevealedCells, digits, gridPattern, findBox } from "./constants.js";

const { random, floor, round } = Math;

function domAssemble(main) {
    this.field = $('#field');
    this.cells = $('.cell')
        .attr('data-index', i => i)
        .on('mousedown', (e) => { main.cellClick(e) })
        .toArray()
    ;
    this.rows = [...$('.row')].map(row => [...row.children]);

    this.columns = [...Array(9)].map((_,i) => this.rows.map(row => row[i]));

    this.boxes = boxesSchem.map(([
        [col1,col2],
        [row1,row2]
    ]) => this.cells.filter(({dataset}) => (
            (dataset.col >= col1 && dataset.col <= col2) &&
            (dataset.row >= row1 && dataset.row <= row2)
        ))
    );

    $('#newGame').on('click', main.startNewGame.bind(main));

    $(document).on('keydown', ({key}) => {
        switch (key) {
            case 'Backspace': main.cellClear()   ; break;
            default         : main.cellInput(key); break;
        }
    })
}

class Sudoku {
    constructor() {
        Object.assign(this, new domAssemble(this))
        this.gridCount = 0;

        this.startNewGame();

        console.log(this.gridCount);
    }


    cellClick({target}) {
        if (
            this.target?.data('index') ==
            target.dataset.index
        ) return;

        this.removeAdjacentsHighlight();
        this.target = $(target);
        this.targetCoordinates = this.getTargetCoordinates();
        this.setAdjacentsHighlight();
        
        this.removeSimilarsHighlight();
        if (target.innerText) {
            this.pickedDigit = target.innerText;
            this.setSimilarsHighlight();
        }
    }

    cellInput(key) {
        if (
            !this.target?.attr('input') ||
            this.target?.text() === key ||
            !/[0-9]/.test(key)
        ) return;
        
        this.target.text(key);

        this.removeSimilar();
        this.lastInput = key;
        
        this.addToPlayGrid();

        this.addSimilar();
        this.removeSimilarsHighlight();
        this.setSimilarsHighlight();


        this.completeCheck();
    }

    cellClear() {
        if (
            !this.target.attr('input') ||
            !this.target.text()
        ) return;

        
        this.target.text('');
        this.removeSimilar();
        this.removeSimilarsHighlight();
        
        this.deleteFromPlayGrid();
    }

    setAdjacentsHighlight(
        [col, row] = this.targetCoordinates
    ) {
        this.highlightItems = $([
            ...this.columns[col],
            ...this.rows[row],
            ...this.boxes[findBox(col+1, row+1)]
        ]).addClass('--adjacent');

        this.target
            .removeClass('--adjacent')
            .addClass('--active')
        ;
    }
    removeAdjacentsHighlight() {
        this.highlightItems?.removeClass('--adjacent');
        this.target?.removeClass('--active');
    }


    setSimilarsHighlight() {
        this.similars = $([...this.revealedCells[this.pickedDigit]]);
        this.similars.addClass('--similar');
    }
    removeSimilarsHighlight() {
        this.similars?.removeClass('--similar');
        this.similars = $();
    }


    addSimilar() {
        this.pickedDigit = this.lastInput;
        this.revealedCells[this.pickedDigit].add(this.target[0]);
    }
    removeSimilar() {
        this.revealedCells[this.lastInput]?.delete(this.target[0]);
        this.target.removeClass('--similar');
    }



    generateGrid() {
        do {
            this.correctGrid = this.generate();
            this.gridCount++;
        }
        while (this.correctGrid === undefined);
        
        this.correctValues = this.correctGrid.flat();
    }
    generatePlayGrid() {
        this.displayValues = this.correctValues.map(
            v => round(random())
                ? v
                : ''
        );
        this.playGrid = [...Array(9)].map((_,i) => this.displayValues.slice(i*9, i*9+9));
    }
    displayGrid() {
        this.cells.forEach((cell, i) => {
            cell.InnerText = this.displayValues[i];
        });
        this.displayValues.forEach((v, i) => {
            if (v) this.cells[i].innerText = v;
            else   this.cells[i].setAttribute('input', true)
        });
        
        this.revealedCells = collectRevealedCells(this.cells);
    }
    generate() {
        const grid = gridPattern();

        for (const digit of digits) {
            const 
                columns = [],
                rows = []
            ;
            for (const box of this.boxes) {
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
                if (!randomCell) return;
                
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

    addToPlayGrid() {
        const [col, row] = this.targetCoordinates;

        this.playGrid[row][col] = this.lastInput;
    }
    deleteFromPlayGrid() {
        const [col, row] = this.targetCoordinates;

        this.playGrid[row][col] = '';
    }

    completeCheck() {
        this.puzzleCompleted = this.correctGrid.every((
            row1, i
        ) => row1.join() === this.playGrid[i].join());
        
        if (this.puzzleCompleted) this.endGame();
    }

    endGame() {
        this.resetGame();
        this.congratilations();
    }

    congratilations() {
        alert('Вы решили судоку. Примите поздравления от разработчика!');
    }

    
    resetGame() {
        $(document).off('keydown');
        $(this.cells)
    }
    

    startNewGame() {
        this.clearField();
        // this.reset();
        this.generateGrid();
        this.generatePlayGrid();
        this.displayGrid();
    }

    clearField() {
        $(this.cells)
            .text('')
            .removeAttr('input')
            .removeClass('--active --similar --adjacent')
        ;
    }


    getTargetCoordinates = () => [
        this.target.data('col') - 1,
        this.target.data('row') - 1
    ]
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


