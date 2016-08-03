/* global $: true, Nitro: true, dust:true */
//require('vendors/dust-helpers');
'use strict';

require('../../templates/filters.html');

Nitro.module('filters', function() {


    var self = this,
        $navigator = $('.search-single-navigator'),
        $holder = $('.filter-wrapper'),
        categories = [],
        items = [];

    this.isSearch = function() {
        return $('.navigation-tabs').length === 0; //$('body').hasClass('busca');
    };

    this.isDepartment = function() {
        return $('body').hasClass('departamento');
    };

    this.setup = function() {

        //conditional for get department item
        //var $department = $navigator.find('h3');

        var departments = []; //this.createItem( $navigator.find('h3'), 'department' );

        //conditional for get category item
        var $category = self.isSearch() ? $navigator.find('li') : $navigator.find('h4');

        categories = this.createItem($category, 'category');

        //conditional for get filters item
        //var $filters = $navigator.find('h5');

        var filters = this.createItem($navigator.find('h5'), 'filter');

        items = items.concat(departments, categories, filters);

        this.render();

    };

    this.createItem = function($item, type) {

        return $item && $.map($item, function(el) {

            el = $(el);

            var link = el.find('a'),
                list = el.next('ul');

            var item = {
                name: link.length ? link.attr('title') : el.text(),
                type: type,
                link: link.attr('href'),
                active: false,
                style: list.attr('class'),
                children: self.createItem(list.find('li'), type)
            };

            if (item.style) {
                item.style = $.trim(item.style.replace(/hide|even/i, '')); //$.replaceSpecialChars
            }

            if (type === 'department' && window.vtxctx.departmentName === item.name) {
                item.active = true;
            } else if (type === 'category' && window.vtxctx.categoryName === item.name) {
                item.active = true;
            } else if (el.hasClass('filtro-ativo')) {
                item.active = true;
            }

            //set active parent when child filter is active
            if (item.children && item.children.length === 1 && item.children[0].active) {
                item.active = true;
            }

            // console.log(el, item);

            return item;
        });

    };

    this.getFilterLink = function() {

        var map = _.urlParams().map;

        if (map && map !== '') {

            var mapParams = map.split(','),
                urlRest = window.location.pathname.split('/');

            //get categories count
            var count = $.grep(mapParams, function(item) {
                return item === 'c';
            }).length;

            // concat only categories from pathname plus first slash
            return urlRest.slice(0, count + 1).join('/');

        }
    };

    this.render = function() {

        // console.log('items', items);
        // console.table('filters', items);

        dust.render('filters', {
            items: items,
            filter: self.getFilterLink(),
            search: self.isSearch(),
            department: self.isDepartment(),
            categories: categories,

        }, function(err, out) {
            if (err) {
                throw new Error('Filters Dust error: ' + err);
            }

            $holder.after(out).show();
        });

    };

    this.setup();

});

/*jshint strict: false */
dust.filters.size = function(item) {
    return item && item.length;
};
