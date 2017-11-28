;(function($) {
    $.fn.zoom = function(settings) {
        var opts = $.extend({scale:0, speed:300}, ("object" === typeof settings) ? settings : {scale : parseFloat(settings)});
        return this.each(function() {
            var $this = $(this);

            if(!$this.data("width")) {
                var width = $this.intCss("width"),
                    height = $this.intCss("height"),
                    ratio = height / width;
                $this.data("width", width)
                    .data("height", height)
                    .data("ratio", height / width)
                    .data("top", $this.intCss("top"))
                    .data("left", $this.intCss("left"))
                    .data("scale", opts.scale);
            } else {
                // if($this.intCss("width") <= 0 && opts.scale < 0) {
                //     return;
                // }
                $this.data("scale", $this.data("scale") + opts.scale);
            }

            var incr = $this.data("scale") * opts.speed;

            $this.css({
                position: "absolute",
                width: $this.data("width") + incr,
                maxWidth: "none",
                maxHeight: "none",
                top: $this.data("top") - parseInt(incr / 2 * $this.data("ratio")),
                left: $this.data("left") - incr / 2
            });

            $this.attr("width", $this.intCss("width"))
                .attr("height", $this.intCss("height"));
        });
    }
})(jQuery);
