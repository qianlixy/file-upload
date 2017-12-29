;(function($) {
    $.fn.intCss = function(name) {
        try {
            return parseFloat($(this).css(name).replace("px", ""));
        } catch(e) {
            return $(this).css(name);
        }
    }
})(jQuery);
