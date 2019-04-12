$(function() {
    // 1.一进入页面发送Ajax 请求， 获取以及分类数据， 进行渲染
    $.ajax({
        type: "get",
        url: "/category/queryTopCategory",
        dataType: "json",
        success: function ( info ) {
            //console.log(info);
            var htmlStr = template("leftTpl", info);
            $('.lt_category_left ul').html(htmlStr);

            // 一进入页面，渲染第一个一级分类对应的二级分类
            renderSecondById(info.rows[0].id);
        }
    });

    // 2. 通过事件委托， 给左边导航注册点击事件
    $(".lt_category_left ul").on("click", "a", function () {
        // 给自己加上 类 current， 移除其他的 current
        $(this).addClass("current").parent().siblings().find("a").removeClass("current");
        // 获取被点击分类id
        var id = $(this).data("id");
        renderSecondById(id);
    });

    //实现一个方法：专门用于根据一级分类 id 去渲染 二级分类
    function renderSecondById (id) {
        //发送ajax请求
        $.ajax({
           type: "get",
           url: "/category/querySecondCategory",
           data: {
               id: id
           },
            dataType: "json",
            success: function ( info) {
                var htmlStr = template("rightTpl", info);
                $('.lt_category_right ul').html(htmlStr);

            }
        });
    }
});