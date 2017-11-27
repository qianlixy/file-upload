;(function($) {
    $.fn.zoom = function(settings) {
        var opts = $.extend({scale:0, speed:300},
            ("object" === typeof settings) ? settings :
            {scale : parseFloat(settings)});
        return this.each(function() {
            var $this = $(this),
                top = $this.intCss("top"),
                left = $this.intCss("left"),
                width = $this.intCss("width"),
                height = $this.intCss("height"),
                ratio = height / width,
                incr = opts.scale * opts.speed

            $this.css({
                position: "absolute",
                width: width + incr,
                maxWidth: "none",
                maxHeight: "none",
                top: top - incr / 2,
                left: left - incr / 2 * ratio
            });
        });
    }
})(jQuery);
