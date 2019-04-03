$(function() {
    var $form = $("#form");
     /*
     * 1. 进行表单校验
     *    校验要求: (1) 用户名不能为空
     *             (2) 密码不能为空, 且必须是 6-12 位
     * */
     //配置的字段和 input 框中指点的 name 关联，所以必须要给 input 加上 name
    $form.bootstrapValidator({
        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',   //检验成功
            invalid: 'glyphicon glyphicon-remove',  //检验失败
            validating: 'glyphicon glyphicon-refresh'   //检验中
        },

        //配置字段
        fields: {
            username: {
                //配置校验规则
                validators: {
                    //非空
                    notEmpty: {
                        //提示信息
                        message: "用户名不能为空"
                    },
                    //长度校验
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: "用户名长度必须为2-6位"
                    },
                    //专门用于配置回调提示的规则
                    callback: {
                        message: "用户名不存在"
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: "密码不能为空"
                    },
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: "密码长度必须为6-12位"
                    },
                    callback: {
                        message: "密码错误"
                    }
                }
            }
        }
    });

    /*
    * 2.登录功能
    *   表单检验插件会在提交表单是进行检验
    *   (1) 检验成功，默认就提交表单，会发生页面跳转，
    *       我们需要注册表单检验成功事件，阻止默认的提交，通过ajax进行发送请求
    *   (2) 检验失败，不会提交表单，配置插件提示用户即可
    * */
    //注册表单检验成功事件
    $form.on("success.form.bv", function (e) {
        //阻止默认的表单提交
        e.preventDefault();

        //console.log("检验成功后的 表单提交 被阻止");

        //通过ajax进行提交
        $.ajax({
            type: "post",
            url: "/employee/employeeLogin",
            data: $("#form").serialize(),
            dataType: "json",
            success:function (info) {
                if(info.success) {
                    //登录成功，跳转到首页
                    location.href = "index.html";
                }
                if(info.error === 1000) {
                    //alert(info.message);
                    //updateStatus 更新检验状态
                    //1. 字段名称
                    //2. 检验状态 VALID, INVALID, NOT_VALIDATED未校验的, VALIDATING校验中的
                    //3. 校验规则，用于指定提示文本
                    $form.data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
                }
                if(info.error === 1001) {
                    //alert(info.message);
                    $form.data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
                }
            }
        });
    });

    /*
    * 3.重置功能
    * */
    $('[type="reset"]').click(function () {
       //调用插件的方法，进行重置检验状态
        //resetForm
        //传true，重置内容以及检验状态
        //传false， 只重置检验转态
        $form.data("bootstrapValidator").resetForm(true);
    });
});