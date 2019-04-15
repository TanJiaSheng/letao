$(function() {

    render();

    // 功能1：获取地址栏传递过来的搜素关键字, 设置给 input
    var key = getSearch("key");
    // 设置给 input
    $('.search_input').val(key);

    // 根据关键字，进行渲染
    function render() {
        // 一进入也买你, 根据搜素关键字, 发送ajax请求, 进行页面渲染
        $.ajax({
            type: "get",
            url: "/product/queryProduct",
            data: {
                proName: $(".search_input").val(),
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            success: function ( info ) {
                console.log(info);
                var htmlStr = template("productTpl", info);
                $('.lt_product').html(htmlStr);
            }
        });
    }

    // 功能2：点击搜素按钮,实现搜素功能
    $('.search_btn').on("click", function() {
        // 需要将搜素关键字, 追加存储到本地存储中
        var key = $('.search_input').val();
        if ( key.trim() === '') {
            mui.toast("请输入搜素关键字");
            return;
        }

        render();

        // 获取数组
        var history = localStorage.getItem("search_list") || '[]';
        var arr = JSON.parse( history );

        // 1. 删除重复的项
        var index = arr.indexOf( key );
        if( index != -1) {
            //  删除重复的项
            arr.splice( index, 1 );
        }
        // 2. 长度不能超过10
        if ( arr.length >= 10) {
            // 移除最后一项
            arr.pop();
        }
        // 将关键字追加到 arr 最前面
        arr.unshift( key );
        // 转成 json, 存到本地存储中
        localStorage.setItem("search_list", JSON.stringify( arr ));
    });
});