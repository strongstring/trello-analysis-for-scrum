TT.service('Utils',[function() {
  var objectCopy = function(obj) {
   return JSON.parse(JSON.stringify(obj));
  }

  var openWindow = function( url ) {
    window.open(url, '_blank');
    window.focus();
  }

  var getIterationStartDay = function() {
    var _now = new Date(),
      _iterationDate,
      _dumpDate = new Date(ITERATION_START_DATE);

    while (_dumpDate <= _now) {
      _iterationDate = objectCopy(_dumpDate);
      _dumpDate.setDate(_dumpDate.getDate() + ITERATION_PERIOD);
    }

    return _iterationDate;
  }

  // get this week
  var getWeeksArea = function(firstday) {
    var _obj = {};

    var curr = (firstday === undefined) ? new Date : new Date(firstday); // get current date
    var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
    var last = first + 13; // last day is the first day + 6

    _obj['firstday'] = new Date(curr.setDate(first)).toUTCString();
    _obj['lastday'] = new Date(curr.setDate(last)).toUTCString();

    return _obj;
  }

  var getDateString = function(date) {
    var dd = date.getDate(),
      mm = date.getMonth() + 1,
      yyyy = date.getFullYear();

    if(dd < 10) dd = '0' + dd;
    if(mm < 10) mm = '0' + mm;

    return _date = yyyy+'-'+mm+'-'+dd;
  }

  var setStorage = function(key, object) {
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem(key, JSON.stringify(object));
      console.log("%c setStorage:: saved object + " + key, 'color: blue;'); 
    } else {
      console.log("%c localStorage is not support", 'color: red;'); 
    }
  };

  var getStorage = function(key) {
    if (typeof(Storage) !== "undefined") {
      console.log("%c getStorage:: get object + " + key, 'color: blue;'); 
      return JSON.parse(localStorage.getItem(key));
    } else {
      console.log("%c localStorage is not support", 'color: red;'); 
      return {};
    }
  };

// @@@@@@@@@@@@@@ UTIL METHOD @@@@@@@@@@@@@ //
  var getObjInArr = function(arr, key, value) {
    return arr.filter(function(obj) { return obj[key] === value; });
  };

  var getIndexInArr = function(arr, key, value) {
    return arr.findIndex(function(obj) { return obj[key] === value; });
  };

  var getObjInRows = function(resultSet) {
    var length = resultSet.rows.length;
    var result = [];

    for(var i = 0; i < length; i++) {
      result[i] = resultSet.rows.item(i);
    }

    return result;
  }
}]);