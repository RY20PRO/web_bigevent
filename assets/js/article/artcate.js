$(function(){

    let layer = layui.layer
    let form = layui.form
    //获取文章分类列表
    function artCateList(){
        $.ajax({
            type:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !==0){
                    return layer.msg('获取文章列表失败',{icon:2})
                    // console.log(res)
                    
                }
                let htmldata = template('artlist',res)

                $('.layui-table tbody').html(htmldata)
            }
        })
    }
    artCateList()


    //添加类别
    
        // 设置添加弹出层index
        let indexAdd = null
        $('#btnAddCate').on('click',function(){
            indexAdd = layer.open({
                type:1,
                area:['500px','250px'],
                title: ['添加文章类别','font-size:15px'],
                content: $('#artBtnAdd').html()
              });  
        })
    

    // 通过代理为form-add表单绑定submit提交事件
    
        $('body').on('submit','#form-add',function(e){
            e.preventDefault();
            $this = $('#form-add')
            $.ajax({
                type:'POST',
                url:'/my/article/addcates',
                data: $this.serialize(),
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg('新增文章分类失败')
                    }
                    artCateList()
                    layer.msg('新增文章分类成功',{icon:1})
                    //根据索引关闭对应的弹出层
                    layer.close(indexAdd)
                }
            })
        })
    

    //通过代理为编辑按钮绑定事件
        //设置编辑弹出层index
    let indexEdit = null
    $('tbody').on('click','.btn-edit',function(){
        indexEdit = layer.open({
            type:1,
            area:['500px','250px'],
            title:'修改文章类别',
            content:$('#artBtnEdit').html()
        })
        let ids = $(this).attr('data-id')

        //发起请求获取对应分类
        $.ajax({
            type:'GET',
            url:'/my/article/cates/' + ids,
            success:function(res){
                if(res.status !==0){
                    return layer.msg('获取分类请求失败')
                }
                form.val('form-edit',res.data)
            }
        })
    })

    //通过代理为修改分类表单绑定事件
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault()
        $.ajax({
            type:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !==0){
                    return layer.msg('更新文章分类失败')
                }
                layer.msg('更新文章分类成功')
                layer.close(indexEdit)
                artCateList()
            }
        })
    })

    //通过代理为删除绑定点击事件
    $('tbody').on('click','.btn-del',function(){
        let ida = $(this).attr('data-id')
        //提示用户是否删除
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                type:'GET',
                url:'/my/article/deletecate/' + ida,
                success:function(res){
                    if(res.status !==0){
                        return layer.msg('删除分类失败',{icon:2})
                    }
                    layer.msg('删除分类成功',{icon:1})
                    layer.close(index);
                    artCateList()
                }
            })

          });
    })
})