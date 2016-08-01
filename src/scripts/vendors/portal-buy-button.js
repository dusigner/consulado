(function() {
    var ProductComponent, root,
        __bind = function(fn, me) {
            return function() {
                return fn.apply(me, arguments);
            };
        },
        __slice = [].slice;

    root = window || exports;

    root.EVENT_HISTORY || (root.EVENT_HISTORY = {});

    ProductComponent = (function() {
        function ProductComponent() {
            this.generateSelectors = __bind(this.generateSelectors, this);
            this.triggerProductEvent = __bind(this.triggerProductEvent, this);
            this.bindProductEvent = __bind(this.bindProductEvent, this);
        }

        ProductComponent.prototype.bindProductEvent = function(name, handler, productIdIndex) {
            var bindProductId, productId, _i, _len, _ref, _results,
                _this = this;
            if (productIdIndex == null) {
                productIdIndex = 0;
            }
            bindProductId = function(name, handler, productId) {
                var _ref;
                $(window).on(name, function() {
                    var args, evt, evtProductId;
                    evt = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
                    evtProductId = args[productIdIndex];
                    if (productId !== evtProductId) {
                        return;
                    }
                    return handler.apply(null, [evt].concat(__slice.call(args)));
                });
                if (((_ref = EVENT_HISTORY[productId]) != null ? _ref[name] : void 0) != null) {
                    return handler.apply(null, EVENT_HISTORY[productId][name]);
                }
            };
            if (this.options.multipleProductIds) {
                _ref = this.productId;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    productId = _ref[_i];
                    _results.push(bindProductId(name, handler, productId));
                }
                return _results;
            } else {
                return bindProductId(name, handler, this.productId);
            }
        };

        ProductComponent.prototype.triggerProductEvent = function() {
            var args, args2, element, evt, name, _name;
            name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            element = this.element || $window;
            evt = jQuery.Event(name);
            args2 = [this.productId].concat(__slice.call(args));
            element.trigger(evt, args2);
            EVENT_HISTORY[_name = this.productId] || (EVENT_HISTORY[_name] = {});
            return EVENT_HISTORY[this.productId][name] = [evt].concat(__slice.call(args2));
        };

        ProductComponent.prototype.generateSelectors = function(selectors) {
            var k, v,
                _this = this;
            for (k in selectors) {
                v = selectors[k];
                if (typeof v === 'function') {
                    this["find" + k] = v;
                } else {
                    this["find" + k] = (function(v) {
                        return function() {
                            return _this.element.find(v);
                        };
                    })(v);
                }
                this["findFirst" + k] = (function(k) {
                    return function() {
                        return $(_this["find" + k]()[0]);
                    };
                })(k);
                this["show" + k] = (function(k) {
                    return function() {
                        return _this["find" + k]().show();
                    };
                })(k);
                this["hide" + k] = (function(k) {
                    return function() {
                        return _this["find" + k]().hide();
                    };
                })(k);
            }
            this.showAll = (function(selectors) {
                return function() {
                    var _results;
                    _results = [];
                    for (k in selectors) {
                        v = selectors[k];
                        _results.push(_this["show" + k]());
                    }
                    return _results;
                };
            })(selectors);
            return this.hideAll = (function(selectors) {
                return function() {
                    var _results;
                    _results = [];
                    for (k in selectors) {
                        v = selectors[k];
                        _results.push(_this["hide" + k]());
                    }
                    return _results;
                };
            })(selectors);
        };

        return ProductComponent;

    })();

    root.ProductComponent = ProductComponent;

}).call(this);

(function() {
    var BuyButton,
        __bind = function(fn, me) {
            return function() {
                return fn.apply(me, arguments);
            };
        },
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key)) child[key] = parent[key];
            }

            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };

    BuyButton = (function(_super) {
        __extends(BuyButton, _super);

        function BuyButton(element, productId, buyData, options) {
            var pid, _i, _len, _ref,
                _this = this;
            this.element = element;
            this.productId = productId;
            if (buyData == null) {
                buyData = {};
            }
            this.options = options;
            this.buyButtonHandler = __bind(this.buyButtonHandler, this);
            this.update = __bind(this.update, this);
            this.valid = __bind(this.valid, this);
            this.getErrorURL = __bind(this.getErrorURL, this);
            this.getURL = __bind(this.getURL, this);
            this.accessoriesUpdated = __bind(this.accessoriesUpdated, this);
            this.quantityChanged = __bind(this.quantityChanged, this);
            this.skuUnselected = __bind(this.skuUnselected, this);
            this.skuSelected = __bind(this.skuSelected, this);
            this.getChangesFromHREF = __bind(this.getChangesFromHREF, this);
            this.bindEvents = __bind(this.bindEvents, this);
            this.sku = buyData.sku || null;
            this.quantity = buyData.quantity || 1;
            this.seller = buyData.seller || 1;
            this.salesChannel = buyData.salesChannel || 1;
            if (this.options.multipleProductIds) {
                this.manyProducts = {};
                _ref = this.productId;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    pid = _ref[_i];
                    this.manyProducts[pid] = {
                        sku: null,
                        quantity: 1,
                        seller: 1
                    };
                }
            }
            this.accessories = [];
            if (typeof CATALOG_SDK !== "undefined" && CATALOG_SDK !== null && this.options.variant) {
                this.SDK = CATALOG_SDK;
                this.SDK.getProductWithVariations(this.productId).done(function(json) {
                    _this.productData = json;
                    if (_this.productData.skus.length === 1) {
                        _this.triggerProductEvent('vtex.sku.selected', _this.productData.skus[0]);
                        _this.triggerProductEvent('skuSelected.vtex', _this.productData.skus[0]);
                    }
                    _this.getChangesFromHREF();
                    return _this.update();
                });
            }
            this.getChangesFromHREF();
            this.bindEvents();
            this.update();
        }

        BuyButton.prototype.bindEvents = function() {
            this.bindProductEvent('skuSelected.vtex', this.skuSelected);
            this.bindProductEvent('skuUnselected.vtex', this.skuUnselected);
            this.bindProductEvent('quantityReady.vtex', this.quantityChanged);
            this.bindProductEvent('quantityChanged.vtex', this.quantityChanged);
            this.bindProductEvent('accessoriesUpdated.vtex', this.accessoriesUpdated);
            return this.element.on('click', this.buyButtonHandler);
        };

        BuyButton.prototype.getChangesFromHREF = function() {
            var href, qtyMatch, salesChannelMatch, sellerMatch, skuMatch;
            href = this.element.attr('href');
            if (this._url !== href) {
                skuMatch = href.match(/sku=(.*?)&/);
                if (skuMatch && skuMatch[1] && skuMatch[1] !== this.sku) {
                    this.sku = skuMatch[1];
                    this.triggerProductEvent('vtex.sku.changed', {
                        sku: this.sku
                    });
                    this.triggerProductEvent('skuChanged.vtex', {
                        sku: this.sku
                    });
                }
                qtyMatch = href.match(/qty=(.*?)&/);
                if (qtyMatch && qtyMatch[1] && qtyMatch[1] !== this.quantity) {
                    this.quantity = qtyMatch[1];
                    this.triggerProductEvent('vtex.quantity.changed', this.quantity);
                    this.triggerProductEvent('quantityChanged.vtex', this.quantity);
                }
                sellerMatch = href.match(/seller=(.*?)&/);
                if (sellerMatch && sellerMatch[1] && sellerMatch[1] !== this.seller) {
                    this.seller = sellerMatch[1];
                }
                salesChannelMatch = href.match(/sc=(.*?)&/);
                if (salesChannelMatch && salesChannelMatch[1] && salesChannelMatch[1] !== this.salesChannel) {
                    this.salesChannel = salesChannelMatch[1];
                }
            }
            return this._url = href;
        };

        BuyButton.prototype.skuSelected = function(evt, productId, sku) {
            console.log('skuSelected', productId, sku);
            this.getChangesFromHREF();
            if (this.options.multipleProductIds) {
                this.manyProducts[productId].sku = sku;
            } else {
                this.skuData = sku;
                this.sku = sku.sku;
                this.seller = sku.sellerId;
            }
            this.update();
            if (this.options.instaBuy && sku.available) {
                return this.element.click();
            }
        };

        BuyButton.prototype.skuUnselected = function(evt, productId, selectableSkus) {
            this.getChangesFromHREF();
            if (this.options.multipleProductIds) {
                this.manyProducts[productId].sku = null;
            } else {
                this.skuData = {};
                this.sku = null;
            }
            return this.update();
        };

        BuyButton.prototype.quantityChanged = function(evt, productId, quantity) {
            this.getChangesFromHREF();
            if (this.options.multipleProductIds) {
                this.manyProducts[productId].quantity = quantity;
            } else {
                this.quantity = quantity;
            }
            return this.update();
        };

        BuyButton.prototype.accessoriesUpdated = function(evt, productId, accessories) {
            this.getChangesFromHREF();
            this.accessories = accessories;
            return this.update();
        };

        BuyButton.prototype.getURL = function() {
            var acc, id, key, prod, queryParams, url, value, _i, _len, _ref, _ref1, _ref2;
            if (!this.valid()) {
                return this.getErrorURL();
            }
            queryParams = [];
            if (this.options.multipleProductIds) {
                _ref = this.manyProducts;
                for (id in _ref) {
                    prod = _ref[id];
                    if (!(prod.sku && prod.sku.available)) {
                        continue;
                    }
                    queryParams.push("sku=" + prod.sku.sku);
                    queryParams.push("qty=" + prod.quantity);
                    queryParams.push("seller=" + prod.seller);
                }
            } else {
                queryParams.push("sku=" + this.sku);
                queryParams.push("qty=" + this.quantity);
                queryParams.push("seller=" + this.seller);
            }
            queryParams.push("redirect=" + this.options.redirect);
            queryParams.push("sc=" + this.salesChannel);
            _ref1 = this.accessories;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                acc = _ref1[_i];
                if (!(acc.quantity > 0)) {
                    continue;
                }
                queryParams.push("sku=" + acc.sku);
                queryParams.push("qty=" + acc.quantity);
                queryParams.push("seller=" + acc.sellerId);
            }
            if (this.options.giftRegistry) {
                queryParams.push("gr=" + this.options.giftRegistry);
            }
            if (this.options.target) {
                queryParams.push("target=" + this.options.target);
            }
            _ref2 = this.options.queryParams;
            for (key in _ref2) {
                value = _ref2[key];
                queryParams.push("" + key + "=" + value);
            }
            url = "/checkout/cart/add?" + (queryParams.join('&'));
            return url;
        };

        BuyButton.prototype.getErrorURL = function() {
            if (this.options.alertOnError) {
                return "javascript:alert('" + this.options.errorMessage + "');";
            } else {
                return "javascript:void(0);";
            }
        };

        BuyButton.prototype.valid = function() {
            return !!(this.sku || this.options.multipleProductIds);
        };

        BuyButton.prototype.update = function() {
            this.element.attr('href', this.getURL());
            this.element.show();
            if (this.options.hideUnavailable && this.skuData && this.skuData.available === false) {
                this.element.hide();
            }
            if (this.options.hideUnselected && !this.skuData) {
                this.element.hide();
            }
            if (this.productData && this.productData.available === false) {
                return this.element.hide();
            }
        };

        BuyButton.prototype.buyButtonHandler = function(evt) {
            var _this = this;
            if (!this.valid()) {
                this.triggerProductEvent('vtex.buyButton.failedAttempt', this.options.errorMessage);
                this.triggerProductEvent('buyButtonFailedAttempt.vtex', this.options.errorMessage);
                return true;
            }
            this.triggerProductEvent('vtex.buyButton.through', this.getURL);
            this.triggerProductEvent('buyButtonThrough.vtex', this.getURL);
            if (this.options.redirect) {
                return true;
            }
            $(window).trigger('vtex.modal.hide');
            $(window).trigger('modalHide.vtex');
            $.get(this.getURL()).done(function() {
                _this.triggerProductEvent('productAddedToCart');
                _this.triggerProductEvent('vtex.cart.productAdded');
                _this.triggerProductEvent('cartProductAdded.vtex');
                if (_this.options.addMessage) {
                    return alert(_this.options.addMessage);
                }
            }).fail(function() {
                _this.redirect = true;
                window.location.href = _this.getURL();
                if (_this.options.errMessage) {
                    return alert(_this.options.errMessage);
                }
            });
            evt.preventDefault();
            return false;
        };

        return BuyButton;

    })(ProductComponent);

    $.fn.buyButton = function(productId, buyData, jsOptions) {
        var $element, defaultOptions, domOptions, element, options, _i, _len;
        defaultOptions = $.extend(true, {}, $.fn.buyButton.defaults);
        for (_i = 0, _len = this.length; _i < _len; _i++) {
            element = this[_i];
            $element = $(element);
            domOptions = $element.data();
            options = $.extend(true, defaultOptions, domOptions, jsOptions);
            if (!$element.data('buyButton')) {
                $element.data('buyButton', new BuyButton($element, productId, buyData, options));
            }
        }
        return this;
    };

    $.fn.buyButton.defaults = {
        errorMessage: "Por favor, selecione o modelo desejado.",
        alertOnError: true,
        redirect: false,
        addMessage: null,
        errMessage: null,
        instaBuy: false,
        hideUnselected: false,
        hideUnavailable: true,
        target: null,
        variant: true,
        multipleProductIds: false,
        queryParams: {}
    };

}).call(this);
