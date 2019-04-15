$(function() {
    // 一进入也买你, 根据搜素关键字, 发送ajax请求, 进行页面渲染
    render();

    // 功能1：获取地址栏传递过来的搜素关键字, 设置给 input
    var key = getSearch("key");
    // 设置给 input
    $('.search_input').val(key);


    // 根据关键字，进行渲染
    function render() {
        // 准备请求数据, 渲染时, 显示加载中的效果
        $('.lt_product').html('<div class="loading"></div>');
        var params = {};
        // 三个必传的参数
        params.proName = $(".search_input").val();
        params.page = 1;
        params.pageSize = 100;
        // 两个可传 可不传的参数
        // (1) 需要根据高亮的 a 来判断传那个参数,
        // (2) 通过箭头判断, 升序还是降序
        // 价格 price  1升序, 2降序
        // 库存 num    1升序, 2降序
         var $current = $('.lt_sort a.current');
         if ( $current.length > 0) {
             // 有高亮的 a, 说明需要排序
             // 获取传给后台的键
             var sortName = $current.data("type");
             // 获取传给后台的值, 通过箭头方向判断
             var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;

             //添加到 params 中
             params[ sortName ] = sortValue;
         }
         setTimeout(function () {
             $.ajax({
                 type: "get",
                 url: "/product/queryProduct",
                 data: params,
                 dataType: "json",
                 success: function ( info ) {
                     console.log(info);
                     var htmlStr = template("productTpl", info);
                     $('.lt_product').html(htmlStr);
                 }
             });
         }, 500);
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

    // 功能3：排序功能
    // 通过属性选择器给价格和库存添加点击事件
    // (1) 如果自己当前有 current 类, 切换箭头的方向即可
    // (2) 如果自己没有 current 类, 给自己加上 current 类, 并移除兄弟的元素 current
    $('.lt_sort a[data-type]').on("click", function() {
        if ( $(this).hasClass("current") ) {
            // 有 current 类, 切换箭头即可
            $(this).find("i").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
        }
        else {
            // 没有 current 类, 自己加上 current 类, 移除兄弟元素的 current
            $(this).addClass("current").siblings().removeClass("current");
        }

        // 页面重新渲染, 因为所有的参数都在render中实时获取并且处理好了, 只需要调用 render
        render();
    });
});