from flask import Flask
from dokusan import generators
import numpy as np
app = Flask(__name__)
@app.route("/puzzle")
def puzzle():
    # Use your Python code to generate a random Sudoku puzzle
    arr = np.array(list(str(generators.random_sudoku(avg_rank=150))))
    puzzle = arr.reshape(9,9)
    puzzle = puzzle.tolist()
    puzzle = "\n".join(["".join(row) for row in puzzle])
    return puzzle

if __name__ == "__main__":
    app.run()

    
