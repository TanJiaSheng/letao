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
})