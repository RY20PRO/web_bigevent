$(function(){

    getUserInfo()

    //点击退出
    $('#btnLogout').on('click',function(){
        
        //提示用户是否退出
        layer.confirm('确定退出吗?', {icon: 3, title:'提示'}, 
        function(index){
            //关闭弹窗询问
            layer.close(index);
            //清空本地存储token
            localStorage.removeItem('token')
            //重新跳转到登录页
            location.href='/login.html'
          });
    })
})

//获取用户基本信息
function getUserInfo(){
    $.ajax({
        type:'GET',
        url:'/my/userinfo',
        //请求头配置对象
        // headers:{
        //     Authorization: localStorage.getItem('token')||''
        // },
        success:function(res){
            // console.log(res)
            if(res.status !== 0){
                return layui.layer.msg('获取用户信息失败')
            }
            //调用renderAvatar渲染用户头像
            renderAvatar(res.data)
        },
        //无论成功还是失败，都会执行complete回调函数
        // complete:function(res){
        //     //complete回调函数中可以使用res.responseJSON拿到服务器响应的数据
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //         //强制清空token
        //         localStorage.removeItem('token')
        //         //强制跳转到登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}
//渲染用户头像
function renderAvatar(user){
    //获取用户名称
    let name=user.nickname || user.username
    //设置欢迎文本
    $('#welcome').html(`欢迎&nbsp;&nbsp<u>${name}</u>`)
    //按需渲染用户头像
    if(user.user_pic !== null){
        //渲染图片头像
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
    }else{
        //渲染文本头像
        $('.layui-nav-img').hide()

        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}