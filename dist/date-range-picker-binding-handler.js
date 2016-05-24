'use strict';

var _knockout = require('knockout');

var _knockout2 = _interopRequireDefault(_knockout);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _disposer = require('disposer');

var _disposer2 = _interopRequireDefault(_disposer);

var _i18next = require('i18next');

var _i18next2 = _interopRequireDefault(_i18next);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_knockout2.default.bindingHandlers.daterangePicker = {
    init: function init(element, valueAccessor /*, allBindingsAccessor, viewModel*/) {
        var value = valueAccessor(),
            format = value.format || 'YYYY-MM-DD',
            title = value.title || _i18next2.default.t('koco-date-range-picker-binding-handler.date_interval'),
            startDate = value.startDate(),
            endDate = typeof value.endDate == 'function' ? value.endDate() : null,
            alwaysShowCalendars = value.alwaysShowCalendars || true,
            $element = (0, _jquery2.default)(element),
            $button = (0, _jquery2.default)('<button type="button" class="btn btn-daterange btn-block">' + '<i class="fa fa-calendar"></i>' + ' <span>' + title + '</span> ' + '<b class="caret"></b>' + '</button>'),
            $span = $button.children('span');
        var ranges = {};
        ranges[_i18next2.default.t('koco-date-range-picker-binding-handler.today')] = [(0, _moment2.default)(), (0, _moment2.default)()];
        ranges[_i18next2.default.t('koco-date-range-picker-binding-handler.yesterday')] = [(0, _moment2.default)().subtract(1, 'days'), (0, _moment2.default)().subtract(1, 'days')];
        ranges[_i18next2.default.t('koco-date-range-picker-binding-handler.last_7_days')] = [(0, _moment2.default)().subtract(6, 'days'), (0, _moment2.default)()];
        ranges[_i18next2.default.t('koco-date-range-picker-binding-handler.last_30_days')] = [(0, _moment2.default)().subtract(29, 'days'), (0, _moment2.default)()];
        ranges[_i18next2.default.t('koco-date-range-picker-binding-handler.this_month')] = [(0, _moment2.default)().startOf('month'), (0, _moment2.default)().endOf('month')];
        ranges[_i18next2.default.t('koco-date-range-picker-binding-handler.last_month')] = [(0, _moment2.default)().subtract(1, 'month').startOf('month'), (0, _moment2.default)().subtract(1, 'month').endOf('month')];

        var options = {
            alwaysShowCalendars: alwaysShowCalendars,
            format: format,
            ranges: ranges,
            locale: {
                applyLabel: _i18next2.default.t('koco-date-range-picker-binding-handler.apply'),
                cancelLabel: _i18next2.default.t('koco-date-range-picker-binding-handler.cancel'),
                fromLabel: _i18next2.default.t('koco-date-range-picker-binding-handler.from'),
                toLabel: _i18next2.default.t('koco-date-range-picker-binding-handler.to'),
                weekLabel: _i18next2.default.t('koco-date-range-picker-binding-handler.week_label'),
                customRangeLabel: _i18next2.default.t('koco-date-range-picker-binding-handler.custom_range')
            },
            cancelClass: 'btn-danger',
            buttonClasses: 'btn btn-sm',
            singleDatePicker: value.singleDatePicker || false
        };

        var koDisposer = new _disposer2.default();

        _knockout2.default.utils.domNodeDisposal.addDisposeCallback(element, function () {
            koDisposer.dispose();

            var dateRangePicker = $button.data('daterangepicker');
            if (dateRangePicker) {
                dateRangePicker.remove();
            }
        });

        if (value.filterType && value.filterType.subscribe) {
            koDisposer.add(value.filterType.subscribe(function (newValue) {
                if (!newValue || _jquery2.default.isArray(newValue) && newValue.length === 0) {
                    value.startDate('');
                    value.endDate('');
                }
            }));
        }

        if (startDate) {
            options.startDate = (0, _moment2.default)(startDate, 'YYYY-MM-DD'); //TODO: Humm pas certain qu'on brise pas de quoi !
        }

        if (endDate) {
            options.endDate = (0, _moment2.default)(endDate, 'YYYY-MM-DD'); //TODO: Humm pas certain qu'on recoit dans ce format
        }

        $element.append($button);

        $span.html(getDateTitle(options.startDate, options.endDate, format, title));

        //TODO: Encore de besoin de la classe datepicker-initialized
        $button.addClass('datepicker-initialized').daterangepicker(options, function (start, end) {
            if (start === null || end === null) {
                $span.html(title);
                value.startDate('');
                value.endDate('');
            } else {

                //TODO: Pas de format hardcodé - ça c'est pour l'API qui s'attend a recevoir ce format
                value.startDate(start.format('YYYY-MM-DD'));
                if (value.singleDatePicker) {
                    end = null;
                } else {
                    value.endDate(end.format('YYYY-MM-DD'));
                }
                $span.html(getDateTitle(start, end, format, title));
            }
        });
    }
}; // Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

function getDateTitle(startDate, endDate, format, title) {
    var result = title;

    if (startDate && endDate) {
        result = startDate.format(format) + ' - ' + endDate.format(format);
    }

    if (startDate && !endDate) {
        result = startDate.format(format);
    }

    return result;
}