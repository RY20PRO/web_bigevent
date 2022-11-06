$(function(){
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage
    //定义美化时间过滤器
    template.defaults.imports.dataFormat = function(date){
        const dataTime = new Date(date)
        let y = dataTime.getFullYear()
        let m = addZero(dataTime.getMonth()+1)
        let d = addZero(dataTime.getDate())
        let hh = addZero(dataTime.getHours() )
        let mm = addZero(dataTime.getMinutes())
        let ss = addZero(dataTime.getSeconds())
        
        return y+'-'+m+'-'+d+" "+hh+":"+mm+":"+ss
    }

    // 补零函数
    function addZero(n){
        return n>9?n:'0'+n
    }

    //定义一个查询参数对象，在需要请求数据时，将请求参数对象提交到服务器
    let qDate ={
        pagenum: 1, //页码值，默认为第一页数据
        pagesize: 2, //默认显示俩条数据
        cate_id: '', //文章分类的ID
        state: '' //文章发布状态
    }

    //获取文章列表数据
    function listTable(){
        $.ajax({
            type:'GET',
            url:'/my/article/list',
            data:qDate,
            success:function(res){
                if(res.status !==0){
                    return layer.msg('获取文章列表失败')
                }
                //使用模板引擎渲染页面数据
                let listData= template('list-tab',res)
                $('tbody').html(listData)

                //调用分页
                fyPage(res.total)
            }
        })

    }
    listTable()

    //获取文章分类
    function listCate(){
        $.ajax({
            type:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !==0){
                    return layer.msg('获取文章分类失败')
                }
                //调用分类模板
                let listcateStr = template('list-cate',res)
                $('[name=cate_id]').html(listcateStr)
                form.render()
            }
        })
    }
    listCate()

    //为筛选表单绑定submit事件
    function submitCate(){
        $('#form-search').on('submit',function(e){
            e.preventDefault();
            //获取表单项选中值
            let cateId = $('[name=cate_id]').val()
            let state = $('[name=state]').val()

            //为查询参数对象qDate对应的属性赋值

            qDate.cate_id = cateId
            qDate.state = state

            //重新渲染表格数据
            listTable()
        })
    }
    submitCate()

    //定义分页
    function fyPage(total){
        //调用laypage.render（）方法来渲染分页
        laypage.render({
            elem:'pageBox', //分页容器ID
            count:total, //总条数
            limit:qDate.pagesize, //每页显示条数
            curr:qDate.pagenum, //默认选中的分页
            layout:['count','limit','prev', 'page', 'next','skip'],
            limits:[2,3,5,10],
          
            //分页发生切换触发jump
            /*
                jump死循环触发情况
                    1.点击页码会触发jump
                    只要调用laypage.render()就会触发jump
            */
            jump:function(obj,first){
                //把最新的页码值，赋值到q这个查询参数对象中
                qDate.pagenum = obj.curr
                //把最新的条目数，赋值到qDate查询参数对象pagesize
                qDate.pagesize = obj.limit
                //根据最新的qDate获取对应的数据列表，并渲染表格
                //通过first值进行判断触发jump方式
                if(!first){
                    listTable()
                }
            }
        })
    }

    //通过代理为删除绑定点击事件
    $('tbody').on('click','.btn-del',function(){
        //获取删除按钮个数
        let lengthDel = $('.btn-del').length

        let id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                type:'GET',
                url:'/my/article/delete/' + id,
                success:function(res){
                    if(res.status !==0){
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除文章成功')
                    //当最后一页数据被清空，改变页码值-1

                    if(lengthDel=== 1){
                        qDate.pagenum = qDate.pagenum === 1 ? qDate.pagenum : qDate.pagenum-1
                    }
                    listTable()
                    
                }
            })
            
            layer.close(index);
          });
    })

    // //通过代理为编辑绑定事件
    // $('tbody').on('click','.btn-xg',function(){
    //     location.href = '/article/artxg.html'
    //     let idq = $(this).attr('data-id')
    //     $.ajax({
    //         type:'GET',
    //         url:'/my/article/'+ idq

    //     })
    // })
    
})