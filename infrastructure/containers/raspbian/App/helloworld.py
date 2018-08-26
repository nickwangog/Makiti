from tkinter import Tk, Label, Button
import random, math, sys

class Gooeey:
    def __init__(self, master):
        self.master = master
        master.title("A simple GUI")

        self.label = Label(master, text="Hello World!")
        self.label.pack()

        self.greet_button = Button(master, text="Hello, World!", command=self.greet)
        self.greet_button.pack()
        
        self.fish_button = Button(master, text="Print a Fish", command=self.printFish)
        self.fish_button.pack()
        
        self.dance_button = Button(master, text="Make Kirby Dance", command=self.printKirby)
        self.dance_button.pack()

        self.close_button = Button(master, text="Close", command=master.quit)
        self.close_button.pack()

    def greet(self):
        print("Greetings!")

    def printFish(self):
        print("><>")

    def printKirby(self):
        val = math.floor((random.random() * 100)) % 4;
        if val == 0:
            print("<(^_^<)", end="")
        elif val == 1:
            print("(>^_^)>", end="")
        elif val == 2:
            print("<(^__^)>", end="")
        elif val == 3:
            print("^(^_^)^", end="")
        sys.stdout.flush()

root = Tk()
my_gui = Gooeey(root)
root.mainloop()
