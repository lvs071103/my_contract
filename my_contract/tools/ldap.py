from ldap3 import Server, Connection, NTLM, ALL
import datetime

ldap_user = 'dashbrands.local\\dm.admin'
ldap_pass = '#nVv5a#RRDFI'


def ldap_authentication(username, password):
    server = Server('172.19.1.2', port=389, get_info=ALL)
    try:
        # 管理员帐号连接验证
        Connection(
            server,
            user='dashbrands.local\\{}'.format(username),
            password=password,
            auto_bind=True,  # 开启自动bind
            # 此身份验证方法特定于 Active Directory，并使用名为 SICILY 的专有身份验证协议，
            # 该协议破坏了 LDAP RFC，但可用于访问 AD。
            authentication=NTLM)
        return True
    except Exception as e:
        print('LDAP Bind Failed: ', e)
        return False


def ldap_auth(username, password):
    """
    在 ldap3 中，您使用 Connection 对象的 open() 方法建立与服务器的连接。如果尚未打开，则 bind() 方法将打开连接。
    :param username:
    :param password:
    :return:
    """

    data = {}
    server = Server('172.19.1.2', port=389, get_info=ALL)
    try:
        # 管理员帐号连接验证
        conn = Connection(
            server,
            user='dashbrands.local\\{}'.format(username),
            password=password,
            auto_bind=True,  # 开启自动bind
            # 此身份验证方法特定于 Active Directory，并使用名为 SICILY 的专有身份验证协议，
            # 该协议破坏了 LDAP RFC，但可用于访问 AD。
            authentication=NTLM)
        data['username'] = username
        data['password'] = password
        data['message'] = 'LDAP Bind Successful.'
        data['status'] = True
        # 检索用户信息
        conn.search(
            search_base='ou=Dominos_China_Users,dc=dashbrands,dc=local',
            search_filter='(&(objectCategory=Person)(sAMAccountName={uname}))'.
            format(uname=username),
            # attributes: 决定输出哪些属性
            # attributes=['cn', 'mail', 'distinguishedName', 'memberOf', 'sAMAccountName']
            attributes=['memberOf'])
        # 判断是不是管理员
        for user in sorted(conn.entries):
            for group in user.memberOf:
                if group.upper().find('CN=' + 'Domain Admins'.upper()) >= 0:
                    data['is_superuser'] = True
                else:
                    continue
            for group in user.memberOf:
                if group.upper().find('CN=' + 'dominos staff'.upper()) >= 0:
                    data['is_staff'] = True
                else:
                    continue

    except Exception as e:
        # 如果LDAP绑定失败打印authentication failure的原因
        # print('LDAP Bind Failed: ', e)
        data['message'] = 'LDAP Bind Failed: ' + str(e)
        data['status'] = False

    return data


if __name__ == '__main__':
    print(datetime.datetime.now())
    res = ldap_authentication(username='furong.zhou', password='Jack@080716')
    print(datetime.datetime.now())

    print(datetime.datetime.now())
    ldap_auth(username='dm.admin', password='#nVv5a#RRDFI')
    print(datetime.datetime.now())
