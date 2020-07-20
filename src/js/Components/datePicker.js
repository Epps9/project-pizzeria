import BaseWidget from './baseWidget.js';
import utils from '../utils.js';
import { select, settings } from '../settings.js';

class DatePicker extends BaseWidget {
  constructor(wrapper) {
    super (wrapper, utils.dateToStr(new Date()));

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);

    thisWidget.initPlugin();
    
  }
  initPlugin() {
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    const maxDaysInFuture = settings.datePicker.maxDaysInFuture;
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, maxDaysInFuture);

    thisWidget.flatpickr = flatpickr (thisWidget.dom.input, { 
      altInput: true,
      altFormat: 'F j, Y',
      dateFormat: 'Y-m-d',
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      'disable': [
        function(date) {
          // return true to disable
          return (date.getDay() === 1);
        }
      ],
      'locale': {
        'firstDayOfWeek': 1
      },
      onChange: function(selectedDates, dateStr, instance) {

        thisWidget.flatpickr.config.onChange.push(function(selectedDates, dateStr, flatpickr) { 
          const thisWidget = this;

          thisWidget.value = dateStr;
        } );
      }
    
      
    }); 

  }
  parseValue(value){
    return value;
  }
  renderValue() {
  }

}

export default DatePicker;