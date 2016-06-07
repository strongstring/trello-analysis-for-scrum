var showPartLabel = function() {

  var _totalVal = PART['labels']['totalVal'],
    colorArr = [];

  // calculate percentage
  for(var i = 0; i < PART['labels'].length; i++) {
    var _labelVal = objectCopy(PART['labels'][i]['value']);

    PART['labels'][i]['value'] =  ((_labelVal / _totalVal)*100).toFixed(2);
  } // (for) calculate percentage

  Morris.Donut({
    element: 'flot-part-pie-chart',
    data : PART['labels'],
    backgroundColor: '#ffffff',
    labelColor: '#4d4d4d',
    formatter: function (x) { return x + "%"}
  });

  $('#flot-part-pie-chart').click(function(){
    showParCardTable($('#flot-part-pie-chart tspan:eq(0)').html());
  });
}

var showParCardTable = function(labelName) {
  console.log($('#flot-part-pie-chart tspan:eq(0)').html());

  var target = $('#flot-part-table'),
    _resourceTable = '<table class="table ol-md-12"><tr class="primary"><td>Task</td><td>Time</td></tr>';
      
  target.empty();

  var _findLabelIndex = -1;
  for(var i = 0; i < PART['labels'].length; i++ ) {
    if(PART['labels'][i]['label'] === labelName) {
      _findLabelIndex = i;
      break;
    }
  }
    
  if(_findLabelIndex !== -1) {
    for(var i = 0; i < PART['labels'][_findLabelIndex]['cards'].length; i++) {
      var _card = PART['labels'][_findLabelIndex]['cards'][i];

      _resourceTable += '<tr><td><a onClick="openWindow(\'' + _card['url'] + '\')">' + _card['name']
        + '</a></td><td>' + _card['estimate'] + '</td></tr>';
    }

    _resourceTable += '</table>';
    target.append(_resourceTable);
  }
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

    // make label data
    for(var i = 0 ; i < _project['cards'].length; i++ ){
      var _card = _project['cards'][i],
        _label = _project['cards'][i]['labels'][0];

      if(PART['labels']['totalVal'] === undefined) PART['labels']['totalVal'] = 0;
      if(_label !== undefined && _card['estimate'] !== undefined) {
        var findIndex = -1;
        for(var j = 0 ; j < PART['labels'].length; j++) {
          if(PART['labels'][j]['label'] === _label['name']) {
            findIndex = j;
            break;
          }
        }
        if(findIndex === -1) {
          PART['labels'].push({
            "label" : _label['name'],
            "color" : labelColor[_label['color']],
            "value" : 0,
            "cards" : [],
          });
          findIndex = (PART['labels'].length - 1);
        }
        PART['labels'][findIndex]['cards'].push(_card);
        PART['labels'][findIndex]['value'] += _card['estimate'];
        PART['labels']['totalVal'] += _card['estimate'];
      }
    } // (for) make label data
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
  var deferred = $.Deferred();

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