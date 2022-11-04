$(function(){
    let layer = layui.layer
    let $image = $('#image')
    //配置选项
    const options ={
        //纵横比，设置裁剪框形状：4/3，16/9
        aspectRatio:1,
        //指定预览区域
        preview:'.img-preview'
    }
    //创建裁剪区域
    $image.cropper(options)

    
    // 上传事件
    function btnSubmit(){
        $('#btnSubmit').on('click',function(){
            $('#file').click()
        })
    }
    btnSubmit()
    
    
    //为文件选择框绑定change事件
    function filesChange(){
        $('#file').on('change',function(e){
            // 获取用户选择的文件
            let filelist = e.target.files
            let files = e.target.files[0]

            if(filelist.length == 0){
                return layer.msg('未选择文件!!')  
            }
            // console.log(filelist)

            //将文件转化为路径
            let imgURL = URL.createObjectURL(files)
            //重新初始化裁剪区域
            $image.cropper('destroy') //销毁旧的裁剪区域
            .attr('src',imgURL) //重新设置图片路径
            .cropper(options)  //重新初始化裁剪区域
        })
    }
    filesChange()
    
    
    //确定
    function btnSuer(){
        $('#btnSuer').on('click',function(){
            //获取裁剪后头像
            let dataURL = $image
            .cropper('getCroppedCanvas',{
                // 创建一个canvas画布
                width:100,
                height:100
            }).toDataURL('image/png') //将canvas画布上的内容，转化为base64格式的字符串
            //调用接口，上传服务器
            $.ajax({
                type:'POST',
                url:'/my/update/avatar',
                data:{
                    avatar:dataURL
                },
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg('更换头像失败')
                    }
                    layer.msg('更换头像成功',{icon:1})
                    window.parent.getUserInfo()
                }
            })
        })
    }
    btnSuer()
    
})