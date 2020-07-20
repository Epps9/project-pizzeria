import {templates, select} from '../settings.js';
import AmountWidget from './amountWidget.js';
import utils from '../utils.js';
import DatePicker from './datePicker.js';


class Booking {
  constructor(elemBooking) {
    const thisBooking = this;

    thisBooking.render(elemBooking);
    thisBooking.initWidgets();
  }
  render(bookingTabContainer) {
    const thisBooking = this;

    //generate HTML using template templates.bookingWidget without arg.
    const generatedHTML = templates.bookingWidget();
    //create empty object thisBooking.dom
    thisBooking.dom = {};
    //save property wrapper to this object equal to the received argument
    thisBooking.dom.wrapper = bookingTabContainer;
    //change wrapper content to HTML code generated from template
    const generatedDom = utils.createDOMFromHTML(generatedHTML);
    thisBooking.dom.wrapper.appendChild(generatedDom);
    //save thisBooking.dom.peopleAmount as single element found in wrapper and matching to select.booking.peopleAmount
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    //like in people Amount find and save element for hoursAmount
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
  }
  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker (thisBooking.dom.datePicker);
  }
}

export default Booking;