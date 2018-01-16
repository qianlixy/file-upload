;(function($) {
    $.fn.drag = function(settings) {
        return this.each(function() {

            var $this = $(this),
                opts = $.extend({
                    context: $this,
                    start: function(event) {},
                    move: function(event) {}
                }, settings),
                result = {
                    pointX: 0,
                    pointY: 0,
                    top: 0,
                    left: 0
                },
                isDrag = false;

            $this.on("mousedown", function(e) {
                isDrag = true;
                result.pointX = e.offsetX;
                result.pointY = e.offsetY;
                result.top = result.left = 0;
                opts.start.call(opts.context, result);
            }).on("mousemove", function(e) {
                if (!isDrag) {
                    return false;
                }
                result.top = e.offsetY - result.pointY;
                result.left = e.offsetX - result.pointX;
                opts.move.call(opts.context, result);
            }).on("mouseup mouseout", function(e) {
                isDrag = false;
            });
        });
    };
})(jQuery);
