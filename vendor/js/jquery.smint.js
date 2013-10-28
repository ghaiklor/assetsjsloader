(function () {
    $.fn.smint = function () {
        var self = this;
        var scrollSpeed = 500;
        return $(this).find('li').find('a').each(function () {
            var id = $(this).attr("href");
            $(this).on('click', function (e) {
                e.preventDefault();
                var selectorHeight = $(self).height();
                var goTo = $(id).offset().top - selectorHeight;
                $('html, body').animate({
                    scrollTop: goTo
                }, scrollSpeed);
            });
        });
    }
})();