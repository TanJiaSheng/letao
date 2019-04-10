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

        // 将隐藏域校验状态，设置成校验成功状态 updateStatus
        // updateStatus(字段名, 校验状态, 校验规则)
        $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");
    });

    /**
     * 文件上传思路整理
     * 1.引包
     * 2.准备结构， name  data-url
     * 3.进行文件上传初始化，配置 done 回调函数
     * */
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
            //手动重置隐藏域的校验状态
            $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
        }
    });


    //5. 实现表单校验
    $('#form').bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        // 需要对隐藏域进行校验，所以不需要将隐藏域排除到校验范围外
        excluded: [],

        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',   //检验成功
            invalid: 'glyphicon glyphicon-remove',  //检验失败
            validating: 'glyphicon glyphicon-refresh'   //检验中
        },

        //配置字段
        fields: {
            //categoryId 分类id
            //brandName 二级分类名称
            //brandLogo 图片地址
            categoryId: {
                validators: {
                    notEmpty: {
                        message: "请选择一级分类"
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: "请输入二级分类"
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: "请上传Logo图片"
                    }
                }
            }
        }
    });

    //6. 注册表单校验成功事件，阻止，偶人提交，通过ajax进行提交
    $('#form').on('success.form.bv', function () {
        // 通过afax提交
        $.ajax({
            type: "post",
            url: "/category/addSecondCategory",
            data: $('#form').serialize(),
            dataType: "json",
            success: function (info) {
                //console.log(info);
                if( info.success ) {
                    //1. 关闭模态框
                    $('#addModal').modal("hide");
                    //2. 页面重新渲染第一页，让用户看到第一页的数据
                    currentPage = 1;
                    render();
                    //3. 重置模态框  resetForm(true) 不仅重置检验状态 ， 海崇志表单内容
                    $('#form').data("bootstrapValidator").resetForm(true);
                    //4. 手动重置文本内容和图片路径
                    $('#dropdownText').text("请选择一级分类");
                    $('#imgBox img').attr("src", "./images/none.png");
                }
            }
        })
    })
});