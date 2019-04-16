$(function () {
    // 1. 一进入页面, 请求当前用户数据, 进行页面渲染
    //    (1) 用户已登录, 后台返回用户数据, 通过模板渲染
    //    (2) 用户没登录, 后台返回error, 当前用户未登录, 拦截到登录页
    $.ajax({
        type: "get",
        url: "/user/queryUserMessage",
        dataType: "json",
        success: function ( info ) {
            if ( info.error === 400 ) {
                // 用户未登录
                location.href = "login.html";
                return;
            }

            // 用户应登录, 返回用户数据
            var htmlStr = template("userTpl", info );
            $('#userInfo').html(htmlStr);
        }
    })

    // 2. 退出功能
    $('.logoutBtn').click(function () {
        // 发送AJAX请求, 进行退出操作
        $.ajax({
            tyoe: "get",
            url: "/user/logout",
            dataType: "json",
            success: function ( info ) {
                if ( info.success ) {
                    // 退出成功, 跳转到登录页
                    location.href = "login.html";
                }
            }
        });
    });
});