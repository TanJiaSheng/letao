// 登录拦截功能，登录界面不需要校验，不用登录直接访问
// 前后端分离了，前段是不知道该用户是否登录了，但后台知道
// 发送 ajax 请求，查询用户状态即可
// (1) 用户已登录，啥都不做，让用户继续访问
// (2) 用户未登录，拦截到登录页

if(location.href.indexOf("login.html") === -1){
    // 地址栏中没有 login.html，说明不是登录页，需要进行登录拦截
    $.ajax({
        type: "get",
        url: "/employee/checkRootLogin",
        dataType: "json",
        success: function(info) {
            //console.log(info);
            if(info.success) {
                //已登录，让用户继续访问
            }
            if(info.error === 400) {
                //未登录，拦截到登录页
                location.href = "login.html";
            }
        }
    });
}

//实现在第一个ajax发送请求的时候，开启进度条
//在所有的ajax请求都完成的时候，结束进度条

//ajax 全局事件

//1. ajaxComplete 当 ajax 请求完成的时候，调用（不管成功还是失败都调用）
//2. ajaxError    当 ajax 请求失败的时候调用
//3. ajaxSuccess  当 ajax 请求成功的时候调用
//4. ajaxSend     在每个 ajax 请求发送前调用
//5. ajaxStart    在第一个 ajax 请求发送时调用
//6. ajaxStop     在所有的 ajax 请求完成时调用

//ajaxStart    在第一个 ajax 请求发送时调用
$(document).ajaxStart(function() {
    //开启进度条
    NProgress.start();
});

//ajaxStop     在所有的 ajax 请求完成时，调用
$(document).ajaxStop(function() {
    //模拟网络延迟
    setTimeout(function() {
        //结束进度条
        NProgress.done();
    },500);
});


$(function() {
   //1. 分类管理的切换功能
    $(".category").on("click", function() {
        //切换child 的显示隐藏
        $('.nav .child').stop().slideToggle();
    });

   //2.左侧侧边栏切换功能
    $('.icon_menu').on("click", function() {
        $('.lt_aside').toggleClass('hidemenu');
        $('.lt_main').toggleClass('hidemenu');
        $('.lt_topbar').toggleClass('hidemenu');
    });

   //3.点击topbar退出按钮，弹出模态框
    $('.icon_logout').on("click", function() {
        //显示模态框，modal("show")
        $('#logoutModal').modal('show');
    });

    //4. 点击模态框的退出按钮，实现推迟功能
    $('#logoutBtn').on("click", function() {
        //发送ajax请求，进行退出
        $.ajax({
            type: "get",
            url: "/employee/employeeLogout",
            dataType: "json",
            success: function(info) {
                //console.log(info);
                if(info.success) {
                    //退出成功,跳转到登录页
                    location.href = "login.html";
                }
            }
        });
    });
});