(function(window, document) {

  "use strict";


  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function setPromos() {
    var html_banners             = document.querySelectorAll('.box-banner');
    window.dataLayer_banners = window.dataLayer_banners || [];
    var banner;
    var id;
    var canPersist;
    var position = 0;
    if(html_banners) {
        for(var i = 0, max = html_banners.length ; i < max ; i+=1) {
            banner = html_banners[i].querySelector('img');
            if(banner && html_banners[i].offsetHeight > 0 && !(html_banners[i].classList.contains('slick-cloned'))) {
              html_banners[i].querySelector('a').addEventListener('mousedown', function(event) {
                window.dataLayer = window.dataLayer || [];
                var banner,
                    promos,
                    id = this.querySelector('img').getAttribute('src').split('/')[5];

                for(var j = 0, max_dataLayer = window.dataLayer.length ; j < max_dataLayer ; j += 1) {
                  if(window.dataLayer[j].page) {
                    if(window.dataLayer[j].page.promos) {
                      promos = window.dataLayer[j].page.promos;
                      for(var k = 0, max_impressionPromos = promos.length ; k < max_impressionPromos ; k += 1) {
                        if(promos[k].id === id) {
                          banner = promos[k];
                          break;
                        }
                      }
                      break;
                    }
                  }
                }
                window.dataLayer.push({
                  'event': 'promoClick',
                  'promos': [banner]
                });
              });
              id = banner.getAttribute('src').split('/')[5];
              canPersist = true;
              for(var db = 0, max_db = window.dataLayer_banners.length ; db < max_db ; db+=1) {
                if(window.dataLayer_banners[db].id && (window.dataLayer_banners[db].id === id)) {
                  canPersist = false;
                }
              }
              if(canPersist) {
                window.dataLayer_banners.push({
                   'id': id,
                   'name' : banner.getAttribute('alt'),
                   'creative' : banner.getAttribute('src').split('/')[6].split('.')[0],
                   'position' : (position + 1)
                });
                position+= 1;
              }
            }
        }
    }
  }

  function alreadyPassThisProduct(ids, id) {
    if(ids) {
      for(var i = 0, max = ids.length ; i < max ; i += 1) {
        if(ids[i] == id) {
          return true;
        }
      }
    }
    return false;
  }

  function setProducts(firstRun) {
    if(! document.querySelectorAll('.box-produto').length) {
      return false;
    }
    var products = document.querySelectorAll('.box-produto');
    var product;
    var id;
    var ids = [];
    window.productList = window.productList || [];
    var productListTotal = window.productList.length;

    if(products) {
      for(var i = 0, max = products.length ; i < max ; i += 1) {
        product = products[i];
        if(! product.classList.contains('ga-tracked')) {
          product.classList.add('ga-tracked');
          id                    = product.getAttribute('data-idproduto');
          product.addEventListener('mousedown', function(event) {
            window.dataLayer = window.dataLayer || [];
            var product,
                impressions,
                id = this.getAttribute('data-idproduto');

            for(var j = 0, max_dataLayer = window.productList.length ; j < max_dataLayer ; j += 1) {
              if(window.productList[j].id_vtex == id) {
                product = window.productList[j];
                break;
              }
            }
            localStorage.setItem('product_'+product.id_vtex, JSON.stringify({
              'category_sap': product.categorySAP,
              'color': product.color,
              'fullId': product.fullId,
              'originalPrice': product.originalPrice,
              'comboName': product.comboName ? product.comboName : ''
            }));
            window.dataLayer.push({
              'event': 'productClick',
              'products': [product]
            });
          });
          ids.push(id);
        }
      }
      if(! (document.location.hostname.indexOf('busca') >= 0)) {
        console.log('its not search');
        if(! firstRun) {
          if(ids.length) {
            for(var j = 0, max = window.dataLayer.length ; j < max ; j += 1) {
              if(window.dataLayer[j].page && window.dataLayer[j].page.impressions) {
                updateImpressions(ids);
                break;
              }
            }
          }
        } else {
          setObserverOnShelf();
        }
      }
    }
  }

  function setObserverOnShelf() {
    var shelf = document.querySelector('#prateleira .vitrine');
    if(shelf) {
      var callback        = function(mutationsList) {
        for(var i = 0, max = mutationsList.length ; i < max ; i += 1) {
          if(mutationsList[i].type == 'childList' && !window.updating_product_list) {
            window.updating_product_list = true;
            setTimeout(function() {
              setProducts(false);
              window.updating_product_list = false;
            }, 2000);
            break;
          }
        }
      }.bind(this),
      config = {childList: true, subtree: true},
      observer = new MutationObserver(callback);
      observer.observe(shelf, config);
    }
  }

  function setAddToCartEvent() {
    document.body.addEventListener('mousedown', function(event) {
      var elem = event.target;
      if(elem.getAttribute('href') && elem.getAttribute('href').indexOf('/checkout/cart/add') >= 0) {
        var product;
        for(var i = 0, max = window.dataLayer.length ; i < max ; i += 1) {
          if(window.dataLayer[i].page && window.dataLayer[i].page.impressions && window.dataLayer[i].page.impressions.length) {
            for(var indexImpressions = 0, maxImpressions = window.dataLayer[i].page.impressions.length ; indexImpressions < maxImpressions ; indexImpressions+=1) {
                console.log(elem.parentElement.parentElement.getAttribute('data-idproduto'));
                if(window.dataLayer[i].page.impressions[indexImpressions].id_vtex == elem.parentElement.parentElement.getAttribute('data-idproduto')) {
                  product = window.dataLayer[i].page.impressions[indexImpressions];
                  break;
                }
            }
          } else if(window.dataLayer[i].page && window.dataLayer[i].page.product) {
            product = window.dataLayer[i].page.product;
            break;
          }
        }
        localStorage.setItem('product_'+product.id_vtex, JSON.stringify({
          'category_sap': product.categorySAP,
          'color': product.color,
          'fullId': product.fullId,
          'originalPrice': product.originalPrice,
          'comboName': product.comboName ? product.comboName : ''
        }));
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'addToCart',
          'product': product
        });
      }
    });
  }

  function updateImpressions(ids) {
    var products    = [];
    for(var i = 0, max = window.productList.length ; i < max ; i+=1) {
      if(alreadyPassThisProduct(ids, window.productList[i].id_vtex)) {
        products.push(window.productList[i]);
      }
    }
    window.product_list_name = window.product_list_name || '';
    for(var p = 0, max_products = products.length ; p < max_products ; p+=1) {
      if(products[p].list ==  '' || typeof products[p].list == undefined) {
        products[p].list = window.product_list_name;
      }
    }
    if(products) {
      window.dataLayer.push({
        'event': 'updateImpressions',
        'impressions': products
      });
    }
  }
  window.pushDataLayer = function(update) {
    var category   =  null;
    var searchTerm = null;
    var step       = '';


    window.dataLayer = window.dataLayer || [];
    window.dataLayer_product = {};

    if(update) {
      window.dataLayer.push({
        'event': 'updateImpressions',
        'impressions': window.productList
      });
      return;
    }

    for(var i = 0, max = window.dataLayer.length ; i < max ; i += 1) {
      if(window.dataLayer[i].pageCategory) {
        window.dataLayer_pageName = window.dataLayer_pageName || window.dataLayer[i].pageCategory.toLowerCase();
        category = window.dataLayer[i].categoryName;
        if(window.dataLayer_pageName == 'product') {
          var stock = 'Indisponível';
          var voltagem = document.querySelector('.input-box-Voltagem input.checked') ? document.querySelector('.input-box-Voltagem input.checked').value : null;
          var sku = window.dataLayer[i].productReferenceId;
          var skuStocks = window.dataLayer[i].skuStocks;
          for(var key in skuStocks) {
            if(skuStocks.hasOwnProperty(key)) {
              if(skuStocks[key] > 0) {
                stock = 'Disponível';
              }
            }
          }
          var additionalInfo = JSON.parse(localStorage.getItem('product_'+ window.dataLayer[i].productId));
          window.dataLayer_product = {
            'id': window.dataLayer[i].productReferenceId,
            'id_vtex': window.dataLayer[i].productId,
            'fullId': additionalInfo ? additionalInfo.fullId : window.dataLayer[i].productReferenceId,
            'name' : window.dataLayer[i].productName,
            'brand': window.dataLayer[i].productBrandName,
            'availability' : stock,
            'price' : window.dataLayer[i].productPriceTo,
            'originalPrice': window.dataLayer[i].productListPriceFrom,
            'categorySAP': additionalInfo ? additionalInfo.category_sap : '',
            'category': window.dataLayer[i].productCategoryName,
            'department': window.dataLayer[i].productDepartmentName,
            'color': document.querySelector('.value-field.Cor') ? document.querySelector('.value-field.Cor').innerText : '',
            'comboName': additionalInfo ? additionalInfo.comboName : ''
          };
        }
        break;
      }
    }

    if(document.location.search.indexOf('q=') > 0) {
      searchTerm = document.location.search.split('q=')[1].split('&')[0];
      window.dataLayer_pageName = 'search';
    }
    window.product_list_name = window.product_list_name || '';
    switch(window.dataLayer_pageName) {
      case 'search':
        if(window.product_list && window.product_list.length) {
          step = 'busca/com_resultado';
        } else {
          step = 'busca/sem_resultado';
        }
        break;
      case 'category':
        step = 'categoria/'+category.replace(' / ', '/').replace(/ /g, '-').trim().toLowerCase();
        window.product_list_name = 'category';
        break;
      case 'product':
        step = 'produto/'+ sku + ( voltagem ? '/'+voltagem : '');
        window.product_list_name = 'product';
        break;
      case 'parceiro':
        step = 'home';
        window.dataLayer_pageName = 'home';
        window.product_list_name = 'home';
        break;
      default:
        step = window.dataLayer_pageName;
    }

    window.productList = window.productList || [];
    var aux_prod;
    var aux_combo_name;
    for(var p = 0, max_products = window.productList.length ; p < max_products ; p+=1) {
      if(window.productList[p].list ==  '' || typeof window.productList[p].list == 'undefined') {
        window.productList[p].list = window.product_list_name;
      }
      if(document.location.pathname.indexOf('combos') >= 0) {
        aux_prod = document.querySelector('[data-idproduto="' + window.productList[p].id_vtex + '"]');
        if(aux_prod) {
          aux_combo_name = aux_prod.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('data-name-combos');
          console.log(aux_combo_name);
          window.productList[p].comboName = aux_combo_name;
        }
      }
    }

    var products = window.productList;
    var user     = {
      'firstLogin': null,
      'loginStatus': 'Deslogado',
      'userId': ''
    };
    var userinfo;
    for(var d = 0, max_dataLayer = window.dataLayer.length ; d < max_dataLayer ; d+=1) {
      if(window.dataLayer[d].visitorId) {
        try {
          userinfo = JSON.stringify({
            'firstLogin': '',
            'loginStatus': window.dataLayer[d].visitorLoginState ? 'Logado' : 'Deslogado',
            'userId': window.dataLayer[d].visitorId
          });
          document.cookie = "userinfo=" + userinfo + ";path=/;domain=.consul.com.br";
        } catch(err) {
          console.log(err);
        }
        user = {
          'firstLogin': '',
          'loginStatus': window.dataLayer[d].visitorLoginState ? 'Logado' : 'Deslogado',
          'userId': window.dataLayer[d].visitorId
        };
      }
    }
    userinfo = (getCookie('userinfo') != '') ? JSON.parse(getCookie('userinfo')) : '';
    if(user.loginStatus == 'Deslogado' && (userinfo && userinfo !== '')) {
      user = {
        'firstLogin': userinfo.firstLogin,
        'loginStatus': userinfo.loginStatus,
        'userId': userinfo.userId
      }
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event' : "virtualPageview",
      'step': step,
      'user': user,
      'page': {
        'type': window.dataLayer_pageName,
        'currencyCode' : 'BRL',
        'searchTerm' : searchTerm,
        'category' : category,
        'impressions': products,
        'promos': window.dataLayer_banners,
        'product': window.dataLayer_product
      }
    });
  }

  window.onload  = function() {
    init();
  }
  window.onload  = (function() {
    setPromos();
    setProducts(true);
    setAddToCartEvent();
    if(! (document.location.hostname.indexOf('busca') >= 0)) {
      setTimeout(function() {
        window.pushDataLayer(false);
      }, 1000);
    }
  });

})(window, document);
