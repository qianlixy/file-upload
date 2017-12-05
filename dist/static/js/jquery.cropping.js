!(function($) {

    function uniqueId() {
        return new Date().getTime() + "-" + parseInt(Math.random() * 10000);
    }

    var boxTpl =
        '<div class="cropping-box">' +
            '<div class="img-wrap"><img></div>' +
            '<div class="cover-wrap">' +
                '<div class="cover top"></div>' +
                '<div class="cover left"></div>' +
                '<div class="center">' +
                    '<div class="border border-top"></div>' +
                    '<div class="border border-left"></div>' +
                    '<div class="border border-right"></div>' +
                    '<div class="border border-bottom"></div>' +
                '</div>' +
                '<div class="cover right"></div>' +
                '<div class="cover bottom"></div>' +
            '</div>' +
        '</div>';

    var DEFAULT = {
        width: 480,
        height: 290,
        getImgUrl: function(fileEle) {}
    }

    var croppingBox = {
        get:function(fileId) {
            var box = $("div.cropping-box[htmlfor=" + fileId + "]");
            if(box.length) {
                this._box = box;
                this._opts = box.data("croppingOpts");
                return this;
            }
            return null;
        },
        create:function(opts, fileId) {
            this._box = $(boxTpl).hide().attr("htmlfor", fileId).prependTo("body");
            this._box.find(".center").drag({
                context: this._box.find(".img-wrap"),
                start: function(event) {
                    this.attr("data-top", this.intCss("top"));
                    this.attr("data-left", this.intCss("left"));
                },
                move: function(event) {
                    this.css({
                        top: parseInt(this.attr("data-top")) + event.top,
                        left: parseInt(this.attr("data-left")) + event.left
                    });
                }
            }).mousewheel(function(event, delta) {
                if(delta > 0) {
                    $('div.img-wrap img').zoom(0.1);
                } else {
                    $('div.img-wrap img').zoom(-0.1);
                }
                return false;
            }).on("selectstart", function() {return false;});
            this._initSize(opts.width, opts.height);
            this._opts = opts;
            this._box.data("croppingOpts", opts);
            return this;
        },
        setFileElement:function(file) {
            var imgUrl;
            if(typeof FileReader == 'undefined') {
                imgUrl = this._opts.getImgUrl(file);
                if(!imgUrl) {
                    alert($.cropping.messages.notSupportFileReader);
                    return;
                } else {
                    this._initImg(imgUrl);
                }
            } else {
                var fr = new FileReader, _this = this;
                fr.readAsDataURL(file.files[0]);
                fr.onload = function() {
                    _this._initImg(this.result);
                }
            }
            return this;
        },
        showOkBtn:function() {},
        showCancelBtn:function() {},
        showOperateMenu:function(callback) {},
        show:function() {
            this._box.show();
        },
        _initImg:function(imgUrl) {
            var img = this._box.find(".img-wrap img");
            img.removeAttr("width")
                .removeAttr("height")
                .removeAttr("style")
                .hide();
            img.attr("src", imgUrl).load(function() {
                img.attr("data-initW", this.width)
                .attr("data-initH", this.height)
                .css({maxWidth: "100%",maxHeight: "100%"})
                .css({position:"absolute",
                    top:"50%",
                    left:"50%",
                    marginTop:-img.intCss("height")/2,
                    marginLeft:-img.intCss("width")/2})
                .show()
                .parent().removeAttr("style");
                if(img.is("[data-scale]")) {
                    img.zoom(0, true);
                }
            });
        },
        _initSize:function(_width, _height) {
            var boxW = this._box.intCss("width"),
            boxH = this._box.intCss("height");
            if(_width < boxW && _height < boxH) {
                this._box.find(".cover.top,.cover.bottom").css("height", (boxH - _height) / 2);
                this._box.find(".cover.left,.cover.right").css({"width": (boxW - _width) / 2, height: _height});
                this._box.find(".center").css({width:_width, height:_height});
            }
        }
    }

    $.fn.cropping = function(settings) {
        var opts = $.extend({}, DEFAULT, settings);
        return this.each(function() {
            var $this = $(this);
            var fileId = $this.attr("id");
            if(!fileId) {
                this.id = fileId = "cropping-" + uniqueId();
            }

            croppingBox.create(opts, fileId);
            $this.on("change", function() {
                croppingBox.get(fileId).setFileElement(this).show();
            });
        });
    }

    $.cropping = {}

    $.cropping.messages = {
        notSupportFileReader:"该浏览器不支持图片裁剪功能"
    }
})(jQuery);
