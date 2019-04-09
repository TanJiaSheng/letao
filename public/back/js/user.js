$(function () {
    var currentPage = 1;    //当前页
    var pageSize = 5;   //每页多少条
    var currentId; //当前用户id
    var isDelete;
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
                //console.log(info);
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

    //2. 点击启用禁用按钮，显示模态框，通过事件委托绑定事件
    $('tbody').on("click", ".btn", function(){
        //显示模态框
        $('#userModal').modal("show");

        //获取用户id,jQuery 中提供了获取自定义属性的方法, data()
        currentId = $(this).parent().data("id");

        // 1 表示 已启用, 0 表示 已禁用
        // 如果是禁用按钮，说明需要将该用户置成禁用状态，传 0
        isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    });

    //3. 点击确认按钮，发送ajax请求，修改对应用户转态,需要两个参数(用户id，isDelete用户改成的转态)
    $('#submitBtn').on("click", function() {
        //发送 ajax
        $.ajax({
            type: "post",
            url: "/user/updateUser",
            data: {
                id: currentId,
                isDelete: isDelete
            },
            dataType: "json",
            success: function (info) {
                //1.关闭模态框
                $('#userModal').modal("hide");
                //2. 页面重新渲染
                render();
            }
        })
    })
});