$(function () {
    var currentPage = 1;
    var pageSize = 5;
    //1. 一进入页面，发送ajax请求，获取用户列表数据，通过模板引擎渲染
    render();
    function render() {
        $.ajax({
            type: "get",
            url: "/user/queryUser",
            dataType: "json",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function(info) {
                console.log(info);
                // template(模板id, 数据对象)
                // 在模板中可以任意使用数据对象中的属性
                var htmlStr = template('tpl', info);
                $('tbody').html(htmlStr);

                //分页初始化
                $('#paginator').bootstrapPaginator({
                    //配置 bootstrap 版本
                    bootstrapMajorVersion: 3,
                    // 指定页数
                    totalPages: Math.ceil( info.total / info.size),
                    //当前页
                    currentPage: info.page,
                    //当页面被点击是调用的回调函数
                    onPageClicked: function(a, b, type, page) {
                        //通过 page 获取点击的页码

                        //更新当前页
                        currentPage = page;
                        //重新渲染
                        render();
                    }
                });
            }
        });
    }
});