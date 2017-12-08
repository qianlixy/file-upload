;(function($) {

    var croppingTpl = $("#cropping-tpl").html();

    var DEFAULT = {
        width: "560",
        height: "420",
        doClose: function() {}
    };

    $.cropping = function(settings) {

        $("body > .cropping-box").remove();

        var opts = $.extend({}, DEFAULT, settings);

        var croppingBox = $(croppingTpl).prependTo("body");

        //初始化宽高
        var virtualSize = initSize.call(croppingBox, opts.width, opts.height);

        //初始化按钮
        initWinButton.call(croppingBox, opts.doClose);

    };

    /**
     * 初始化裁剪框裁剪尺寸
     * @param  {Number} width       裁剪宽度
     * @param  {Number} height      裁剪高度
     * @return {Object}             虚拟宽高
     */
    function initSize(width, height) {
        var boxW = this.width(),
            boxH = this.height(),
            defaultRatio = DEFAULT.width / DEFAULT.height,
            ratio = width / height,
            virtualW = width < DEFAULT.width ? width : (defaultRatio >= ratio ? DEFAULT.height * ratio : DEFAULT.width),
            virtualH = height < DEFAULT.height ? height : (defaultRatio >= ratio ? DEFAULT.height : DEFAULT.width / ratio);

        this.find(".cover.top, .cover.bottom").css("height", (boxH - virtualH) / 2);
        this.find(".cover.left, .cover.right").css({
            "width": (boxW - virtualW) / 2,
            height: virtualH
        });
        this.find(".center").css({
            width: virtualW,
            height: virtualH
        });

        return {
            width: virtualW,
            height: virtualH
        };
    }

    /**
     * 初始化裁剪框窗口操作等按钮。最大化、还原、关闭。
     * @param  {Function} callback 关闭按钮点击回调。返回false阻止关闭
     */
    function initWinButton(callback) {}

})(jQuery);
