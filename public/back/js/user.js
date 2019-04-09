$(function () {
    //1. 一进入页面，发送ajax请求，获取用户列表数据，通过模板引擎渲染
    $.ajax({
        type: "get",
        url: "/user/queryUser",
        dataType: "json",
        data: {
            page: 1,
            pageSize: 5
        },
        success: function(info) {
            console.log(info);
            // template(模板id, 数据对象)
            // 在模板中可以任意使用数据对象中的属性
            var htmlStr = template('tpl', info);
            $('tbody').html(htmlStr);
        }
    })
});