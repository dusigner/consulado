/*! 
 * Master Color v1.0.0 - @license MIT
 */

/*!
 * Master Color v1.0.0
 * Copyright (c) 2015 Lucas Monteverde
 * Under MIT License
 */

;
(function(window, undefined) {

    'use strict';

    var CanvasImage = function(image) {
        this.canvas = document.createElement('canvas');

        this.width = this.canvas.width = image.width;
        this.height = this.canvas.height = image.height;

        if (this.canvas.getContext) {

            this.context = this.canvas.getContext('2d');

            this.context.drawImage(image, 0, 0, this.width, this.height);
        }
    };

    CanvasImage.prototype.getContext = function() {
        return this.context;
    };

    CanvasImage.prototype.clear = function() {
        this.context.clearRect(0, 0, this.width, this.height);
    };

    CanvasImage.prototype.getPixelCount = function() {
        return this.width * this.height;
    };

    CanvasImage.prototype.getImageData = function() {
        return this.context && this.context.getImageData(0, 0, this.width, this.height);
    };

    var hasLocalStorage = function() {
        var mod = 'modernizr';
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch (e) {
            return false;
        }
    };

    var options = {
        blocksize: 100,
        exclude: ['0,0,0', '255,255,255']
    };

    var MasterColor = function(opt) {

        this.image = null;
        this.canvasImage = null;
        this.hasLocalStorage = hasLocalStorage();

        this.options = {
            blocksize: options.blocksize || opt.blocksize,
            exclude: options.exclude || opt.exclude
        };
    };

    MasterColor.prototype.getColor = function(image, complete) {

        this.options.complete = complete;

        this.setImage(image);
    };

    MasterColor.prototype.setImage = function(image) {

        var key = image.src.match(/(?:\w+:)?\/\/[^/]+([^?#]+)/)[1];

        this.image = image;

        var value = this.localStorageData(key);

        if (value) {
            return this.complete(value);
        }

        this.image = new Image();

        //this.image.crossOrigin = 'Anonymous';

        this.image.onload = this.onload.bind(this);

        this.image.src = this.image.key = key;
    };

    MasterColor.prototype.onload = function(image) {

            this.canvasImage = new CanvasImage(this.image);

            if (this.canvasImage.getContext()) {

                this.processImageData(this.canvasImage.getImageData().data, this.canvasImage.getPixelCount());
            }
        },

        MasterColor.prototype.processImageData = function(data, getPixelCount) {

            var colorCounts = {},
                rgbString = '',
                rgb = [],
                colorCount = 0,
                color = '';

            for (var i = 0; i < getPixelCount; i += this.options.blocksize * 4) {
                rgb[0] = data[i];
                rgb[1] = data[i + 1];
                rgb[2] = data[i + 2];
                rgbString = rgb.join(',');

                if (rgbString in colorCounts) {
                    colorCounts[rgbString]++;
                } else {
                    colorCounts[rgbString] = 1;
                }

                if (this.options.exclude.indexOf(rgbString) === -1) {

                    if (colorCounts[rgbString] > colorCount) {
                        color = rgbString;
                        colorCount = colorCounts[rgbString];
                    }
                }
            }

            this.complete(this.makeRGB(color), true);
        }

    MasterColor.prototype.complete = function(color, cache) {
        if (this.options.complete) {
            this.options.complete(color, this.image);

            if (cache) {
                this.localStorageData(this.image.key, color);
            }
        }
    }

    MasterColor.prototype.localStorageData = function(key, data) {
        if (this.hasLocalStorage) {

            if (data) {

                try {
                    window.localStorage.setItem(key, data);
                } catch (e) {
                    console.error(e);
                }

            } else {
                return localStorage.getItem(key);
            }
        }
    }

    MasterColor.prototype.makeRGB = function(name) {
        return ['rgb(', name, ')'].join('');
    };

    MasterColor.prototype.destroy = function() {
        this.image = null;
        this.canvasImage = null;
    };

    window.MasterColor = window.MasterColor || MasterColor;

})(window);
