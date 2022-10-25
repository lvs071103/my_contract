from django.views.decorators.csrf import csrf_protect
from django.http import JsonResponse
from django.contrib import auth
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from tools.ldap import ldap_auth
# Create your views here.


@csrf_protect
def login(request):
    if request.method == 'POST' and request.is_ajax():
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '').strip()
        if username and password:
            try:
                # 本地数据库查询
                User.objects.get(username=username)
                data = auth_handler(request, username, password)
            except User.DoesNotExist:
                # 本地数据查询不存在，则去AD验证
                users = {}
                ldap = ldap_auth(username, password)
                if ldap['status']:
                    users['username'] = ldap['username']
                    users['email'] = '{}@dominos.com.cn'.format(
                        ldap['username'])
                    users['password'] = make_password(ldap['password'])
                if ldap['is_staff']:
                    users['is_staff'] = ldap['is_staff']
                    users['is_active'] = True
                User.objects.create(**users)
                # 存完之后再做一次登陆动作
                data = auth_handler(request,
                                    username=username,
                                    password=password)
        else:
            # AD验证失败，直接返回AD错误信息给前端
            data = {'success': False, 'message': ldap['message']}
    else:
        data = {'success': False, 'message': 'post request is required'}

    return JsonResponse(data)


def auth_handler(request, username, password):
    # data = {}
    user = auth.authenticate(username=username, password=password)
    # 本地验证
    if user is not None:
        if user.is_active or user.username == 'admin':
            auth.login(request, user)
            request.session['id'] = user.id
            request.session['username'] = user.username
            request.session['job'] = user.job
            data = {'success': True}
        else:
            data = {
                'success': False,
                'message':
                'account not active, contact the administrator please'
            }
    else:
        # 当user为none时，去AD重新验证
        ldap = ldap_auth(username, password)
        # AD验证通过
        if ldap['status']:
            # 更新密码（别忘记make_password否则数据存储的密码是明文，并且auth.authenticate验证返回none）
            User.objects.filter(username=username).update(
                password=make_password(password))
            # 再次验证
            user = auth.authenticate(username=username, password=password)
            if user is not None:
                if user.is_active or user.username == 'admin':
                    auth.login(request, user)
                    request.session['id'] = user.id
                    request.session['username'] = user.username
                    request.session['job'] = user.job
                    data = {'success': True, 'message': 'login success'}
                else:
                    data = {
                        'success':
                        False,
                        'message':
                        'account not active, contact the administrator please'
                    }
            else:
                data = {
                    'success': False,
                    'message': 'user/password authenticate failed'
                }
        else:
            # AD验证失败，直接返回数据给前端
            data = {'success': False, 'message': ldap['message']}

    return data
