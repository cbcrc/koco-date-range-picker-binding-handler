// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

define(['knockout',
        'jquery',
        'moment',
        'disposer',
        'i18next'
    ],
    function(ko, $, moment, KoDisposer, i18n) {
        'use strict';

        ko.bindingHandlers.daterangePicker = {
            init: function(element, valueAccessor /*, allBindingsAccessor, viewModel*/ ) {
                var value = valueAccessor(),
                    format = value.format || 'YYYY-MM-DD',
                    title = value.title || i18n.t('date_range_picker.date_interval'),
                    startDate = value.startDate(),
                    endDate = (typeof value.endDate == 'function') ? value.endDate() : null,
                    alwaysShowCalendars = value.alwaysShowCalendars || true,
                    $element = $(element),
                    $button = $('<button type="button" class="btn btn-daterange btn-block">' +
                        '<i class="fa fa-calendar"></i>' +
                        ' <span>' + title + '</span> ' +
                        '<b class="caret"></b>' +
                        '</button>'),
                    $span = $button.children('span');
                var ranges = {};
                ranges[i18n.t('date_range_picker.today')()] = [moment(), moment()];
                ranges[i18n.t('date_range_picker.yesterday')()] = [moment().subtract(1, 'days'), moment().subtract(1, 'days')];
                ranges[i18n.t('date_range_picker.last_7_days')()] = [moment().subtract(6, 'days'), moment()];
                ranges[i18n.t('date_range_picker.last_30_days')()] = [moment().subtract(29, 'days'), moment()];
                ranges[i18n.t('date_range_picker.this_month')()] = [moment().startOf('month'), moment().endOf('month')];
                ranges[i18n.t('date_range_picker.last_month')()] = [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')];

                var options = {
                        alwaysShowCalendars: alwaysShowCalendars,
                        format: format,
                        ranges: ranges,
                        locale: {
                            applyLabel: i18n.t('date_range_picker.apply'),
                            cancelLabel: i18n.t('date_range_picker.cancel'),
                            fromLabel: i18n.t('date_range_picker.from'),
                            toLabel: i18n.t('date_range_picker.to'),
                            weekLabel: i18n.t('date_range_picker.week_label'),
                            customRangeLabel: i18n.t('date_range_picker.custom_range')
                        },
                        cancelClass: 'btn-danger',
                        buttonClasses: 'btn btn-sm',
                        singleDatePicker: value.singleDatePicker || false
                    };

                var koDisposer = new KoDisposer();

                ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                    koDisposer.dispose();

                    var dateRangePicker = $button.data('daterangepicker');
                    if (dateRangePicker) {
                        dateRangePicker.remove();
                    }
                });

                if (value.filterType && value.filterType.subscribe) {
                    koDisposer.add(value.filterType.subscribe(function(newValue) {
                        if (!newValue || ($.isArray(newValue) && newValue.length === 0)) {
                            value.startDate('');
                            value.endDate('');
                        }
                    }));
                }

                if (startDate) {
                    options.startDate = moment(startDate, 'YYYY-MM-DD'); //TODO: Humm pas certain qu'on brise pas de quoi !
                }

                if (endDate) {
                    options.endDate = moment(endDate, 'YYYY-MM-DD'); //TODO: Humm pas certain qu'on recoit dans ce format
                }

                $element.append($button);

                $span.html(getDateTitle(options.startDate, options.endDate, format, title));

                //TODO: Encore de besoin de la classe datepicker-initialized
                $button.addClass('datepicker-initialized').daterangepicker(options,
                    function(start, end) {
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
                    }
                );
            }
        };

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
    });
