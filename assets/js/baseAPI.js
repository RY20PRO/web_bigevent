
//每次调用$.get()或$.post()或$.ajax()会先调用ajaxPrefilter函数
$.ajaxPrefilter(function(options){

    //在发起真正的ajax请求之前，进行拼接请求路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url)
})