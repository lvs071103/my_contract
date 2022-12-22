#!/usr/bin/env python3.8

import datetime


def statistic_sum(statistics):
    return_l = []
    for item in statistics:
        for k in item.keys():
            # 遍历key
            s = []
            for d in statistics:
                # 如果key在新的遍历中出现添加到一个列表中
                if k in d.keys():
                    s.append(d[k])
                else:
                    continue
            # 以k为键，将v的sum值 添加到返回列表中
            if {k: sum(s)} not in return_l:
                return_l.append({k: sum(s)})

    return return_l


def format_data(origin_l, o_type):
    data = []
    current_year = datetime.datetime.now().strftime("%Y")

    for m in range(1, 13):
        if m < 10:
            m = '0{}'.format(m)

        d = {
            '价格': 0,
            'name': o_type,
            '月份': str(m)
        }

        current_date = '{}-{}'.format(current_year, m)

        for item in origin_l:
            for k, v in item.items():
                if k == current_date:
                    d.update({'价格': v, 'name': o_type, '月份': str(m)})

        data.append(d)

    return data


if __name__ == '__main__':
    ll = [{'2022-12': 681212}, {'2022-10': 131313}, {'2022-06': 33333333}]
    print(format_data(ll, '合同'))
