import {settings, select, classNames} from './settings.js';
import Product from './Components/product.js';
import Cart from './Components/cart.js';
import Booking from './Components/booking.js';
import MainPage from './Components/mainPage.js';


const app = {
  initPages: function () {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;

    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');
    
    let pageMatchingHash = thisApp.pages[0].id;

    for(let page of thisApp.pages) {
      if(page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for(let link of thisApp.navLinks) {
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();
        /*get page if from href attribuet*/
        const id = clickedElement.getAttribute('href').replace('#', '');
        /*run thisAll.activatePage with that id*/
        thisApp.activatePage(id);
        //change URL hash 
        window.location.hash = '#/' + id;
      });
    }
  },
  activatePage: function(pageId){
    const thisApp = this;

    /*add class "active" to matching pages, remove from non-matching*/
    for(let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    /*add class "active" to matching links, remove from non-matching*/
    for(let link of thisApp.navLinks) {
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
    }
  },
  initBooking: function () {
    const thisApp = this;

    thisApp.bookingTabContainer = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(thisApp.bookingTabContainer); 
  },
  initMainPage: function () {
    const thisApp = this;

    thisApp.mainPageContainer = document.querySelector(select.containerOf.mainPage);
    thisApp.mainPage = new MainPage (thisApp.mainPageContainer); 
  },
  initMenu: function() {
    const thisApp = this; 
    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },
  initData: function () {
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;
    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResponse:', parsedResponse);

        /*save parsedResponse as thisApp.data.products*/
        thisApp.data.products = parsedResponse;
        /*execute initMenu method*/
        thisApp.initMenu();
      });
    console.log('thisApp.data:', JSON.stringify(thisApp.data));
  },
  init: function(){
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);

    thisApp.initPages();
    thisApp.initData ();
    thisApp.initCart(); 
    thisApp.initBooking();
    thisApp.initMainPage();
  },
  initCart: function () {
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  }
};
app.init();
