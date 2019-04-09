$(function() {
    /**
     * 1. 引包
     * 2. 准备具备宽高的容器
     * 3. 复制粘贴，进行初始化
     * */

    // 基于准备好的dom，初始化echarts实例
    var myChart1 = echarts.init(document.querySelector('.echarts_1'));

    // 指定图表的配置项和数据
    var option1 = {
        //大标题
        title: {
            //标题文本
            text: '2018年注册人数'
        },
        //提示框组件
        tooltip: {},
        //图例
        legend: {
            data:['人数']
        },
        //X轴刻度
        xAxis: {
            data: ["1月","2月","3月","4月","5月","6月"]
        },
        //Y轴刻度，注意y轴的刻度应该根据数据动态生成
        yAxis: {},
        series: [{
            name: '人数',
            // type line 折线图 , pie 饼状图 , bar 柱状图
            type: 'bar',
            data: [1500, 2800, 2000, 1400, 800, 2500]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart1.setOption(option1);

    var myChart2 = echarts.init(document.querySelector('.echarts_2'));
    var option2 = {
        //大标题
        title : {
            text: '热门品牌销售',
            //副标题
            subtext: '2018年6月',
            //文本居中
            x:'center'
        },
        //提示框组件
        tooltip : {
            trigger: 'item',
            //{a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        // 图例
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['耐克','阿迪达斯','新百伦','李宁','阿迪王']
        },
        series : [
            {
                name: '品牌',
                type: 'pie',
                //配置直径，占容器大百分比
                radius : '55%',
                //配置圆心位置
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'耐克'},
                    {value:310, name:'阿迪达斯'},
                    {value:234, name:'新百伦'},
                    {value:135, name:'李宁'},
                    {value:1200, name:'阿迪王'}
                ],
                //添加阴影效果
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart2.setOption(option2);
});