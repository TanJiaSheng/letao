//对所有页面的滚动初始化
mui('.mui-scroll-wrapper').scroll({
    indicators: false, //是否显示滚动条
    deceleration: 0.0005 ////阻尼系数,系数越小滑动越灵敏
});

// 配置轮播图自动轮播

//获得slider插件对象
var gallery = mui('.mui-slider');
gallery.slider({
    interval:5000//自动轮播周期，若为0则不自动播放，默认为0
});

// 作用：专门用于解析地址兰参数
function getSearch( k ) {
    // 获取地址栏参数
    var search = location.search;

    // 将其解码的中文
    search = decodeURI( search );

    // 去掉问号
    search = search.slice(1);

    // 通过 & 分割成数组
    var arr = search.split("&");

    var obj = {};
    arr.forEach(function (v, i) { // v 表示每箱 "name=tt"
        var key = v.split("=")[0];
        var value = v.split("=")[1];
        obj[ key ] = value;
    });

    return obj[k];
}