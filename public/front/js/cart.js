$(function() {

    function render() {
        // 1. 一进入页面, 发送 Ajax, 获取购物车数据
        //    (1) 用户未登录, 返回 error 拦截到登录页
        //    (2) 用户已登录, 后台返回 购物车数据, 进行页面渲染
        $.ajax({
            type: "get",
            url: "/cart/queryCart",
            dataType: "json",
            success: function ( info ) {
                //console.log( info )
                if ( info.error === 400 ) {
                    // 用户未登录, 拦截到登录页
                    location.href = "login.html?retUrl=" + location.href;
                    return;
                }
                //已登录, 拿到数据, 模板动态渲染
                // 拿到的数组, template方法参数2要求是一个对象, 需要包装
                var htmlStr = template("cartTpl", { arr: info });
                $('.lt_main .mui-table-view').html(htmlStr);

                // 渲染完成, 需要关闭下拉刷新
                mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
            }
        });
    }

    // 2. 配置下拉刷新
    mui.init({
        pullRefresh : {
            container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down : {
                auto: true, // 首次加载自动上拉刷新一次
                callback: function () {
                    // 发送ajax请求, 获取数据, 进行渲染
                    render();
                }
            }
        }
    });
    
    // 3. 删除功能
    // (1) 给删除按钮注册事件, 事件委托, 通过 tap 进行注册点击
    // (2) 获取在按钮中存储的id
    // (3) 发送ajax请求, 执行删除操作
    // (4) 页面重新渲染
    $('.lt_main').on("tap", ".btn_del", function () {
        var id = $(this).data("id");
        mui.confirm("你确定要删除此商品吗？", "温馨提示", ["取消", "删除"], function ( e ) {
            if ( e.index === 1) {
                // 发送 ajax 请求
                $.ajax({
                    type: "get",
                    url: "/cart/deleteCart",
                    // 后台要传的 id 参数是一组数组格式
                    data: {
                        id: [id]
                    },
                    dataType: "json",
                    success: function ( info ) {
                        if ( info.success ) {
                            // 删除成功
                            mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
                        }
                    }
                });
            }
        });
    });

    // 4. 编辑功能
    $('.lt_main').on("tap", ".btn_edit", function () {
        // html5 里面有一个 dataset 可以一次获取所有的自定义属性
        var obj = this.dataset;
        var id = obj.id;
        // 生成 htmlStr
        var htmlStr = template("editTpl", obj );

        // mui 将模板中 \n 换行标记, 解析成 <br> 标签, 就换行了
        // 需要将模板中所有的 \n 去掉
        htmlStr = htmlStr.replace( /\n/g, "" );

        // 弹出对话框
        // 确认框的内容, 支持传递 html
        mui.confirm(htmlStr, "编辑商品", ["确认", "取消"], function ( e ) {
            if ( e.index === 0) {
                // 你点击的是确认按钮, 进行获取尺码, 数量, id进行 Ajax 提交
                var size = $('.lt_size span.current').text(); // 尺码
                var num = $('.mui-numbox-input').val(); // 数量
                $.ajax({
                    type: "post",
                    url: "/cart/updateCart",
                    data: {
                        id: id,
                        size: size,
                        num: num
                    },
                    dataType: "json",
                    success: function ( info ) {
                        if ( info.success ) {
                            // 下拉刷新一次
                            mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
                        }
                    }
                });
            }
        });

        // 进行数字狂初始化
        mui('.mui-numbox').numbox();
    });

    // 5. 让尺码可选
    $('body').on('click', ".lt_size span", function () {
        $(this).addClass("current").siblings().removeClass("current");
    });
});