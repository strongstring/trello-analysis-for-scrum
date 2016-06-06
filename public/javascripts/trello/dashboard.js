var showPartLabel = function() {
  $.plot('#flot-part-pie-chart', partData, {
    series: {
      pie: {
        innerRadius: 0.5,
        show: true
      }
    }
  });
}

//var data = [
    //  { label: "Series1",  data: [[1,10]]},
    //  { label: "Series2",  data: [[1,30]]},
    //  { label: "Series3",  data: [[1,90]]},
    //  { label: "Series4",  data: [[1,70]]},
    //  { label: "Series5",  data: [[1,80]]},
    //  { label: "Series6",  data: [[1,0]]}
    //];


var calcPartLabel = function() {
  var deferred = $.Deferred()

  if(PART['labels'] === undefined) PART['labels'] = [];
  for(projectName in PART['project']) {
    var _project = PART['project'][projectName];

    if(_project['labels'] === undefined) _project['labels'] = [];

    for(var i = 0 ; i < )
  }

  deferred.resolve();

  return deferred.promise()
}

var drawChart = function() {
  var deferred = $.Deferred(),
    deferredArr = [];

  $.when(calcPartLabel()).done(
    function(res) {
      showPartLabel();
      deferred.resolve();
    }
  )

  return deferred.promise();
};

var initializing = function() {
  var deferred = $.Deferred(),

  if(PART['members'])
  PART = getStorage(LOCALSTORAGE_KEY);

  $.when(drawChart()).done(
    function(success) {
      deferred.resolve();
    }
  );

  return deferred.promise();
}

$(function() {
  $('#indicator').css('display', 'block');

  $.when(initializing()).done(
    function(res) {
      $('#indicator').css('display', 'none');
    }
  )
});