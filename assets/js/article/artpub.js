$(function(){
    let layer = layui.layer
    let form = layui.form
    //定义加载文章分类方法
   function pubCate(){
    $.ajax({
        type:'GET',
        url:'/my/article/cates',
        success:function(res){
            if(res.status !==0){
                return layer.msg('获取文章分类失败')
            }
            //调用模板，渲染
           let flStr = template('fl-tab',res)
           $('[name=cate_id]').html(flStr)
           form.render() //更新渲染
        }
    })
   }
   pubCate()
   // 初始化富文本编辑器
    initEditor()  
    
        
    // 1. 初始化图片裁剪器
    let $image = $('#image')
    
    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择封面的按钮绑定点击事件
    $('#btnChoose').on('click',function(){
        $('#coverFile').click()
    })

    //监听coverFile的change事件，获取用户选择的文件
    $('#coverFile').on('change',function(e){
        let fileS = e.target.files
        if(fileS.length === 0){
            return 
        }
        //根据文件创建对应URL地址
        let ImageURL= URL.createObjectURL(fileS[0])
        //为裁剪区域重新设置图片
        $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', ImageURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
        
    })

    //定义文章发布状态
    let artState = '已发布'

    //为存为草稿绑定点击事件
    $('#btnSave').on('click',function(){
        artState = '草稿'
    })

    //为表单form-pub绑定提交事件
    $('#form-pub').on('submit',function(e){
        e.preventDefault();
        // 基于表单快速创建FormDate对象
        let newFormData = new FormData($(this)[0])
        // 将文章发布状态追加
        newFormData.append('state',artState)
        /*
        newFormData.forEach(function(value,key){
                console.log(key,value)
            })
        */
        //将封面裁剪后的图片，输出为文件对象
        $image
        .cropper('getCroppedCanvas', { 
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {       
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            //将文件对象存入newFormData中
            newFormData.append('cover_img',blob)

            //发起请求
            POSTPub(newFormData)
        })
    })

    //定义请求方法
    function POSTPub(newFormData){
        $.ajax({
                type:'POST',
                url:'/my/article/add',
                data:newFormData,
                /*
                    如果向服务器提交的是formData格式的数据需要添加如下俩个属性
                */
               contentType:false,
               processData:false,
               success:function(res){
                if(res.status !==0){
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                //发布文章成功后跳转到文章列表
                location.href = '/article/artlist.html'
               }
        })
    }

})