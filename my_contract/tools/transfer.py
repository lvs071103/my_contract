import argparse
import sys
import os
from xlrd import open_workbook
from xlrd.xldate import xldate_as_datetime
import random
from openpyxl import Workbook, load_workbook



# 终端打印，输出到文件
def write_file(filename, users, key):
    if not os.path.exists(filename):
        print("生成新的随机用户: ==========>")
        # 创建一个文件对象
        wb = Workbook()
        ws = wb.active
        ws.title = key
        ws['A1'] = key
        for each in users:
            print(each)
            ws.append([each])
        wb.save(filename)
    else:
        wb = load_workbook(filename)
        if key in wb.sheetnames:
            print(key, "将被更新: ========>")
            wb.remove(wb[key])
            wb.create_sheet(key)
            ws = wb[key]
            ws['A1'] = key
            for each in users:
                print(each)
                ws.append([each])
            wb.save(filename)
        else:
            print("新增: =========>", key)
            wb.create_sheet(key)
            ws = wb[key]
            ws['A1'] = key
            for each in users:
                print(each)
                ws.append([each])
            wb.save(filename)


def users_choice(users, num):
    return random.choices([*users], k=num)


def xls_to_dict_handler(xls_file):
    workbook = open_workbook(xls_file)
    worksheet = workbook.sheet_by_index(0)
    # 列名称数组
    keys = [
        worksheet.cell(0, col_index).value
        for col_index in range(worksheet.ncols)
    ]
    num_rows = worksheet.nrows
    num_cols = worksheet.ncols
    values = []
    # 行处理（0为标题行，从1开始处理）
    for row in range(1, num_rows):
        d = {}
        # 列处理（从0开始处理）
        for col in range(num_cols):
            if keys[col] == 'purchase_date' or \
                    keys[col] == 'scheduled_replacement_date' or \
                    keys[col] == 'discard_date':
                # 如果date字段的值为''则重新赋值为None, 如果值不为''，则将值转换成datetime的时间格式
                if worksheet.cell_value(row, col) == '':
                    datetime_ = None
                else:
                    datetime_ = xldate_as_datetime(
                        worksheet.cell_value(row, col), workbook.datemode)
                d[keys[col]] = datetime_
            else:
                d[keys[col]] = worksheet.cell_value(row, col)
        values.append(d)

    return values


def xls_to_list_handler(xls_file):
    workbook = open_workbook(xls_file)
    worksheet = workbook.sheet_by_index(0)
    # 列名称数组
    keys = [
        worksheet.cell(0, col_index).value
        for col_index in range(worksheet.ncols)
    ]
    num_rows = worksheet.nrows
    num_cols = worksheet.ncols
    random_list = list()
    for col in range(num_cols):
        tmpDct = {}
        # print("列：", col)
        subList = list()
        for row in range(num_rows):
            # print("行：", row)
            if worksheet.cell_value(row, col) == keys[col]:
                continue
            else:
                subList.append(worksheet.cell_value(row, col))
        tmpDct[keys[col]] = subList
        random_list.append(tmpDct)

    return random_list


if __name__ == '__main__':
    # print(len(sys.argv))
    parser = argparse.ArgumentParser(description="随机输出用户列表")
    parser.add_argument('-i', '--input', required=True, help="指定输入文件")
    parser.add_argument('-o', '--output', required=True, help="指定输出文件")
    parser.add_argument('-n', '--num', help="指定随机数量,默认10", default=10)
    args = parser.parse_args()
    
    if len(sys.argv) <= 4:
        parser.print_help()
    user_list = xls_to_list_handler(args.input)
    write_list = []

    for item in user_list:
        for k, v in item.items():
            choiced_users = users_choice(users=v, num=int(args.num))
            write_file(key=k,users=choiced_users, filename=args.output)