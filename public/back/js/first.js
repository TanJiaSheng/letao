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

    // 2.点击添加按钮弹出模态框
    $('#addBtn').on("click", function() {
        $('#addModal').modal("show");
    });

    //3. 使用表单校验插件，实现表单校验
    $('#form').bootstrapValidator({
        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',   //检验成功
            invalid: 'glyphicon glyphicon-remove',  //检验失败
            validating: 'glyphicon glyphicon-refresh'   //检验中
        },

        //配置字段
        fields: {
            categoryName: {
                validators: {
                    notEmpty: {
                        message: "一级分类不能为空"
                    }
                }
            }
        }
    });

    //4. 注册表单检验成功事件，阻止默认的成功提交，通过 ajax 进行提交
    $('#form').on("success.form.bv", function(e) {
        e.preventDefault();
        //通过ajax进行提交
        $.ajax({
            type: "post",
            url: "/category/addTopCategory",
            data: $('#form').serialize(),
            dataType: "json",
            success: function (info) {
               if( info.success ) {
                   //添加成功
                   //1. 关闭模态框
                   $('#addModal').modal("hide");
                   //2. 页面重新渲染第一页，让用户看到第一页的数据
                   currentPage = 1;
                   render();
                   //3. 重置模态框  resetForm(true) 不仅重置检验状态 ， 海崇志表单内容
                   $('#form').data("bootstrapValidator").resetForm(true);
               }
            }
        });
    });
});