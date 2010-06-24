Screw.Unit(function () {
  // common function to test expected dates
  var test_dates = function (pattern , expected_dates) {
    var r = new Recurrence(pattern);
    expected_dates = expected_dates.collect(function(d) { return Date.parse(d); });

    expect(r.generate()).to(dates_equal, expected_dates);
  };

  describe('Recurrence', function () {

    describe('by days with', function () {
      var base_pattern = {
        start: '02/21/2010',
        until: '03/07/2010',
        every: '1',
        unit: 'd',
        end_condition: 'until'
      };

      it('specific ending date and every is 1', function () {
        var expected_dates = [
          '02/21/2010', '02/22/2010', '02/23/2010', '02/24/2010', '02/25/2010', '02/26/2010', '02/27/2010', '02/28/2010',
          '03/01/2010', '03/02/2010', '03/03/2010', '03/04/2010', '03/05/2010', '03/06/2010', '03/07/2010'
        ];

        test_dates(base_pattern, expected_dates);
      });

      it('specific ending date and every is more than 1', function () {
        var pattern = Object.clone(base_pattern);
        pattern.every = '2';

        var expected_dates = [
          '02/21/2010', '02/23/2010', '02/25/2010', '02/27/2010',
          '03/01/2010', '03/03/2010', '03/05/2010', '03/07/2010'
        ];

        test_dates(pattern, expected_dates);
      });

      it('number of occurences', function () {
        var pattern = Object.clone(base_pattern);
        pattern.every = '2';
        pattern.end_condition = 'for';
        pattern.rfor = '6';

        var expected_dates = [
          '02/21/2010', '02/23/2010', '02/25/2010', '02/27/2010',
          '03/01/2010', '03/03/2010'
        ];

        test_dates(pattern, expected_dates);
      });

    }); // describe by days

    describe('by weeks with', function () {
      var base_pattern = {
        start: '02/21/2010',
        until: '03/21/2010',
        every: '1',
        unit: 'w',
        end_condition: 'until',
        days: [0]
      };

      it('specific ending date and one day a week', function () {
        var expected_dates = ['02/21/2010', '02/28/2010', '03/07/2010', '03/14/2010', '03/21/2010'];

        test_dates(base_pattern, expected_dates);
      });

      it('specific ending date and multiple days a week', function () {
        var pattern = Object.clone(base_pattern);
        pattern.every = '2';
        pattern.days = [0, 3, 6];

        var expected_dates = ['02/21/2010', '02/24/2010', '02/27/2010', '03/07/2010', '03/10/2010', '03/13/2010', '03/21/2010'];

        test_dates(pattern, expected_dates);
      });

      it('#describe', function () {
        var r = new Recurrence(base_pattern);

        expect(r.describe()).to(match, /Sunday/);
      });
      
    }); // describe by weeks

  });
});
