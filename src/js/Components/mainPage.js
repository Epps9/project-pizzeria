import {select,templates, classNames} from '../settings.js';
import utils from '../utils.js';

class MainPage {
  constructor(elemMainPage){

    const thisMainPage = this;

    thisMainPage.renderMainPage(elemMainPage);
    this.activatePages();

  }
  renderMainPage(mainPageContainer){
    const thisMainPage = this;
    /* generate HTML based on template */
    const generatedHTML = templates.mainPage();
    /* Creat element using utils.createElementFromHTML */
    thisMainPage.dom = {};
    thisMainPage.dom.wrapper = mainPageContainer;
    const generatedDom = utils.createDOMFromHTML(generatedHTML);
    /*add element to menu container*/
    thisMainPage.dom.wrapper.appendChild(generatedDom);
  }
  activatePages() {

    const Link1 = document.getElementById('link-1');
    
    const Link1Id = Link1.getAttribute('href').replace('#', '');

    const pages = document.querySelector(select.containerOf.pages).children;

    Link1.addEventListener('click', function(){
      for(let page of pages) {
        if (page.id == Link1Id) {
          page.classList.add(classNames.pages.active);
        } else {
          page.classList.remove(classNames.pages.active);
        }  
      }
    });

    const Link2 = document.getElementById('link-2');

    const Link2Id = Link2.getAttribute('href').replace('#', '');

    Link2.addEventListener('click', function(){
      for(let page of pages) {
        if (page.id == Link2Id) {
          page.classList.add(classNames.pages.active);
        } else {
          page.classList.remove(classNames.pages.active);
        }  
      }
    });
  }
}

export default MainPage;