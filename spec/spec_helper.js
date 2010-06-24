jQuery.noConflict();

Screw.Unit(function() {
  // put config stuff in here
});

var human_readable_dates = function (dates) {
  if (dates instanceof Array) {
    return dates.map(function (d) {
      return d.toString('MM/dd/yyyy');
    });
  } else {
    return dates.toString('MM/dd/yyyy');
  }
}

Screw.Matchers['dates_equal'] = {
  match: function (expected, actual) {
    if (expected instanceof Array) {
      for (var i = 0; i < actual.length; i++) {
        if (!Date.equals(expected[i], actual[i])) return false;
      }
      return actual.length == expected.length;
    } else {
      return Date.equals(expected, actual);
    }
  },

  failure_message: function(expected, actual, not) {
    var i = 0;
    if (expected.length == actual.length) {
      for (; i < actual.length; i++) {
        if (!Date.equals(expected[i], actual[i])) break;
      }
      return ['date at index', i, 'expected', jQuery.print(human_readable_dates(actual[i])), (not ? 'to not equal' : 'to equal'), jQuery.print(human_readable_dates(expected[i]))].join(' ');
    } else {
      return ['array not the same length. expected ', expected.length, 'but was', actual.length].join(' ');
    }
  }
}
