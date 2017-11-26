;(function($) {
    $.fn.zoom = function(scale) {
        return this.each(function() {
            var $this = $(this),
                width = $this.css("width").replace("px", ""),
                height = $this.css("height").replace("px", ""),
                ratio = width / height;

            scale = parseFloat(scale) || 0;

            width = width * (1 + scale);
            //height = height * (1 + scale);

            $this.css({
                width: width + "px",
                //height: height + "px",
                maxWidth: "none",
                maxHeight: "none"
            });
        });
    }
})(jQuery);
