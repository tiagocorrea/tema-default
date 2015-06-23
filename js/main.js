var store = function () {
    store.adjustRows();
    store.lightBox();
    store.addToCart();
};

store.adjustRows = function () {
    var container = $('#products-list, .products-list'),
        list = $('#products-list li, .products-list li'),
        columns = Math.floor(container.width() / list.width()),
        rows = [],
        row = -1,
        i = -1;

    list.each(function (index, elm) {
        var size;

        i += 1;

        if (i % columns === 0 || i === 0) {
            row += 1;
            rows[row] = {maxHeight: 0, elements: []};
        }

        size = $(elm).height();

        rows[row].maxHeight = (rows[row].maxHeight < size) ? size : rows[row].maxHeight;
        rows[row].elements.push($(elm));
    });

    $.each(rows, function (index, obj) {
        $.each(obj.elements, function (i, elm) {
            elm.height(obj.maxHeight);
        });
    });
};

store.lightBox = function () {
    $('#product-images a').fancybox({
        openEffect: 'none',
        closeEffect: 'none'
    });
};

store.addToCart = function () {
    var elm = $('form[data-hook="add-to-cart"]');

    if (elm.length > 0) {
        elm.on('submit', function (e) {
            var that = $(this),
                input = that.find('input[name=item]'),
                type = input.attr('type'),
                button = that.find('button'),
                variationId;

            if (type === 'radio') {
                variationId = that.find('input[name=item]:checked').val();
            } else {
                variationId = input.val();
            }

            if (typeof variationId === 'undefined') {
                return false;
            }

            Tanlup.addToCart(parseInt(variationId, 10), 1, {
                before: function () {
                    button.attr('disabled', 'disabled');
                    $.fancybox.showLoading();
                },
                after: function (data) {
                    button.removeAttr('disabled');
                    $.fancybox.hideLoading();
                    $.fancybox({content: $('#cart-alert').html()});
                }
            });

            e.preventDefault();
            return false;
        });
    }
};

$(document).ready(function () {
    store();
});