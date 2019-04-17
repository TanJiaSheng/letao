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
    $('.lt_main .mui-table-view').on("tap", ".btn_del", function () {
        var id = $(this).data("id");
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
        })
    });

});