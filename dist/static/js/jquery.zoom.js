;(function($) {
    $.fn.zoom = function(_scale, isClear) {
        return this.each(function() {
            var $this = $(this);
            if(($this.intCss("width") <=0  || $this.intCss("height") <= 0) && _scale < 0) {
                return ;
            }

            if(!$this.attr("data-width") || isClear) {
                $this.attr("data-width", $this.intCss("width"));
                $this.attr("data-height", $this.intCss("height"));
                $this.attr("data-top", $this.intCss("top"));
                $this.attr("data-left", $this.intCss("left"));
                $this.attr("data-scale", 1);
            }
            var scale = Number($this.attr("data-scale")) + _scale;
            $this.attr("data-scale", scale.toFixed(2));

            var width = $this.attr("data-width");
            var height = $this.attr("data-height");

            var ratio = height / width;
            var incr = width * scale - width;

            $this.css({
                position: "absolute",
                width: width * scale,
                maxWidth: "none",
                maxHeight: "none",
                top: $this.attr("data-top") - parseInt(incr / 2 * ratio),
                left: $this.attr("data-left") - incr / 2
            });
        });
    };
})(jQuery);
