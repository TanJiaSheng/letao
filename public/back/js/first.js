$(function() {
    var currentPage = 1;    //当前页
    var pageSize = 5;   //每页多少条
   //一进入如页面，发送ajax请求获取数据，通过模板引擎渲染
    render();
    function render() {
        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data:{
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function(info) {
                console.log(info);
                //将数据和模板相结合，进行页面渲染
                var htmlStr = template("tpl", info);
                $('tbody').html(htmlStr);

                //进行分页初始化
                $('#paginator').bootstrapPaginator({
                    // 指定bootstrap 版本
                    bootstrapMajorVersion: 3,
                    // 总页数
                    totalPages: Math.ceil(info.total / info.size),
                    //当前页
                    currentPage: currentPage,
                    //注册点击事件
                    onPageClicked: function(a, b, c, page) {
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