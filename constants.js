export const
    boxesSchem = [
        [[1,3],[1,3]], [[4,6],[1,3]], [[7,9],[1,3]],
        [[1,3],[4,6]], [[4,6],[4,6]], [[7,9],[4,6]],
        [[1,3],[7,9]], [[4,6],[7,9]], [[7,9],[7,9]]
    ],
    findBox = (x, y) => (
        (x <=3 && y <= 3) ? 0 :
        (x <=6 && y <= 3) ? 1 :
        (x <=9 && y <= 3) ? 2 :
        (x <=3 && y <= 6) ? 3 :
        (x <=6 && y <= 6) ? 4 :
        (x <=9 && y <= 6) ? 5 :
        (x <=3 && y <= 9) ? 6 : 
        (x <=6 && y <= 9) ? 7 :
                            8
    ),
    digits = [1,2,3,4,5,6,7,8,9],
    gridPattern = () => [...Array(9)].map(() => Array(9).fill(0))
;

export function collectRevealedCells(cells) {
    const pattern = Object.fromEntries(
        [1,2,3,4,5,6,7,8,9].map(d => [d, new Set()])
    )

    cells.forEach(cell => {
        const digit = cell.innerText;
        if (digit) pattern[digit].add(cell)
    });
    return pattern;
}