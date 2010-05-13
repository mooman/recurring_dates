/*
* Copyright (c) 2010 Rachot Moragraan, City of Garden Grove, CA
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

var Recurrence = Class.create({
  // takes a JSON object with pattern options
  initialize: function (pattern, date_format) {
    if (typeof pattern != 'object') throw new TypeError('pattern must be a JSON');

    if (!pattern.every || pattern.every.blank()) {
      throw new ReferenceError('Every magnitude must be specified');
    }

    if (isNaN(parseInt(pattern.every))) {
      throw new TypeError('Every magnitude must be a valide number');
    }

    // stores generated dates based on recurrence pattern
    this.dates = [];

    this.start = Date.parse(pattern.start);
    this.every = parseInt(pattern.every);
    this.unit = pattern.unit;
    this.end_condition = pattern.end_condition;
    this.until = Date.parse(pattern.until);
    this.rfor = parseInt(pattern.rfor);
    this.occurrence_of = pattern.occurrence_of;
    this.nth = parseInt(pattern.nth);
    this.days = pattern.days.sort();

    this.date_format = date_format || 'MM/dd/yyyy';
  },

  // tries to describe the pattern in plain english
  describe: function () {
    var units = {'d': 'day(s)', 'w': 'week(s)', 'm': 'month(s)', 'y': 'year(s)'};
    var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var nthword = ['', 'first', 'second', 'third', 'forth', 'fifth', 'last']

    var t = ['Every ' + this.every + ' ' + units[this.unit]];
    if (this.unit == 'w') {
      var d = [];
      for (var i = 0; i < this.days.length; i++) {
        d.push(week[this.days[i]]);
      }
      t.push('on ' + d.join(', '));
    } else if (this.unit == 'm') {
      t.push('on the ' + nthword[(this.nth < 0) ? nthword.length-1 : this.nth] + ' ' + week[this.occurrence_of]);
    }

    t.push('starting on ' + this.start.toString(this.date_format));

    if (this.end_condition == 'until') {
      t.push('until ' + this.until.toString(this.date_format));
    } else if (this.end_condition == 'for') {
      t.push('for ' + this.rfor + ' occurrences');
    }

    return t.join(' ');
  },

  // determine whether given date is in recurrence
  contains: function (d) {
    if (this.dates.length == 0) this.generate();

    // can be string or date object already
    d = Date.parse(d);

    for (var i = 0; i < this.dates.length; i++) {
      if (Date.equals(this.dates[i], d)) return true;
    }
    return false;
  },

  // returns an array of dates base on input pattern
  generate: function (max) {
    if (!(this.rfor || this.until || max)) {
      throw new RangeError('There is no valid end condition specified');
    }

    var end_condition_reached = function (occurrences, current_date) {
      if (max && occurrences.length >= max) return true;
      if (this.end_condition == 'for' && this.rfor && occurrences.length >= this.rfor) return true;
      if (this.end_condition == 'until' && this.until && current_date > this.until) return true;
      return false;
    }.bind(this);

    var dates = [];
    var curr = this.start.clone().clearTime();
    // always include start date in recurrence
    dates.push(curr.clone());

    // weekly recurrence
    if (this.unit == 'w') {
      // if it's not already a sunday, move it to the current week's sunday
      if (!curr.is().sunday()) curr.last().sunday();

      if (this.days.length == 0) {
        throw new RangeError('Weekly recurrence was selected without any days specified.');
        return null;
      }

      while (!end_condition_reached(dates, curr)) {
        // scan through the checked days
        this.days.each(function (d) {
          if (curr.getDay() < d) curr.moveToDayOfWeek(d);

          if (curr <= this.start) return;
          if (end_condition_reached(dates, curr)) return;

          dates.push(curr.clone());
        }.bind(this));
        
        // rewind back to sunday
        if (!curr.is().sunday()) curr.last().sunday();
        // next repetition
        curr.addWeeks(this.every);
      }

    } else if (this.unit == 'm') {
      while (true) {
        if (this.occurrence_of == -1) {
          curr.moveToLastDayOfMonth();
        } else {
          curr.moveToNthOccurrence(this.occurrence_of, this.nth);
        }

        if (end_condition_reached(dates, curr)) break;

        if (curr > this.start) {
          dates.push(curr.clone());
        }

        curr.addMonths(this.every);
      }

    } else {
      while (true) {
        if (this.unit == 'd') {
          curr.addDays(this.every);
        } else if (this.unit == 'y') {
          curr.addYears(this.every);
        }
        // else infinite loop yay

        if (end_condition_reached(dates, curr)) break;

        dates.push(curr.clone());
      }
    }
   
    // cache results
    this.dates = dates;
    return this.dates;
  }
});
