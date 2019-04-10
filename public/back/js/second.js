$(function() {
    var currentPage = 1;    //当前页
    var pageSize = 5;   //每页多少条

    //1. 一进入页面发送ajax请求， 获取数据，通过模板引擎渲染
    render();
    function render() {
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function(info) {
                //console.log(info);
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

    //2. 点击添加分类按钮，显示模态框
    $('#addBtn').on("click", function() {
        $('#addModal').modal("show");

        //发送ajax请求，获取一级分类全部数据，通过模板引擎渲染
        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            success: function (info) {
                //console.log(info);
                //结合模板渲染
                var htmlStr = template("dropdownTpl", info);
                $('.dropdown-menu').html(htmlStr);
            }
        });
    });

    //3. 通过事件委托，给dropdown-menu下的所有 a 绑定点击事件
    $('.dropdown-menu').on("click", "a", function () {
        //获取 a 的文本
        var txt = $(this).text();
        //设置给 dropdownText
        $('#dropdownText').text(txt);
        // 获取选中id
        var id = $(this).data("id");
        // 设置给 input
        $('[name="categoryId"]').val(id);
    });

    //4. 利用文件上传插件初始化
    $('#fileupload').fileupload({
        //配置返回的数据格式
        dataType: "json",
        //图片上传完成后会调用done回调函数
        done: function (e, data) {
            // 获取上传得到的图片地址
            var imgUrl = data.result.picAddr;
            //复制给 img
            $('#imgBox img').attr("src", imgUrl);
            $('[name="brandLogo"]').val(imgUrl);
        }
    });
    /**
     * 文件上传思路整理
     * 1.引包
     * 2.准备结构， name  data-url
     * 3.进行文件上传初始化，配置 done 回调函数
     * */
});