$(function(){
    let form = layui.form
    let layer = layui.layer

    form.verify({
        nickname:function(value){
            if(value.length > 6){
                return '昵称长度必须在1-6个字符之间'
            }
        }
    })

    UserInfo()

    //初始化用户信息
    function UserInfo(){
        $.ajax({
            type:'GET',
            url:'/my/userinfo',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取用户信息失败')
                }
                // layer.msg(res.message)

                // $('.layui-input-block [name=username]').val(res.data.username)
                //调用form.val()快速为表单赋值
                form.val('formUserInfo',res.data)
            }
        })
    }

    UserReset()

    //重置表单信息
    function UserReset(){
        $('#btnReset').on('click',function(e){
            e.preventDefault();
            UserInfo()
            layer.msg('重置信息成功')
        })
    }

    UserUpdated()

    //监听表单提交
    function UserUpdated(){
        $('.layui-form').on('submit',function(e){
            e.preventDefault()
            //发起请求
            $.ajax({
                type:'POST',
                url:'/my/userinfo',
                data: $(this).serialize(),
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg('更新用户信息失败')
                    }
                    layer.msg('更新用户信息成功！',{icon: 1})

                    //调用父页面中的方法，重新渲染用户头像
                    window.parent.getUserInfo()
                }
            })
        })
    }
})