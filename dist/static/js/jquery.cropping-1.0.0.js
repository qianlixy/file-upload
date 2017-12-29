;(function($) {

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
        initCenterSize.call(croppingBox, opts.width, opts.height);

        //初始化按钮
        initCloseButton.call(croppingBox, opts.doClose);

        //初始化上传按钮
        initSelectButton.call(croppingBox, opts.doSelect);

        //初始化裁剪按钮
        initCroppingButton.call(croppingBox);

        //初始化裁剪图片的拖动缩放事件
        initImageEvent.call(croppingBox);

    };

    /**
     * 初始化裁剪框裁剪尺寸
     * @param  {Number} width       裁剪宽度
     * @param  {Number} height      裁剪高度
     */
    function initCenterSize(width, height) {
        var boxW = this.width(),
            boxH = this.height(),
            defaultRatio = DEFAULT.width / DEFAULT.height,
            ratio = width / height,
            actualW = width < DEFAULT.width ? width : (defaultRatio >= ratio ? DEFAULT.height * ratio : DEFAULT.width),
            actualH = height < DEFAULT.height ? height : (defaultRatio >= ratio ? DEFAULT.height : DEFAULT.width / ratio);

        actualW = parseInt(actualW);
        actualH = parseInt(actualH);

        this.find(".cover.top, .cover.bottom").css('height', (boxH - actualH) / 2);
        this.find(".cover.left, .cover.right").css({'width': (boxW - actualW) / 2, 'height': actualH});
        this.find(".center")
            .css({'width': actualW, 'height': actualH})
            .attr('data-vw', width)
            .attr('data-vh', height)
            .attr('data-wr', actualW / width)
            .attr('data-hr', actualH / height);
    }

    /**
     * 初始化裁剪框窗口操作等按钮。最大化、还原、关闭。
     * @param  {Function} callback 关闭按钮点击回调。返回false阻止关闭
     */
    function initCloseButton(callback) {
        var box = this;
        this.find(".header .close").click(function() {
            closeWindow.call(box, callback);
        });
    }

    function closeWindow(callback) {
        if ((callback || function(){}).call() !== false) {
            this.remove();
        }
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
     */
    function initImage(imgUrl, actVirRatio) {
        this.find(".img-wrap").replaceWith("<div class='img-wrap'><img></div>");
        var img = this.find("img").hide();
        var center = this.find(".cover-wrap .center");
        getImageActualSize(imgUrl, function(width, height) {
            img.attr("data-actualW", width).attr("data-actualH", height);
            var virtualW = center.attr("data-vw");
            var virtualH = center.attr("data-vh");
            var imgW = center.intCss('width') / (virtualW / width), imgH = center.intCss('height') / (virtualH / height);
            console.log({imgW: imgW,imgH: imgH});

            img.attr("src", imgUrl).load(function() {
                img.css({
                    position: "absolute",
                    maxWidth: imgW,
                    maxHeight: imgH,
                    top: "50%",
                    left: "50%",
                    marginTop: imgH * -1 / 2,
                    marginLeft: imgW * -1 / 2
                }).show();
            });
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

    /**
     * 初始化裁剪按钮
     */
    function initCroppingButton() {
        var box = this;
        box.find(".btn.cropping").click(function() {
            var img = box.find(".img-wrap img");
            var center = box.find(".cover-wrap .center");
            var imgW = img[0].width;
            var imgH = img[0].height;
            var imgTop = img.intCss("top") + img.intCss("marginTop") + (img.parent().intCss("top") || 0);
            var imgLeft = img.intCss("left") + img.intCss("marginLeft") + (img.parent().intCss("left") || 0);
            var winTop = box.find("div.cover.top").intCss("height");
            var winLeft = box.find("div.cover.left").intCss("width");
            var imgX = winLeft - imgLeft;
            var imgY = winTop - imgTop;
            var width = center.attr("data-vw");
            var height = center.attr("data-vh");

            var size = {
                initW: imgW / center.intCss('width') * width,
                initH: imgH / center.intCss('height') * height,
                x: imgX / center.intCss('width') * width,
                y: imgY / center.intCss('height') * height,
                w: width,
                h: height,
                finalW: width,
                finalH: height
            };

            console.log(size);

            var canvas = $("<canvas>").css("border",'solid 1px #ccc').appendTo("body")[0];
            var ctx = canvas.getContext("2d");
            // ctx.fillStyle = "#fff";
            // ctx.fillRect(0, 0, 350, 350);

            //将图片填充到宽高等于图片宽高的canvas中
            canvas.width = size.initW;
            canvas.height = size.initH;
            ctx.drawImage(img[0], 0, 0, size.initW, size.initH);

            var imgData = ctx.getImageData(size.x, size.y, size.w, size.h);

            canvas.width = size.finalW;
            canvas.height = size.finalH;

            ctx.putImageData(imgData, 0, 0);

            closeWindow.call(box);
        });
    }

    /**
     * 拖动图片
     * @param  {int} top  Y轴上拖动的距离
     * @param  {int} left X轴上拖动的距离
     * @return {undefined}
     */
    function dragImage(top, left) {
        var imgWrap = this.find(".img-wrap");
        imgWrap.css({
            top: imgWrap.intCss("top") + top,
            left: imgWrap.intCss("left") + left
        });
    }

    /**
     * 缩放图片
     * @param  {float} scale 缩放比例，0 ~ 1之间取值
     * @return {undefined}
     */
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
