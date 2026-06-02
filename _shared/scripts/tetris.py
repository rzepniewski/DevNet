import pygame
import random

# Inicjalizacja pygame
pygame.init()

# Ustawienia gry
width, height = 300, 600
block_size = 30
columns = width // block_size
rows = height // block_size

# Definicja kolorów
colors = [
    (0, 0, 0),
    (255, 0, 0),
    (0, 255, 0),
    (0, 0, 255),
    (255, 255, 0),
    (255, 165, 0),
    (128, 0, 128),
    (0, 255, 255),
]

# Definicja kształtów
shapes = [
    [[1, 1, 1],
     [0, 1, 0]],
    [[0, 2, 2],
     [2, 2, 0]],
    [[3, 3, 0],
     [0, 3, 3]],
    [[4, 0, 0],
     [4, 4, 4]],
    [[0, 0, 5],
     [5, 5, 5]],
    [[6, 6, 6, 6]],
    [[7, 7],
     [7, 7]]
]

# Klasa Tetromino
class Tetromino:
    def __init__(self):
        self.x = columns // 2
        self.y = 0
        self.shape = random.choice(shapes)
        self.color = shapes.index(self.shape) + 1

    def rotate(self):
        self.shape = [list(row) for row in zip(*self.shape[::-1])]

# Funkcje gry
def check_collision(grid, shape, offset):
    off_x, off_y = offset
    for y, row in enumerate(shape):
        for x, cell in enumerate(row):
            try:
                if cell and grid[y + off_y][x + off_x]:
                    return True
            except IndexError:
                return True
    return False

def remove_line(grid, row):
    del grid[row]
    return [[0 for _ in range(columns)]] + grid

def join_matrixes(grid, shape, offset):
    off_x, off_y = offset
    for y, row in enumerate(shape):
        for x, value in enumerate(row):
            if value:
                grid[y + off_y][x + off_x] = value
    return grid

def new_board():
    return [[0 for _ in range(columns)] for _ in range(rows)]

# Inicjalizacja planszy
grid = new_board()

# Ustawienia wyświetlania
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("Tetris")

clock = pygame.time.Clock()
fps = 25

# Rozpoczęcie gry
current_tetromino = Tetromino()
running = True

while running:
    grid = join_matrixes(grid, current_tetromino.shape, (current_tetromino.x, current_tetromino.y))
    current_tetromino = Tetromino()
    
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_LEFT:
                current_tetromino.x -= 1
                if check_collision(grid, current_tetromino.shape, (current_tetromino.x, current_tetromino.y)):
                    current_tetromino.x += 1
            if event.key == pygame.K_RIGHT:
                current_tetromino.x += 1
                if check_collision(grid, current_tetromino.shape, (current_tetromino.x, current_tetromino.y)):
                    current_tetromino.x -= 1
            if event.key == pygame.K_DOWN:
                current_tetromino.y += 1
                if check_collision(grid, current_tetromino.shape, (current_tetromino.x, current_tetromino.y)):
                    current_tetromino.y -= 1
            if event.key == pygame.K_UP:
                current_tetromino.rotate()
                if check_collision(grid, current_tetromino.shape, (current_tetromino.x, current_tetromino.y)):
                    current_tetromino.rotate()
                    current_tetromino.rotate()
                    current_tetromino.rotate()

    current_tetromino.y += 1
    if check_collision(grid, current_tetromino.shape, (current_tetromino.x, current_tetromino.y)):
        current_tetromino.y -= 1
        grid = join_matrixes(grid, current_tetromino.shape, (current_tetromino.x, current_tetromino.y))
        while check_collision(grid, current_tetromino.shape, (current_tetromino.x, current_tetromino.y)):
            grid = remove_line(grid, current_tetromino.y)
    
    # Renderowanie planszy
    screen.fill((0, 0, 0))
    for y in range(rows):
        for x in range(columns):
            if grid[y][x]:
                pygame.draw.rect(screen, colors[grid[y][x]], (x * block_size, y * block_size, block_size, block_size))

    pygame.display.flip()
    clock.tick(fps)

pygame.quit()
