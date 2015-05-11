// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

define([
        'knockout',
        'jquery',
        'moment',
        'knockout-disposer'
    ],
    function(ko, $, moment, KoDisposer) {
        'use strict';

        ko.bindingHandlers.daterangePicker = {
            init: function(element, valueAccessor /*, allBindingsAccessor, viewModel*/ ) {
                var value = valueAccessor(),
                    format = value.format || 'YYYY-MM-DD',
                    title = value.title || 'Intervalle de dates',
                    startDate = value.startDate(),
                    endDate = value.endDate(),
                    alwaysShowCalendars = value.alwaysShowCalendars || true,
                    $element = $(element),
                    $button = $('<button type="button" class="btn btn-daterange btn-block">' +
                        '<i class="fa fa-calendar"></i>' +
                        ' <span>' + title + '</span> ' +
                        '<b class="caret"></b>' +
                        '</button>'),
                    $span = $button.children('span'),
                    options = {
                        alwaysShowCalendars: alwaysShowCalendars,
                        format: format,
                        ranges: {
                            'Aujourd\'hui': [moment(), moment()],
                            'Hier': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                            'Derniers 7 jours': [moment().subtract(6, 'days'), moment()],
                            'Derniers 30 jours': [moment().subtract(29, 'days'), moment()],
                            'Ce mois-ci': [moment().startOf('month'), moment().endOf('month')],
                            'Le mois passé': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                        },
                        locale: {
                            applyLabel: 'Appliquer',
                            cancelLabel: 'Supprimer',
                            fromLabel: 'Du',
                            toLabel: 'Au',
                            weekLabel: 'W',
                            customRangeLabel: 'Autre'
                        },
                        cancelClass: 'btn-danger',
                        buttonClasses: 'btn btn-sm'
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
                            $span.html(getDateTitle(start, end, format, title));
                            value.startDate();

                            //TODO: Pas de format hardcodé - ça c'est pour l'API qui s'attend a recevoir ce format
                            value.startDate(start.format('YYYY-MM-DD'));
                            value.endDate(end.format('YYYY-MM-DD'));
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

            return result;
        }
    });
