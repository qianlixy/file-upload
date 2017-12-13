;
(function($) {

    var croppingTpl = $("#cropping-tpl").html();

    var DEFAULT = {
        width: "560",
        height: "420",
        doClose: function() {},
        doSelect: function() {},
        doCrop: function() {}
    };

    $.cropping = function(settings) {

        $("body > .cropping-box").remove();

        var opts = $.extend({}, DEFAULT, settings);

        var croppingBox = $(croppingTpl).prependTo("body");

        //初始化宽高
        var virtualSize = initSize.call(croppingBox, opts.width, opts.height);

        // croppingBox.attr("data-virtualW", virtualSize.width).attr("data-virtualH", virtualSize.height);

        //初始化按钮
        initCloseButton.call(croppingBox, opts.doClose);

        //初始化上传按钮
        initSelectButton.call(croppingBox, opts.doSelect);

        //初始化裁剪按钮
        // initCroppingButton.call(croppingBox, opts.doCropping);

        //初始化裁剪图片的拖动缩放事件
        initImageEvent.call(croppingBox);

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
    function initCloseButton(callback) {
        var box = this;
        this.find(".header .close").click(function() {
            if (callback() !== false) {
                box.remove();
            }
        });

    }

    /**
     * 初始化选择图片按钮
     * @param  {Function} callback 回调函数，返回false将阻止选择文件
     * @return {undefined}
     */
    function initSelectButton(callback) {
        var box = this;
        this.find(".footer .select").click(function() {
            $(this).next().click();
        }).next().change(function() {
            if (callback(this) !== false) {
                //支持H5 FileReader
                if (typeof FileReader !== 'undefined') {
                    var fr = new FileReader();
                    fr.readAsDataURL(this.files[0]);
                    fr.onload = function() {
                        initImage.call(box, this.result);
                    };
                } else {
                    //不支持H5 FileReader，需要使用网络地址
                    // FIXME 获取图片的网络地址
                }
            }
        });
    }

    /**
     * 初始化需要裁剪的图片
     * @param  {String} imgUrl 图片地址
     * @return {undefined}
     */
    function initImage(imgUrl) {
        this.find(".img-wrap").replaceWith("<div class='img-wrap'><img></div>");
        var img = this.find("img").hide();
        getImageActualSize(imgUrl, function(width, height) {
            img.attr("data-actualW", width).attr("data-actualH", height);
        });
        img.attr("src", imgUrl).load(function() {
            img.css({
                maxWidth: "100%",
                maxHeight: "100%"
            }).css({
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: img.intCss("height") * -1 / 2,
                marginLeft: img.intCss("width") * -1 / 2
            }).show();
        });
    }

    /**
     * 初始化图片事件，包括拖动、放大、缩小等操作
     * @return {undefined}
     */
    function initImageEvent() {
        var box = this,
            top = 0,
            left = 0;
        box.find(".cover-wrap .center").drag({
            start: function(event) {
                var imgWrap = box.find(".img-wrap");
                imgWrap.attr("data-top", imgWrap.intCss("top"));
                imgWrap.attr("data-left", imgWrap.intCss("left"));
            },
            move: function(event) {
                var imgWrap = box.find(".img-wrap");
                dragImage.call(box, parseInt(imgWrap.attr("data-top")) + event.top - imgWrap.intCss("top"),
                    parseInt(imgWrap.attr("data-left")) + event.left - imgWrap.intCss("left"));
            }
        }).mousewheel(function(event, delta) {
            if (delta > 0) {
                zoomImage.call(box, 0.1);
            } else {
                zoomImage.call(box, -0.1);
            }
            return false;
        }).on("selectstart", function() {
            return false;
        });
    }

    function dragImage(top, left) {
        var imgWrap = this.find(".img-wrap");
        imgWrap.css({
            top: imgWrap.intCss("top") + top,
            left: imgWrap.intCss("left") + left
        });
    }

    function zoomImage(scale) {
        this.find('.img-wrap img').zoom(scale);
    }

    /**
     * 获取图片实际大小
     * @param  {String}   imgUrl   图片地址
     * @param  {Function} callback 获取图片实际大小的回调函数，宽高以参数形式回传
     * @return {undefined}
     */
    function getImageActualSize(imgUrl, callback) {
        var img = new Image();
        img.src = imgUrl;
        img.onload = function() {
            callback(this.width, this.height);
        };
    }
})(jQuery);