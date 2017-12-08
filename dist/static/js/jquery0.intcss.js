;(function($) {
    $.fn.intCss = function(name) {
        try {
            return parseInt($(this).css(name).replace("px", ""));
        } catch(e) {
            return $(this).css(name);
        }
    }
})(jQuery);
