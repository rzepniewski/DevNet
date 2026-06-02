import tkinter as tk
import random

# Ustawienia gry
canvas_width = 400
canvas_height = 400
egg_width = 30
egg_height = 45
egg_speed = 5
catcher_width = 100
catcher_height = 20

# Inicjalizacja głównego okna
root = tk.Tk()
root.title("Jajeczka")

# Tworzenie płótna
canvas = tk.Canvas(root, width=canvas_width, height=canvas_height, background='lightblue')
canvas.pack()

# Tworzenie łapacza
catcher = canvas.create_rectangle(canvas_width/2 - catcher_width/2, canvas_height - catcher_height,
                                  canvas_width/2 + catcher_width/2, canvas_height, fill='blue')

# Funkcja do poruszania łapaczem
def move_left(event):
    x1, y1, x2, y2 = canvas.coords(catcher)
    if x1 > 0:
        canvas.move(catcher, -20, 0)

def move_right(event):
    x1, y1, x2, y2 = canvas.coords(catcher)
    if x2 < canvas_width:
        canvas.move(catcher, 20, 0)

# Łączenie klawiszy z funkcjami
canvas.bind('<Left>', move_left)
canvas.bind('<Right>', move_right)
canvas.focus_set()

# Funkcja do tworzenia i poruszania jajkami
eggs = []

def create_egg():
    x = random.randint(10, canvas_width - egg_width)
    egg = canvas.create_oval(x, 0, x + egg_width, egg_height, fill='yellow')
    eggs.append(egg)
    root.after(2000, create_egg)

def move_eggs():
    for egg in eggs:
        canvas.move(egg, 0, egg_speed)
        x1, y1, x2, y2 = canvas.coords(egg)
        if y2 > canvas_height:
            canvas.delete(egg)
            eggs.remove(egg)
        elif catcher_collision(x1, y1, x2, y2):
            canvas.delete(egg)
            eggs.remove(egg)
    root.after(50, move_eggs)

def catcher_collision(x1, y1, x2, y2):
    catcher_x1, catcher_y1, catcher_x2, catcher_y2 = canvas.coords(catcher)
    return catcher_x1 < x2 and catcher_x2 > x1 and catcher_y1 < y2 and catcher_y2 > y1

# Uruchamianie gry
create_egg()
move_eggs()
root.mainloop()
