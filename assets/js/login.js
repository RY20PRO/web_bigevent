$(function(){
    //点击‘去注册账号’
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })

    //点击'登录'
    $('#link_login').on('click',function(){
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //从layui中获取form对象
    let form = layui.form
    let layer = layui.layer
    //通过form.verify()函数自定义校验规则
    form.verify({
        //自定义密码校验
        pwd:[/^[\S]{6,12}$/,'密码必须为6到12位,且不能出现空格'],

        //校验俩次密码是否一致
        repwd:function(value){
            // 形参获取的是确认密码的内容
           let pwd = $('.reg-box [name=password]').val() //密码
           if(pwd !==value){
                return '俩次密码不一致！'
           }
        },
        //用户名
        nm:function(value){
            if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                return '用户名不能有特殊字符';
              }
        }
    })


    //监听注册事件
    $('#form_reg').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            type:'POST',
            url: '/api/reguser',
            data:{
                username:$('#form_reg [name=username]').val(),
                password:$('#form_reg [name=password]').val()
            },
            success:function(res){
                if(res.status !== 0){
                    // return alert(res.message)
                    return layer.msg(res.message, {icon: 2}); 
                }
                layer.msg('注册成功', {icon: 1}); 

                //模拟点击登录
                $('#link_login').click()
            }
        })
    })

    //监听登录
    $('#form_login').submit(function(e){
        e.preventDefault()
        $.ajax({
            type:'POST',
            url:"/api/login",
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('登录失败', {icon: 5}); 
                }
                layer.msg('登录失败', {icon: 6});
                // console.log(res.token)
                //将登录的token保存到localStorage中
                localStorage.setItem('token',res.token)
                //跳转后台
                location.href = 'index.html'
            }
        })
    })
})
