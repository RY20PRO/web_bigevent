
//每次调用$.get()或$.post()或$.ajax()会先调用ajaxPrefilter函数
$.ajaxPrefilter(function(options){

    //在发起真正的ajax请求之前，进行拼接请求路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url)

    //统一为有权限的接口设置headers请求头
    if(options.url.indexOf('/my/') !== -1){
        options.headers={
            Authorization: localStorage.getItem('token')||''
        }
    }

    //全局统一挂载complte回调函数
    //无论成功还是失败，都会执行complete回调函数
    options.complete = function(res){
        //complete回调函数中可以使用res.responseJSON拿到服务器响应的数据
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
            //强制清空token
            localStorage.removeItem('token')
            //强制跳转到登录页面
            location.href = '/login.html'
        }
    }
    
})