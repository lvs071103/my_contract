import os


def remove(filePath):
    print(filePath)
    if os.path.exists(filePath):
        os.remove(filePath)
    else:
        print("Can't not delete the file as it doesn't exists")
