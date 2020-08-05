import {templates, select, settings, classNames} from '../settings.js';
import AmountWidget from './amountWidget.js';
import utils from '../utils.js';
import DatePicker from './datePicker.js';
import HourPicker from './hourPicker.js';


class Booking {
  constructor(elemBooking, chosenTable) {
    const thisBooking = this;

    thisBooking.render(elemBooking);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.clickedTable();
    thisBooking.makeReservation(chosenTable);

    thisBooking.booked = {};
    thisBooking.chosenTable;
  }
  getData() {
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrect: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    //console.log ('getData params', params);

    const urls = {
      booking:       settings.db.url + '/' + settings.db.booking + '?' +  params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event   + '?' +  params.booking.join('&'),
      eventsRepeat:  settings.db.url + '/' + settings.db.event   + '?' +  params.booking.join('&'),
    };
    //console.log ('getData urls', urls);

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        //console.log(bookings);
        //console.log(eventsCurrent);
        //console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      }); 
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    for(let item of bookings) {
      //console.log('aaa', item);
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for(let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for(let item of eventsRepeat) {
      if(item.repeat == 'daily') {
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }

    //console.log('thisBooking booked', thisBooking.booked);
    thisBooking.updateDOM();
  }
  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock+= 0.5) {
      //console.log('loop', hourBlock);

      if(typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }
  
      thisBooking.booked[date][hourBlock].push(table);

    }
  }

  updateDOM(){
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }

    for(let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }

      if(
        !allAvailable
          &&
          thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    } 
    thisBooking.sliderColor();
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
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.submit = thisBooking.dom.wrapper.querySelector(select.booking.submit);
    //console.log('thisBooking.dom.submit button', thisBooking.dom.submit);
  }


  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker (thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function (){
      thisBooking.updateDOM();
    });
  }
  clickedTable(){
    const thisBooking = this;

    for(let table of thisBooking.dom.tables) {
      table.addEventListener('click', function(){
        table.classList.add(classNames.booking.tableBooked);
        let clickedTableId = table.getAttribute(settings.booking.tableIdAttribute);
        thisBooking.chosenTable = clickedTableId;
      });
    } 
  }
  sendBooking(){
    const thisBooking = this;

    const url = settings.db.url + '/' + settings.db.booking;

    const playload = {
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      table: parseInt(thisBooking.chosenTable),
      duration: parseInt(thisBooking.hoursAmount.value),
      ppl: parseInt(thisBooking.peopleAmount.value),
      starters: [],
    };
    console.log('playload', playload);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playload),
    };

    fetch(url,options)
      .then(function(response){
        return response.json();
      }) .then(function(parsedResponse){
        console.log(parsedResponse);
      });
  }
  makeReservation(chosenTable) {
    const thisBooking = this;

    thisBooking.dom.submit.addEventListener('click', function(event){
      event.preventDefault();
      thisBooking.sendBooking(chosenTable);
    });
  }

  sliderColor () {
    const thisBooking = this;

    const slider = document.querySelector('.range-slider');
    const colorWrapper = document.createElement('div');
    colorWrapper.className = 'color-wrapper';

    const date = thisBooking.date;

    for(let hour = 12; hour < 24; hour += .5) {
      
      const div = document.createElement('div');
      //console.log(hour, date);
      if(thisBooking.booked[date] && thisBooking.booked[date][hour]) {
        div.className = 'block size' + thisBooking.booked[date][hour].length;
      } else {
        div.className = 'block';
      }
      colorWrapper.appendChild(div); 
    }

    slider.prepend(colorWrapper);
  }  

}

export default Booking;