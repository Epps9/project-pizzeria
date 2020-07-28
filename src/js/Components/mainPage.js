import {templates} from '../settings.js';
import utils from '../utils.js';

class MainPage {
  constructor(elemMainPage){

    const thisMainPage = this;

    thisMainPage.renderMainPage(elemMainPage);

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
}

export default MainPage;