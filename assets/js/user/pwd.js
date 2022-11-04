$(function(){
    let form = layui.form
    let layer = layui.layer

    form.verify({
        pwd:[
            /^[\S]{6,12}$/ ,'密码必须6到12位，且不能出现空格'
        ],
        samePwd:function(value){
            if(value === $('.layui-input-block [name=oldPwd]').val()){
                return '不能与旧密码一致'
            }
        },
        newspwd:function(value){
            if(value !== $('.layui-input-block [name=newPwd]').val()){
                return '俩次密码不一致'
            }
            
        }
    })

    revisePwd()
    //修改密码提交事件
    function revisePwd(){
        $('.layui-form').on('submit',function(e){
            e.preventDefault()
            $.ajax({
                type:'POST',
                url:'/my/updatepwd',
                data:$(this).serialize(),
                success:function(res){
                    if(res.status !==0){
                        return layer.msg('更新密码失败')
                    }
                    layer.msg('更新密码成功')
                    //重置表单
                    $('.layui-form')[0].reset()
                }
            })
        })
    }
})