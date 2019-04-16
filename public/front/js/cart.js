$(function() {
    // 1. 一进入页面, 发送 Ajax, 获取购物车数据
    //    (1) 用户未登录, 返回 error 拦截到登录页
    //    (2) 用户已登录, 后台返回 购物车数据, 进行页面渲染
    $.ajax({
        type: "get",
        url: "/cart/queryCart",
        dataType: "json",
        success: function ( info ) {
            console.log( info )
            if ( info.error === 400 ) {
                // 用户未登录, 拦截到登录页
                location.href = "login.html";
                return;
            }
            //已登录, 拿到数据, 模板动态渲染
            // 拿到的数组, template方法参数2要求是一个对象, 需要包装
            var htmlStr = template("cartTpl", { arr: info });
            $('.mui-table-view').html(htmlStr);
        }
    });
});