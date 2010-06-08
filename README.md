JavaScript library to generate recurring dates.
===============================================

For example:

Every 2 weeks on Monday, Wednesday, and Friday starting today for 5 occurrences
Every month on the last Sunday starting on 02/10/09 until 03/30/10

This library will generate a list of dates for those patterns.


REQUIREMENTS
------------

Datejs - http://www.datejs.com/
(Distributed with this is the SVN version from 03/29/2010. Please visit their site also.)

Prototype - http://www.prototypejs.org/ (though this library can be easily modified to use other js frameworks)


USAGE
-----

    var r = new Recurrence(pattern);
    alert(r.describe());
    dates = r.generate();
    if (r.contains('03/28/10')) alert('in pattern!');


API
---

    Class Recurrence (pattern [, date_format])

where pattern is a JSON object with the following options:

- start: start date. date. required.
- every: interval magnitude (every XXX weeks...). integer. required.
- unit: valid values are 'd', 'w', 'm', 'y' for days, weeks, months, and years respectively. probably required.
- end_condition: how should the recurrence be terminated. valid values are 'until' and 'for'. until should be a date. for should be an integer (for N occurrences). required.
- until: if end_condition is 'until', pass the date here.
- rfor: if end_condition is 'for', pass an integer here.
- nth: valid values are 'first', 'second', 'third', 'forth', and 'last'. see 'occurrence_of' option. to be used with 'm' unit option.
- occurrence_of: valid values are 0-6, corresponding to the days of the week. in conjuction with 'nth' option, specifies nth day of the month (last Sunday of the month). to be used with 'm' unit option.
- days: to be used with 'w' unit option. an array of integers representing day of the week (0-6). eg. Every 2 weeks on Tuesday (2) and Thursday (4), pass [2,4] as the value.

ex. 
    { start: Date.today(), every: 2, unit: 'w', end_condition: 'for', rfor: 5, days: [1,3,5] }
    generates:
    Every 2 weeks on Monday, Wednesday, and Friday for 5 occurrences starting today

date_format is optional, please see Datejs for valid formats.

-----

    String describe ()

Tries to describe the supplied pattern in English.

-----

    Boolean contains (date)

Determines whether "date" is in the recurrence pattern. This calls generate(), if it hasn't already been generated, otherwise, it will use the dates generated from the last time generate() was called. Returns true if "date" is in the pattern. "date" can be either a string or a Date object, but please make sure the time portion is all balls.

Note that this only check if "date" is contained within the pattern's starting and ending points. Next version will support indefinite ending date and throwaway dates generation, instead of storing them all in an array.

-----

    Date[] generate ([limit])

Generate the dates based on supplied pattern. Returns array of Date objects. Optional argument limit puts an upper limit on how many dates to generate (for preview or to prevent some memory leak).


COMMENTS
--------

Please feel free fork and improve, submit bug reports, suggestions, comments. email: janechii AT gmail.


LICENSE
-------

Released under MIT License.
