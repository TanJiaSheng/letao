$(function() {
    var currentPage = 1;    //当前页
    var pageSize = 2;   //每页多少条
    var currentId;
    var statu;

    // 定义 用来存储已上传的图片 的数组
    var picArr = [];

    //1. 一进入页面发送ajax请求， 获取数据，通过模板引擎渲染
    render();
    function render() {
        $.ajax({
            type: "get",
            url: "/product/queryProductDetailList",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            // 后台如果在响应头中，设置了响应头 Content-Type: application/json
            //前端可以省略 dataType: "json"
            dataType: "json",
            success: function (info) {
                //console.log(info);
                var htmlStr = template("tpl", info);
                $('tbody').html(htmlStr);

                //分页初始化
                $('#paginator').bootstrapPaginator({
                    //配置 bootstrap 版本
                    bootstrapMajorVersion: 3,
                    //总页数
                    totalPages: Math.ceil(info.total / info.size),
                    //当前页
                    currentPage: info.page,
                    //配置按钮大小
                    size: "small",
                    // 配置每个按键的文字
                    // 每个按钮, 都会调用一次这个方法, 他的返回值, 就是按钮的文本内容
                    itemTexts: function( type, page, current ) {
                        // 参数1：first 首页 last 尾页, prev 上一页, next 下一页, page 普通页码
                        // 参数2：page 是当前按钮指向第几页
                        // 参数3：current 是指当前是第几页 (相对于整个分页来说的)
                        switch( type ) {
                            case "first":
                                return "首页";
                            case "last":
                                return "尾页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "page":
                                return page;
                        }
                    },
                    // 配置 title 提示框
                    // 在每个按钮初始化的时候，都会调用一次这个函数，通过返回值设置 title 文本
                    tooltipTitles: function( type, page, current) {
                        switch( type ) {
                            case "first":
                                return "首页";
                            case "last":
                                return "尾页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "page":
                                return "前往第" + page + "页";
                        }
                    },
                    // 使用 bootstrap 样式的提示框组件
                    useBootstrapTooltip: true,
                    //注册页码点击事件
                    onPageClicked: function (a, b, c, page) {
                        //更新页码
                        currentPage = page;
                        //重新渲染
                        render();
                    }

                });
            }
        });
    }

    //2. 通过事件委托给 点击操作按钮注册点击事件，实现上下架功能
    $('.lt_content tbody').on("click", ".btn", function() {
        //显示模态框
        $('#productModal').modal("show");

        //获取用户id,jQuery 中提供了获取自定义属性的方法, data()
        currentId = $(this).parent().data("id");

        // 1 表示 已上架, 0 表示 已下架
        // 如果是下架按钮，说明需要将该用户置成禁用状态，传 0
        statu = $(this).hasClass("btn-danger") ? 0 : 1;
    });

    //3. 点击确认按钮，发送ajax请求，修改对应用户转态,需要两个参数(商品id，isDelete用户改成的转态)
    $('#submitBtn').on("click", function() {
        /*$.ajax({
            type: "get",
            url: "后台没有给接口"
        })*/
    });


    //4.点击添加按钮，弹出模态框
    $('#addBtn').on("click", function() {
        $('#addModal').modal("show");

        //发送ajax请求，获取二级级分类全部数据，通过模板引擎渲染
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data:{
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            success: function (info) {
                //console.log(info)
                var htmlStr = template("dropdownTpl", info);
                $('.dropdown-menu').html(htmlStr);
            }
        });
    });

    //5. 通过事件委托，给dropdown-menu下的所有 a 绑定点击事件
    $('.dropdown-menu').on("click", "a", function () {
        // 获取下拉框选择文本
        var txt = $(this).text();
        // 给下拉框赋值
        $('#dropdownText').text(txt);
        //获取选中 id
        var id = $(this).data("id");
        // 给隐藏域赋值
        $('[name="brandId"]').val(id);
        //重置校验状态 VALID
        $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
    });

    //6. 利用文件上传插件初始化
    //   多文件上传时，插件会遍历选中图片，发送多次请求到服务器，将来响应多次
    //   每次相应都会调用一次 done 方法
    $('#fileupload').fileupload({
        //返回的数据格式
        dataType: "json",
        //文件上传完成时调用的回调函数
        done: function(e, data){
            // data.result 是后台相应的内容
            //console.log(data.result.picAddr);
            var imgUrl = data.result.picAddr;
            //在数组的最前面追加 图片对象
            picArr.unshift(data.result);
            // 往 imgBox 前面追加 img 元素
            $('#imgBox').prepend('<img src="'+ imgUrl +'" width="100" alt="">');
            //通过判断数组长度，如果数组长度大于3，将数组最后一项移除
            if ( picArr.length > 3) {
                //移除数组最后一项
                picArr.pop();
                //移除 imgBox 中的最后一项
                //$('#imgBox img').eq(-1).remove();
                $('#imgBox img:last-of-type').remove();
            }

            //如果处理后，图片数组的长度为3，那么就通过校验，手动将picStatus置成VALID
            if ( picArr.length ===3 ){
                $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID");
            }
        }
    });

    //7. 进行表单校验初始化
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
            //二级分类
            brandId: {
                validators: {
                    notEmpty: {
                        message: "请选择二级分类"
                    }
                }
            },
            //商品名称
            proName: {
                validators: {
                    notEmpty: {
                        message: "请输入商品名称"
                    }
                }
            },
            //商品描述
            proDesc: {
                validators: {
                    notEmpty: {
                        message: "请输入商品描述"
                    }
                }
            },
            //商品库存
            //出来非空之外，必须时非0开头的数字
            num: {
                validators: {
                    notEmpty: {
                        message: "请输入商品库存"
                    },
                    //正则检验
                    // \d 表示数字 0-9
                    // + 表示出现一次或多次
                    // * 表示出现0次或多次
                    // ? 表示出现0次或1次
                    regexp: {
                        regexp:/^[1-9]\d*$/,
                        message: "库存商品格式必须是非零开头的数字"
                    }
                }
            },
            //商品尺码
            // 尺码，还要必须时 XX-XX 的格式，X为数字
            size: {
                validators: {
                    notEmpty: {
                        message: "请输入商品尺码"
                    },
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: "尺码必须是 xx-xx 的格式，例如：35-42"
                    }
                }
            },
            //商品原价
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: "请输入商品原价"
                    }
                }
            },
            //商品现价
            price: {
                validators: {
                    notEmpty: {
                        message: "请输入商品原价"
                    }
                }
            },
            //图片校验
            picStatus:{
                validators: {
                    notEmpty: {
                        message: "请选择三张图片"
                    }
                }
            }
        }
    });

    //8. 注册表单校验成功事件，阻止默认提交，通过ajax进行提交
    $('#form').on("success.form.bv", function(e) {
        //组织默认提交
        e.preventDefault();
        //获取表单元素
        var paramsStr = $('#form').serialize();

        //还需要拼接上图的数据
        // &picName1=xx&picAddr1=xx
        // &picName2=xx&picAddr2=xx
        // &picName3=xx&picAddr3=xx
        paramsStr += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
        paramsStr += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
        paramsStr += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;

        $.ajax({
            type: "post",
            url: "/product/addProduct",
            data: paramsStr,
            dataType: "json",
            success: function ( info  ) {
                if (info.success) {
                    //关闭模态框
                    $('#addModal').modal("hide");
                    //页面重新渲染
                    currentPage = 1;
                    render();

                    //重置表单的内容和校验状态
                    $('#form').data("bootstrapValidator").resetForm(true);
                    //4. 手动重置文本内容和图片
                    $('#dropdownText').text("请选择二级分类");
                    $('#imgBox img').remove()//所有图片自杀
                }
            }
        });
    });
});