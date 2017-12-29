;(function($) {
    /**
     * 分数运算对象
     * @param  {String} fraction 字符串，1/3
     * @return {Object}          该运算对象
     */
    $.fraction = function(fraction) {
        var arr = fraction.split("/");
        this.numerator = $.trim(arr[0]);
        this.denominator = $.trim(arr[1]);
        return this;
    }

    $.fraction.multiply = function(num) {
        return this.numerator / this.denominator * num;
    }

    $.fraction.devide = function(num, isBe) {
        return isBe ? num / this.numerator * this.denominator : this.numerator / this.denominator / num;
    }
})(jQuery);
