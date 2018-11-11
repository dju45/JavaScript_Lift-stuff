'use strict';

(function (window, $) {
    window.RepLogApp = function (wrapper) {
        this.wrapper = wrapper;
        this.helper = new Helper(this.wrapper);

        this.wrapper.on('click', '.js-delete-rep', this.handleRepLogDelete.bind(this));
        this.wrapper.on('click','tbody tr', this.handleRowClick.bind(this));
        this.wrapper.on('submit', '.js-new-rep-log-form', this.handleNewFormSubmit.bind(this));
    };

    $.extend(window.RepLogApp.prototype, {
        updateTotalWeightLifted: function () {
            this.wrapper.find('.js-total-weight').html(
                this.helper.calculateTotalWeight()
            );
        },

        handleRepLogDelete: function (e) {
            e.preventDefault();

            let link = $(e.currentTarget);
            link.addClass('text-danger');
            link.find('.fa')
                .removeClass('fa-trash')
                .addClass('fa-spinner')
                .addClass('fa-spin');

            let deleteUrl = link.data('url');
            let row = link.closest('tr');
            let self = this;
            $.ajax({
                url: deleteUrl,
                method: 'DELETE',
                success: function () {
                    row.fadeOut('normal', function () {
                        $(this).remove();
                        self.updateTotalWeightLifted();
                    });
                }
            });
        },

        handleRowClick: function () {
            console.log('row clicked');
        },

        handleNewFormSubmit: function (e) {
            e.preventDefault();

            let form = $(e.currentTarget);
            let tbody = this.wrapper.find('tbody');
            let self = this;

            $.ajax({
                url: form.attr('action'),
                method: 'POST',
                data: form.serialize(),
                success: function (data) {
                    tbody.append(data);
                    self.updateTotalWeightLifted();
                },
                error: function(jsXHR) {
                    form.closest('.js-new-rep-log-form-wrapper').html(jsXHR.responseText);
                }

            });
        }

    });

    let Helper = function (wrapper) {
        this.wrapper = wrapper;
    };

    $.extend(Helper.prototype, {
        calculateTotalWeight: function () {
            let totalWeight = 0;
            this.wrapper.find('tbody tr').each(function () {
                totalWeight += $(this).data('weight');
            });

            return totalWeight;
        },
    });

})(window, jQuery);