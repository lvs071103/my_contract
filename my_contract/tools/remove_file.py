import os


def remove(filePath):
    """_summary_
    Args:
        filePath (_type_): 移除指定的文件
    """
    if os.path.exists(filePath):
        os.remove(filePath)
    else:
        print("Can't not delete the file as it doesn't exists")
