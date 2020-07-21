
/*global rangeSlider*/

import BaseWidget from './baseWidget.js';
import {select, settings} from '../settings.js';
import utils from '../utils.js';

class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.hours.open);

    const thisWidget = this;

    thisWidget.dom.input =  thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output =  thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    
    thisWidget.initPlugin();
  }
  initPlugin() {
    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input);

    thisWidget.dom.input.addEventListener('input', function (value) {
      thisWidget.value = value;
    });
  }

  parseValue(value){
    utils.numberToHour(value);
    return value;
  }

  isValid() {
    return true;
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.output = thisWidget.value;
  }
}

export default HourPicker; 