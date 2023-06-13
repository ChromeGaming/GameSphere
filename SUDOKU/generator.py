from dokusan import generators
import numpy as np

def puzzle():
    # Use your Python code to generate a random Sudoku puzzle
    print("hi")
    arr = np.array(list(str(generators.random_sudoku(avg_rank=150))))
    print(arr)
    puzzle = arr.reshape(9,9)
    print(puzzle)
    
puzzle()