import math

def checkIfPrime (numberToCheck):
    for x in range(2, numberToCheck):
        if (numberToCheck%x == 0):
            return False
    return True

a=0

for i in range (1, 1000000):
    if checkIfPrime(i):
        a+=1
        print (a,i)



