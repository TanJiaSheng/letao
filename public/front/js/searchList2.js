$(function(){
    var currentPage = 1; // 当前页
    var pageSize = 2;    // 每页多少条

    // 功能1：获地址栏参数赋值给 input
    var key = getSearch("key");
    $('.search_input').val( key );
    //render();

    // 整个页面的核心方法: render
    // 在render 方法中, 处理了所有的参数
    function render( callback ) {

        // $('.lt_product').html('<div class="loading"></div>');

        var params = {};
        // 1. 必传的 3 个参数
        params.proName = $('.search_input').val().trim();
        params.page = currentPage;
        params.pageSize = pageSize;
        // 2. 可传可不传的参数
        //    (1) 通过判断有没有高亮元素, 决定是否需要排序
        //    (2) 通过箭头方向来判断, 降序还时升序
        var $current = $('.lt_sort a.current');
        if ( $current.length > 0) {
            // 有高亮的, 需要排序
            var sortName = $current.data("type");
            var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;
            params[ sortName ] = sortValue;
        }

        setTimeout(function () {
            $.ajax({
                type: "get",
                url: "/product/queryProduct",
                data: params,
                dataType: "json",
                success: function ( info ) {
                    // 真正拿到数据后执行的操作, 通过callback函数传进来了
                    callback && callback( info );
                }
            });
        }, 500);
    }
    // 配置下拉刷新和上拉加载注意点：
    // 下拉刷新是对原有数据的覆盖, 执行的是 html 方法
    // 上拉加载是在原有的基础上进行追加, 追加到后面, 执行的是 append 方法

    mui.init({
        // 配置 pullRefresh
        pullRefresh : {
            container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            // 配置下拉菜单
            down : {
                // 配置一进入, 就自动下拉刷新一次
                auto: true,
                callback : function() {
                    // 加载第一页数据
                    currentPage = 1;
                    // 发送ajax请求, 进行页面渲染
                    // 拿到数据后, 需要执行的方法是不一样的, 所以通过函数回调的方式, 传进去
                    render(function ( info ) {
                        var htmlStr = template("productTpl", info);
                        $('.lt_product').html(htmlStr);

                        // ajax 回来之后, 需要结束下拉刷新, 让内容回滚顶部
                        // 注意：api 做了更新, mui文档还没更新上
                        //      要使用原型上的 endPulldownToRefresh 方法来结束下拉刷新
                        mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();

                        // 第一页数据被重新加载之后, 又有数据可以进行上拉加载了, 需要启用上拉加载 enablePullupToRefresh()
                        mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
                    });
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
             },
            // // 配置上啦加载
            up : {
                callback: function () {
                    // 需要加载下一页的数据, 更新当前页
                    currentPage ++;
                    render(function ( info ) {
                        var htmlStr = template("productTpl", info);
                        $('.lt_product').append(htmlStr);

                        // 当数据回来之后, 需要结束上拉加载
                        // endPullupToRefresh(boolean) 结束上拉加载//
                        // 1. 如果传 true, 没有更多数据, 会显示提示语句, 会自动禁用上拉加载, 防止发送无效的 ajax
                        // 2. 如果传 false, 还有更多数据
                        if ( info.data.length === 0) {
                            // 没有更多数据了, 显示提示语句
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh( true );
                        }
                        else {
                            // 还有数据, 正常结束上拉加载
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh( false );
                        }
                    });
                }
            }
        }
    });


    // 功能2：点击搜索那妞，实现搜索功能
    $('.search_btn').click(function() {
        var key = $('.search_input').val(); // 获取搜索关键字
        if ( key.trim() === '') {
            mui.toast("请输入搜索关键字", {
                duration: 2000
            });
            return;
        }

        // 执行一次下拉刷新即可, 在下拉刷新回调中, 会进行页面渲染
        // 调用 pulldownLoading 方法执行下拉
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();

        // 有搜索内容
        var history = localStorage.getItem("search_list") || '[]';
        var arr = JSON.parse( history );
        var index = arr.indexOf( key );
        // 要求:
        // 1. 不能重复
        if( index != -1){
            arr.splice( index, 1);
        }
        // 2. 不能超过 10
        if( arr.length >= 10) {
            arr.pop();
        }
        // 往数组最前面追加
        arr.unshift( key );
        // 转成 json, 存到本地
        localStorage.setItem("search_list", JSON.stringify( arr ));
    });

    // 功能3：添加排序功能(点击切换类)

    // mui 认为在下拉刷新和上拉加载容器中, 使用 click 会有 300ms延迟, 性能方面不足
    // 禁用了默认的 a 标签的 click 事件, 需要绑定 tap 事件
    $('.lt_sort a[data-type]').on("tap", function () {
        if ($(this).hasClass("current") ) {
            // 切换箭头方向
            $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
        }
        else {
            // 没有 current, 给自己加上, 排他
            $(this).addClass("current").siblings().removeClass("current");
        }
        // 执行一次下拉刷新即可
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    });


    // 功能4： 点击每个商品实现也买你跳转, 注册点击事件, 通过事件委托注册, 注册 tap 事件
    $('.lt_product').on("tap", "a", function() {
        location.href = $(this).attr("href");
    })
});