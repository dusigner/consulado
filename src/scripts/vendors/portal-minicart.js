(function() {
    var Minicart,
        __bind = function(fn, me) {
            return function() {
                return fn.apply(me, arguments);
            };
        },
        __slice = [].slice;

    Minicart = (function() {
        var formatDate, formatMoment,
            _this = this;

        function Minicart(element, options) {
            var _this = this;
            this.element = element;
            this.options = options;
            this.getAvailabilityMessage = __bind(this.getAvailabilityMessage, this);
            this.getAvailabilityCode = __bind(this.getAvailabilityCode, this);
            this.deleteItem = __bind(this.deleteItem, this);
            this.slide = __bind(this.slide, this);
            this.render = __bind(this.render, this);
            this.prepareCart = __bind(this.prepareCart, this);
            this.sendShippingDataAttachment = __bind(this.sendShippingDataAttachment, this);
            this.prepareDeliveryOptionsSelectors = __bind(this.prepareDeliveryOptionsSelectors, this);
            this.setDeliveryOptionsSelectorsState = __bind(this.setDeliveryOptionsSelectorsState, this);
            this.setTimetablesSelectorOptions = __bind(this.setTimetablesSelectorOptions, this);
            this.setupMinicart = __bind(this.setupMinicart, this);
            this.handleOrderForm = __bind(this.handleOrderForm, this);
            this.updateCart = __bind(this.updateCart, this);
            this.bindEvents = __bind(this.bindEvents, this);
            this.getOrderFormUpdateURL = __bind(this.getOrderFormUpdateURL, this);
            this.getOrderFormURL = __bind(this.getOrderFormURL, this);
            this.startHelpers = __bind(this.startHelpers, this);
            this.EXPECTED_ORDER_FORM_SECTIONS = ["items", "paymentData", "totalizers", "shippingData", "sellers"];
            this.hoverContext = this.element.add('.show-minicart-on-hover');
            this.cartData = {};
            this.base = $('.minicartListBase').remove();
            this.select = {
                amountProducts: function() {
                    return $('.amount-products-em', _this.element);
                },
                amountItems: function() {
                    return $('.amount-items-em', _this.element);
                },
                totalCart: function() {
                    return $('.total-cart-em', _this.element);
                }
            };
            this.startHelpers();
            this.bindEvents();
            this.updateCart(false);
            $(window).trigger("minicartLoaded");
        }

        Minicart.prototype.startHelpers = function() {
            dust.helpers.formatDate = function(chunk, context, bodies, params) {
                var timestamp;
                timestamp = params.date;
                return chunk.write(formatDate(timestamp));
            };
            dust.helpers.formatMoment = function(chunk, context, bodies, params) {
                var timestamp;
                timestamp = params.date;
                return chunk.write(formatMoment(timestamp));
            };
            return dust.helpers.cond_write = function(chunk, context, bodies, params) {
                if (params.key === params.value) {
                    return bodies.block(chunk, context);
                } else {
                    return bodies["else"](chunk, context);
                }
            };
        };

        formatMoment = function(timestamp) {
            var date, hour, minutes, moment, momentArray, utcDate;
            date = new Date(timestamp);
            utcDate = date.toUTCString();
            moment = utcDate.match(/\d\d:\d\d:\d\d/)[0];
            momentArray = moment.split(':');
            hour = momentArray[0];
            minutes = momentArray[1];
            return "" + hour + ":" + minutes;
        };

        formatDate = function(timestamp) {
            var date, dateInfo, day, month, monthsTranslationMap, ptMonth, ptWeekDay, weekDay, weekDaysTranslationMap, year;
            weekDaysTranslationMap = {
                "Sun": "Domingo",
                "Mon": "Segunda-feira",
                "Tue": "Terça-feira",
                "Wed": "Quarta-feira",
                "Thu": "Quinta-feira",
                "Fri": "Sexta-feira",
                "Sat": "Sábado"
            };
            monthsTranslationMap = {
                "Jan": "Janeiro",
                "Feb": "Fevereiro",
                "Mar": "Março",
                "Apr": "Abril",
                "May": "Maio",
                "Jun": "Junho",
                "Jul": "Julho",
                "Aug": "Agosto",
                "Sep": "Setembro",
                "Oct": "Outubro",
                "Nov": "Novembro",
                "Dec": "Dezembro"
            };
            date = new Date(timestamp);
            dateInfo = date.toString().split(' ');
            weekDay = dateInfo[0];
            ptWeekDay = weekDaysTranslationMap[weekDay];
            month = dateInfo[1];
            ptMonth = monthsTranslationMap[month];
            day = dateInfo[2];
            year = dateInfo[3];
            return "" + ptWeekDay + ", " + day + " de " + ptMonth + " de " + year;
        };

        Minicart.prototype.getOrderFormURL = function() {
            return this.options.orderFormURL;
        };

        Minicart.prototype.getOrderFormUpdateURL = function() {
            return this.getOrderFormURL() + this.cartData.orderFormId + "/items/update/";
        };

        Minicart.prototype.bindEvents = function() {
            var _this = this;
            this.hoverContext.on('mouseover', function() {
                $(window).trigger("minicartMouseOver");
                _this.element.trigger('vtex.minicart.mouseOver');
                return $(window).trigger("minicartMouseOver.vtex");
            });
            this.hoverContext.on('mouseout', function() {
                $(window).trigger("minicartMouseOut");
                _this.element.trigger('vtex.minicart.mouseOut');
                return $(window).trigger("minicartMouseOut.vtex");
            });
            /* $(window).on("minicartMouseOver.vtex", function() {
            	var _ref;
            	if (((_ref = _this.cartData.items) != null ? _ref.length : void 0) > 0) {
            		$(".vtexsc-cart").slideDown();
            		return clearTimeout(_this.timeoutToHide);
            	}
            });
            $(window).on("minicartMouseOut.vtex", function() {
            	clearTimeout(_this.timeoutToHide);
            	return _this.timeoutToHide = setTimeout(function() {
            		return $(".vtexsc-cart").stop(true, true).slideUp();
            	}, 800);
            }); */
            $(window).on("cartUpdated", function() {
                var args, evt;
                evt = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
                return _this.updateCart.apply(_this, args);
            });
            $(window).on('cartProductAdded.vtex', function() {
                var args, evt;
                evt = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
                return _this.updateCart.apply(_this, args);
            });
            return $(window).on('cartProductRemoved.vtex', function() {
                var args, evt;
                evt = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
                return _this.updateCart.apply(_this, args);
            });
            /*$(window).on('orderFormUpdated.vtex', function() {
            	var args, evt;
            	evt = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            	return _this.handleOrderForm.apply(_this, args);
            });*/
        };

        Minicart.prototype.updateCart = function(slide) {
            var _this = this;
            if (slide == null) {
                slide = true;
            }
            this.element.addClass('amount-items-in-cart-loading');
            return vtexjs.checkout.getOrderForm(this.EXPECTED_ORDER_FORM_SECTIONS).done(function(data) {
                _this.element.removeClass('amount-items-in-cart-loading');
                _this.element.trigger('vtex.minicart.updated');
                _this.element.trigger('minicartUpdated.vtex');
                return _this.handleOrderForm(data, slide);
            });
        };

        Minicart.prototype.handleOrderForm = function(orderForm) {
            this.cartData.orderFormId = orderForm != null ? orderForm.orderFormId : void 0;
            this.cartData.totalizers = orderForm != null ? orderForm.totalizers : void 0;
            this.cartData.shippingData = orderForm != null ? orderForm.shippingData : void 0;
            this.cartData.sellers = orderForm != null ? orderForm.sellers : void 0;
            if ((orderForm != null ? orderForm.items : void 0) != null) {
                this.cartData.items = orderForm.items;
                return this.setupMinicart();
            }
        };

        Minicart.prototype.setupMinicart = function(slide) {
            if (slide == null) {
                slide = true;
            }
            this.prepareCart();
            if (this.cartData.showShippingOptions) {
                this.setDeliveryOptionsSelectorsState();
            }
            this.render();
            if (slide) {
                return this.slide();
            }
        };

        Minicart.prototype.setTimetablesSelectorOptions = function(selectedDate) {
            var availableTimetables, timetablesList;
            availableTimetables = $('.available-timetables');
            timetablesList = _.toArray(_.filter(_this.cartData.deliveryWindows, function(dw) {
                var date;
                date = new Date(dw.startDateUtc);
                return date.getDate() === selectedDate.getDate();
            }));
            availableTimetables.empty();
            return _.each(timetablesList, function(timetable, index) {
                var endTime, optionNode, startTime, text;
                startTime = formatMoment(timetable.startDateUtc);
                endTime = formatMoment(timetable.endDateUtc);
                text = "Das " + startTime + " às " + endTime;
                optionNode = $("<option>").text(text).val(timetable.startDateUtc);
                return availableTimetables.append(optionNode);
            });
        };

        Minicart.prototype.setDeliveryOptionsSelectorsState = function() {
            var logisticsInfo, selectedDay, selectedSla, timetable, _ref, _ref1,
                _this = this;
            if (!(((_ref = this.cartData.shippingData) != null ? (_ref1 = _ref.logisticsInfo) != null ? _ref1.length : void 0 : void 0) > 0)) {
                return;
            }
            logisticsInfo = this.cartData.shippingData.logisticsInfo;
            if (logisticsInfo[0].selectedSla != null) {
                selectedSla = _.find(this.cartData.slas, function(sla) {
                    return sla.name === logisticsInfo[0].selectedSla;
                });
                selectedSla.isSelected = true;
                this.cartData.selectedSla = selectedSla;
                if (selectedSla.deliveryWindow != null) {
                    this.cartData.isScheduledSla = true;
                    this.cartData.availableDeliveryWindows = selectedSla.availableDeliveryWindows;
                    selectedDay = selectedSla.deliveryWindow.startDateUtc;
                    this.cartData.selectedDay = _.find(this.cartData.availableDays, function(availableDay) {
                        var parcialAvailableDay, parcialSelectedDay;
                        parcialAvailableDay = availableDay.startDateUtc.split('T')[0];
                        parcialSelectedDay = selectedDay.split('T')[0];
                        return parcialAvailableDay === parcialSelectedDay;
                    });
                    timetable = _.filter(this.cartData.availableDeliveryWindows, function(dw) {
                        var parcialDWDate, parcialDay;
                        parcialDWDate = dw.startDateUtc.split('T')[0];
                        parcialDay = _this.cartData.selectedDay.startDateUtc.split('T')[0];
                        return parcialDay === parcialDWDate;
                    });
                    this.cartData.selectedTimetable = _.find(timetable, function(tt) {
                        return _this.cartData.selectedSla.deliveryWindow.startDateUtc === tt.startDateUtc;
                    });
                    this.cartData.selectedDeliveryWindow = {
                        timetable: timetable
                    };
                    this.cartData.selectedTimetable.isSelected = true;
                    this.cartData.selectedDay.isSelected = true;
                    return _.each(this.cartData.availableDeliveryWindows, function(dw) {
                        dw.totalPrice = dw.price + _this.cartData.scheduledDeliverySla.price;
                        return dw.totalPriceInCurrency = _.intAsCurrency(dw.totalPrice);
                    });
                } else {
                    return this.cartData.isScheduledSla = false;
                }
            }
        };

        Minicart.prototype.prepareDeliveryOptionsSelectors = function() {
            var availableDates, availableDeliveryOptions, availableTimetables, self;
            self = this;
            availableDeliveryOptions = $('.available-delivery-options');
            availableDates = $('.available-dates');
            availableTimetables = $('.available-timetables');
            availableDeliveryOptions.on('change', function() {
                var selectedSla, selectedSlaPosition, _ref;
                self.cartData.selectedSla.isSelected = false;
                selectedSlaPosition = $(this).val();
                selectedSla = self.cartData.slas[selectedSlaPosition];
                selectedSla.isSelected = true;
                self.cartData.selectedSla = selectedSla;
                self.cartData.isScheduledSla = (_ref = selectedSla.availableDeliveryWindows.length > 0) != null ? _ref : {
                    "true": false
                };
                self.prepareCart();
                return self.render();
            });
            availableDates.on('change', function() {
                var selectedDay, selectedDayPosition, _ref,
                    _this = this;
                if ((_ref = self.cartData.selectedDay) != null) {
                    _ref.isSelected = false;
                }
                selectedDayPosition = $(this).val();
                selectedDay = self.cartData.availableDays[selectedDayPosition];
                selectedDay.isSelected = true;
                self.cartData.selectedDay = selectedDay;
                self.cartData.selectedDay = _.find(self.cartData.availableDays, function(availableDay) {
                    var parcialAvailableDay, parcialSelectedDay;
                    parcialAvailableDay = availableDay.startDateUtc.split('T')[0];
                    parcialSelectedDay = selectedDay.startDateUtc.split('T')[0];
                    return parcialAvailableDay === parcialSelectedDay;
                });
                self.cartData.timetableForSelectedDay = _.filter(self.cartData.availableDeliveryWindows, function(dw) {
                    var parcialDWDate, parcialDay;
                    parcialDWDate = dw.startDateUtc.split('T')[0];
                    parcialDay = self.cartData.selectedDay.startDateUtc.split('T')[0];
                    return parcialDay === parcialDWDate;
                });
                self.cartData.selectedTimetable = _.find(self.cartData.timetableForSelectedDay, function(tt) {
                    return self.cartData.selectedDay.startDateUtc === tt.startDateUtc;
                });
                self.cartData.selectedDeliveryWindow = {
                    timetable: self.cartData.timetableForSelectedDay
                };
                return self.render();
            });
            availableDeliveryOptions.on('change', function() {
                var selectedSla, selectedSlaPosition;
                selectedSlaPosition = $(this).val();
                selectedSla = self.cartData.slas[selectedSlaPosition];
                if (selectedSla.availableDeliveryWindows.length === 0) {
                    return self.sendShippingDataAttachment();
                }
            });
            availableDates.on('change', function() {
                return self.sendShippingDataAttachment();
            });
            return availableTimetables.on('change', function() {
                return self.sendShippingDataAttachment();
            });
        };

        Minicart.prototype.sendShippingDataAttachment = function() {
            var attachment, deliveryWindow, selectedDeliveryOption, selectedDeliveryWindow, selectedSla;
            selectedDeliveryOption = $('.available-delivery-options').val();
            selectedDeliveryWindow = $('.available-timetables').val() || $('.available-timetable').data('value');
            selectedSla = this.cartData.slas[selectedDeliveryOption];
            attachment = {
                address: _.clone(this.cartData.shippingData.address),
                logisticsInfo: _.map(this.cartData.items, function(item, index) {
                    return {
                        itemIndex: index,
                        selectedSla: selectedSla.id
                    };
                })
            };
            if (selectedSla.availableDeliveryWindows.length > 0) {
                deliveryWindow = _.find(this.cartData.availableDeliveryWindows, function(dw) {
                    return dw.startDateUtc === selectedDeliveryWindow;
                });
                _.each(attachment.logisticsInfo, function(li) {
                    return li.deliveryWindow = deliveryWindow;
                });
            }
            this.cartData.isLoading = true;
            vtexjs.checkout.sendAttachment('shippingData', attachment);
            return this.render();
        };

        Minicart.prototype.prepareCart = function() {
            var item, subtotal, total, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _results,
                _this = this;
            this.cartData.selectedTimetable = null;
            this.cartData.selectedDeliveryWindow = null;
            this.cartData.isLoading = false;
            this.cartData.showMinicart = this.options.showMinicart;
            this.cartData.showTotalizers = this.options.showTotalizers;
            this.cartData.showShippingOptions = this.options.showShippingOptions;
            this.cartData.amountItems = 0;
            if (this.cartData.items) {
                _ref = this.cartData.items;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    item = _ref[_i];
                    this.cartData.amountItems += item.quantity;
                }
            }
            total = 0;
            if (this.cartData.totalizers) {
                _ref1 = this.cartData.totalizers;
                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                    subtotal = _ref1[_j];
                    if ((_ref2 = subtotal.id) === 'Items' || _ref2 === 'Discounts') {
                        total += subtotal.value;
                    }
                }
            }
            this.cartData.totalCart = _.intAsCurrency(total, this.options);
            if (this.cartData.items) {
                _ref3 = this.cartData.items;
                _results = [];
                for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
                    item = _ref3[_k];
                    item.availabilityMessage = this.getAvailabilityMessage(item);
                    item.formattedPrice = _.intAsCurrency(item.sellingPrice, this.options) + (item.measurementUnit && item.measurementUnit !== 'un' ? " (por cada " + item.unitMultiplier + " " + item.measurementUnit + ")" : '');
                    if (this.cartData.showShippingOptions) {
                        if (((_ref4 = this.cartData.shippingData) != null ? (_ref5 = _ref4.logisticsInfo) != null ? _ref5.length : void 0 : void 0) > 0) {
                            this.cartData.slas = this.cartData.shippingData.logisticsInfo[0].slas;
                            this.cartData.scheduledDeliverySla = _.find(this.cartData.slas, function(sla) {
                                return sla.availableDeliveryWindows.length > 0;
                            });
                            _.each(this.cartData.slas, function(sla) {
                                var estimateDelivery;
                                sla.priceInCurrency = _.intAsCurrency(sla.price);
                                estimateDelivery = parseInt(sla.shippingEstimate.match(/\d+/)[0]);
                                if (sla.availableDeliveryWindows.length > 0) {
                                    sla.estimateDeliveryLabel = formatDate(sla.availableDeliveryWindows[0].startDateUtc);
                                } else {
                                    sla.estimateDeliveryLabel = "Até " + estimateDelivery + " dia";
                                    if (estimateDelivery > 1) {
                                        sla.estimateDeliveryLabel += "s";
                                    }
                                }
                                if (sla.availableDeliveryWindows.length > 0) {
                                    return sla.label = "" + sla.name;
                                } else {
                                    return sla.label = "" + sla.name + " - " + sla.priceInCurrency + " - " + sla.estimateDeliveryLabel;
                                }
                            });
                            if (this.cartData.scheduledDeliverySla != null) {
                                this.cartData.availableDeliveryWindows = ((_ref6 = this.cartData.selectedSla) != null ? _ref6.availableDeliveryWindows : void 0) || this.cartData.scheduledDeliverySla.availableDeliveryWindows;
                                _.each(this.cartData.availableDeliveryWindows, function(dw) {
                                    dw.totalPrice = dw.price + _this.cartData.scheduledDeliverySla.price;
                                    return dw.totalPriceInCurrency = _.intAsCurrency(dw.totalPrice);
                                });
                                _results.push(this.cartData.availableDays = _.uniq(this.cartData.availableDeliveryWindows, function(dw) {
                                    return dw.startDateUtc.split('T')[0];
                                }));
                            } else {
                                _results.push(void 0);
                            }
                        } else {
                            _results.push(void 0);
                        }
                    } else {
                        _results.push(void 0);
                    }
                }
                return _results;
            }
        };

        Minicart.prototype.render = function() {

            var data, _ref, _ref1, _ref2, _ref3, _ref4,
                _this = this;
            data = $.extend({
                options: this.options
            }, this.cartData);
            if (((_ref = this.cartData.shippingData) != null ? (_ref1 = _ref.logisticsInfo) != null ? _ref1.length : void 0 : void 0) === 0 || ((_ref2 = this.cartData.shippingData) != null ? (_ref3 = _ref2.logisticsInfo) != null ? (_ref4 = _ref3[0].slas) != null ? _ref4.length : void 0 : void 0 : void 0) === 0) {
                data.showShippingOptions = false;
            }
            return dust.render('minicart', data, function(err, out) {
                var self;
                if (err) {
                    throw new Error("Minicart Dust error: " + err);
                }
                _this.element.html(out);
                _this.element.trigger('minicartRendered.vtex');
                self = _this;
                _this.prepareDeliveryOptionsSelectors();
                return $(".vtexsc-productList .cartSkuRemove", _this.element).on('click', function() {
                    return self.deleteItem(this);
                });
            });
        };

        Minicart.prototype.slide = function() {
            return this;
            /* if (this.cartData.items.length === 0) {
            	return this.element.find(".vtexsc-cart").slideUp();
            } else {
            	this.element.find(".vtexsc-cart").slideDown();
            	return this.timeoutToHide = setTimeout(function() {
            		return _this.element.find(".vtexsc-cart").stop(true, true).slideUp();
            	}, 3000);
            } */
        };

        Minicart.prototype.deleteItem = function(item) {
            var removedItem,
                _this = this;

            if (this.element.is('.loading')) {
                return false;
            } else {
                this.element.addClass('loading');
            }

            removedItem = {
                index: $(item).data('index'),
                quantity: 0
            };

            var item = this.cartData.items[removedItem.index];

            return vtexjs.checkout.removeItems([removedItem]).done(function(data) {
                _this.element.trigger('vtex.minicart.updated', item);
                _this.element.trigger('minicartUpdated.vtex', item);
                _this.element.trigger('vtex.cart.productRemoved', item);
                _this.element.trigger('cartProductRemoved.vtex', item);
                _this.cartData = data;
                //_this.prepareCart();
                //_this.render();
                return _this.slide();
            });
        };

        Minicart.prototype.getAvailabilityCode = function(item) {
            return item.availability || "available";
        };

        Minicart.prototype.getAvailabilityMessage = function(item) {
            return this.options.availabilityMessages[this.getAvailabilityCode(item)];
        };

        return Minicart;

    }).call(this);

    $.fn.minicart = function(jsOptions) {
        var $element, defaultOptions, domOptions, element, options, _i, _len;
        defaultOptions = $.extend(true, {}, $.fn.minicart.defaults);
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            element = this[_i];
            $element = $(element);
            domOptions = $element.data();
            options = $.extend(true, defaultOptions, domOptions, jsOptions);
            if (!$element.data('minicart')) {
                $element.data('minicart', new Minicart($element, options));
            }
        }
        return this;
    };

    $.fn.minicart.defaults = {
        availabilityMessages: {
            "available": "",
            "unavailableItemFulfillment": "Este item não está disponível no momento.",
            "withoutStock": "Este item não está disponível no momento.",
            "cannotBeDelivered": "Este item não está disponível no momento.",
            "withoutPrice": "Este item não está disponível no momento.",
            "withoutPriceRnB": "Este item não está disponível no momento.",
            "nullPrice": "Este item não está disponível no momento."
        },
        showMinicart: true,
        showTotalizers: true,
        orderFormURL: "/api/checkout/pub/orderForm/",
        checkoutHash: '/cart'
    };

}).call(this);
