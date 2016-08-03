var iterationStartDay = "#datetimepicker1";
var iterationWorkDay = "#datetimepicker2";


var getSelectedMember = function() {
  var _arr = [],
    _checkedID = $('#memberSelectForm div input:checked');

  for(member in PART['members']) {
    for(var j = 0; j <_checkedID.length; j++) {
      if(member === _checkedID[j].value) _arr.push(member);
    }
  }
  return _arr;
};

var isSelectedMember = function(memberName) {
  var members = getSelectedMember(),
    isSelected = false;

  for(var i = 0; i < members.length; i++) {
    if(members[i] === memberName) isSelected = true;
  }

  return isSelected;
}

var showMemberCheckBox = function(members) {
  var memberSelector = $('#memberSelectForm');

  memberSelector.empty();

  for(memberName in members) {
    memberSelector.append(
      '<div class="checkbox col-md-3" style="margin-top:0px;"><label>'
      + '<input class="checkbox" type="checkbox" checked value="'+ memberName +'">' 
      + members[memberName]['fullName'] + '</label></div>'
    );
  }

  $(".checkbox").change(reDrawTask);
};

var showMemberResource = function() {
  $('#projectDashBoard').empty();
  $('#projectDashBoard').append(
    '<div class="panel panel-default">'
    + '<div class="panel-heading panel-title">Total Project Resource</div>'
    + '<div class="panel-body" id="total_resource"></div>'
  );
  var _resouceTable = '<table class="table col-md-12"><tr class="primary"><td>Member</td><td>E</td>';

  var firstDay = new Date($(iterationStartDay).data()['date']),
    workDay = new Date($(iterationWorkDay).data()['date']);

  for(var i = 0; i < ITERATION_PERIOD; i++) {
    if(firstDay.getDate() === workDay.getDate()) {
      _resouceTable += '<td style="border-left:solid 2px; border-right:solid 2px;">' + firstDay.getDate() + '</td>';
    } else {
      _resouceTable += '<td>' + firstDay.getDate() + '</td>';
    }
    firstDay.setDate(firstDay.getDate() + 1);
  }

  _resouceTable += '<td>R</td></tr>';

  for (memberName in PART.members) {
    var _member = PART['members'][memberName],
      _date = new Date($(iterationStartDay).data()['date']);

    _resouceTable += '<tr><td class="textLabel">' + _member['fullName'] + '</td><td>'+ _member['estimate'].toFixed(1) +'</td>';
    for(var j = 0; j < ITERATION_PERIOD; j++) {
      var _dateSpend = _member['date_spend'][_date.getDate()];
      _dateSpend = (_dateSpend === undefined) ? ' ' : _dateSpend.toFixed(1);
      if(_dateSpend < 0.1) _dateSpend = ' ';

      if(parseInt(_date.getDate()) === parseInt(workDay.getDate())) {
        _resouceTable += '<td style="border-left:solid 2px; border-right:solid 2px;">' + _dateSpend + '</td>';
      } else {
        _resouceTable += '<td>' + _dateSpend + '</td>'
      }
      _date.setDate(_date.getDate() + 1);
    }
    _resouceTable += '<td>'+ (_member['estimate'] - _member['spend']).toFixed(1) +'</td></tr>';
  }

  _resouceTable += '</table>';
  $('#total_resource').append(_resouceTable);
}

var showProjectResource = function() {

  for(projectName in PART['project']) {
    var _project = PART['project'][projectName];

    var _resouceTable = '<div class="panel panel-default" id="'+ projectName
      +'"><div class="panel-heading panel-title">' + _project['name'] + '</div><div class="panel-body">'
      + '<table class="table ol-md-12"><tr class="primary">' + '<td>Task</td><td>Member</td><td>E</td>';
    if(DEBUG_MODE) console.log("project : " + projectName + ", cardLength : " + _project['cards'].length);

    var firstDay = new Date($(iterationStartDay).data()['date']),
      workDay = new Date($(iterationWorkDay).data()['date']);

    for(var i = 0; i < ITERATION_PERIOD; i++) {
      if(firstDay.getDate() === workDay.getDate()) {
        _resouceTable += '<td style="border-left:solid 2px; border-right:solid 2px;">' + firstDay.getDate() + '</td>';
      } else {
        _resouceTable += '<td>' + firstDay.getDate() + '</td>';
      }
      firstDay.setDate(firstDay.getDate() + 1);
    }
    _resouceTable += '<td>R</td></tr>';

    for(var j = 0; j < _project['cards'].length; j++) {
      var _card = _project['cards'][j];

      var memCount = 0;

      for(members in _card['members']) {
        if(_card['members'][members]['estimate'] !== undefined && _card['members'][members]['estimate'] > 0) {
          // memCount++;
          for(var m = 0; m < getSelectedMember().length; m++) {
            if(members === getSelectedMember()[m]) memCount++;
          }
        }
      }

      if(memCount > 0 && _card['estimate'] !== undefined && _card['estimate'] !== 0) {
        if(_card['spend'] === _card['estimate']) {
          if(_card['date_spend'][workDay.getDate()] !== undefined && _card['date_spend'][workDay.getDate()] > 0.1) {
            _resouceTable += '<tr class="taskFinish">';
          } else {
            _resouceTable += '<tr class="taskDone">';
          }
        } else if (_card['spend'] !== undefined && _card['spend'] > 0) { 
          _resouceTable += '<tr class="taskDoing">';
        } else {
          _resouceTable += '<tr>';
        }

        var _cardName = _card.name;
        var hashIndex = _cardName.indexOf('#');
        if(hashIndex !== -1) {
          if(hashIndex === 0) {
            _hashLength = _cardName.split(' ')[0].length;
            _cardName = _cardName.substr(_hashLength+1, _cardName.length);
          } else {
            _cardName = _cardName.substr(0, hashIndex);
          }
        }

        _resouceTable += '<td rowspan="'+memCount+'" class="textLabel"><a onClick="openWindow(\''+_card['url']+'\')">' + _cardName + '</a></td>';

        var memLineCount = 0;
        for(memberName in _card['members']) {
          if(isSelectedMember(memberName)) {
            var _date = new Date($(iterationStartDay).data()['date']),
              _member = _card['members'][memberName];

            if(_member['estimate'] !== undefined && _member['estimate'] > 0.0) {

              if(memLineCount !== 0) {
                if(_member['spend'] === _member['estimate']) {
                  if(_member['date_spend'][workDay.getDate()] !== undefined && _member['date_spend'][workDay.getDate()] > 0.1) {
                    _resouceTable += '<tr class="taskFinish">';
                  } else {
                    _resouceTable += '<tr class="taskDone">';
                  }
                } else if (_member['spend'] !== undefined && _member['spend'] > 0) {
                  _resouceTable += '<tr class="taskDoing">';
                } else {
                  _resouceTable += '<tr>';
                }
              }
               _resouceTable += '<td class="textLabel">' + _member['fullName'] + '</td><td>'+ _member['estimate'].toFixed(1) +'</td>';

              for(var k = 0; k < ITERATION_PERIOD; k++) {
                var _dateSpend = _member['date_spend'][_date.getDate()];
                _dateSpend = (_dateSpend === undefined) ? ' ' : _dateSpend.toFixed(1);
                if(_dateSpend < 0.1) _dateSpend = ' ';

                if(_date.getDate() === workDay.getDate()) {
                  _resouceTable += '<td style="border-left:solid 2px; border-right:solid 2px;">' + _dateSpend + '</td>';
                } else {
                  _resouceTable += '<td>' + _dateSpend + '</td>'
                }
                _date.setDate(_date.getDate() + 1);
              }

              _resouceTable += '<td>'+ (_member['estimate'] - _member['spend']).toFixed(1) +'</td></tr>';
              memLineCount ++;
            }
          }
        }
      }
    }
    _resouceTable += '</table></div></div>';
    $('#projectDashBoard').append(_resouceTable);
  }
}

var showMemberResourceToGraph = function() {
  var _dataObj = {"estimateG" : [], "spendG" : []},
    firstDay = new Date($(iterationStartDay).data()['date']),
    today = new Date();
    targetElement = $('#flot-line-chart-multi');

  firstDay.setDate(firstDay.getDate() - 1);

  var memCount = 0;
  for(member in PART['members']) {
    memCount ++;
  }

  if (DEBUG_MODE) console.log("member is " + memCount);

  var estimateValForLogical = PART['estimate'],
    estimateValForReal = PART['estimate'];

  var stopflag = false;
  for(var i = 0; i < 15; i++) {
    var _estimateData = [],
      _spendData = [];

    if(i === 0) {
      _estimateData.push(firstDay.getTime());
      _spendData.push(firstDay.getTime());
      _estimateData.push(estimateValForLogical);
      _spendData.push(estimateValForReal);
    } else {
      firstDay.setDate(firstDay.getDate() + 1);
      _estimateData.push(firstDay.getTime());
      _spendData.push(firstDay.getTime());

      if(firstDay.getDate() === today.getDate()) stopflag = true;

      estimateValForLogical -= (memCount*5.75);
      if(PART['date_spend'][firstDay.getDate()] !== undefined) {
        estimateValForReal -= PART['date_spend'][firstDay.getDate()];
      }

      _estimateData.push(estimateValForLogical);
      _spendData.push(estimateValForReal);
    }
    _dataObj['spendG'].push(_estimateData);
    if(!stopflag) _dataObj['estimateG'].push(_spendData);
  }

  $.plot($("#flot-line-chart-multi"), [{
        data: _dataObj['spendG'],
        label: "LOGICAL ESTIMATE GRAPH"
    }, {
        data: _dataObj['estimateG'],
        label: "ACTUAL ESTIMATE GRAPH",
        yaxis: 1
    }], {
        xaxes: [{
            mode: 'time'
        }],
        yaxes: [{
            min: -300
        }],
        legend: {
            position: 'sw'
        },
        grid: {
            hoverable: true //IMPORTANT! this is needed for tooltip to work
        },
        tooltip: true,
        tooltipOpts: {
            content: "%s for %x was %y",
            xDateFormat: "%y-%0m-%0d",

            onHover: function(flotItem, $tooltipEl) {
                // console.log(flotItem, $tooltipEl);
            }
        }
    });
}

var showProjectPreview = function() {
  var target = $('#projectPreview');

  var loopInex = 0;
  for(projectName in PART['project']) {
    var _project = PART['project'][projectName];
    var _progress = (_project['spend'] / _project['estimate'] * 100).toFixed(2),
      _currentState;

    if(_progress < 30) {
      _currentState = "progress-bar-danger";
    } else if(_progress > 75) {
      _currentState = "progress-bar-success";
    } else {
      _currentState = "progress-bar-info";
    }
    var _li = '<li>'
        + '<a href="#' + projectName + '">'
        +  '<div>'
        +  '<p>'
        +   '<strong>' + _project['name'] + '</strong>'
        +      '<span class="pull-right text-muted">' + _progress + '% Complete</span>'
        +    '</p>'
        +    '<div class="progress progress-striped active">'
        +      '<div class="progress-bar '+_currentState+'" role="progressbar" aria-valuenow="' + _progress + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + _progress + '%">'
        +        '<span class="sr-only">' + _progress + '% Complete</span>'
        +      '</div>'
        +    '</div>'
        +  '</div>'
        +'</a>'
      +'</li>';

    if(loopInex !== 0) {
      target.append('<li class="divider"></li>');
    }
    target.append(_li);
  }

  target.append(
    '<li class="divider"></li>'
     + '<li>'
      + '<a class="text-center" href="/task">'
      + '<strong>See Dashboard    </strong>'
      + '<i class="fa fa-angle-right"></i>'
      + '</a>'
    + '</li>');

  $('.resourceMenu').css('display', 'block');
};

var iterationPeriodCalculator = function() {
  var _workday = new Date(),
    _baseIterationDate = getIterationStartDay();
    // _baseIterationDate = "2016-05-30";

  _workday.setDate(_workday.getDate() -1);

  $(iterationStartDay).datetimepicker({
    defaultDate: _baseIterationDate,
    format: 'YYYY-MM-DD'
  });
  $(iterationWorkDay).datetimepicker({
    defaultDate : getDateString(_workday),
    format: 'YYYY-MM-DD'
  });

  $(iterationStartDay).on("dp.change", reDrawTask);
  $(iterationWorkDay).on("dp.change", reDrawTask);

  $('#exportExcel').attr('download', 'HResouce_'+getDateString(new Date(_baseIterationDate))+'.xls');
}

var reDrawTask = function() {
  $('#projectDashBoard').empty();
  showMemberResource();
  showProjectResource();
}

var searchSNE = function() {
  $('#indicator').css('display', 'block');
  clearMemeber();
  $.when(calculationStart()).done(
    function(success) {
      showProjectPreview();
      showMemberResourceToGraph();
      showMemberResource();
      showProjectResource();
      prepareExcel();
      setStorage(LOCALSTORAGE_KEY, PART);
      $('#exportExcel').removeClass('disabled');
      $('#indicator').css('display', 'none');
      $('#startSearch').css('display', 'none');
      console.log("%c @@@@@@@@@@  ALL ACTION IS CALCULATED!! @@@@@@@@@@", 'background: #222; color: #bada55'); 
    }
  );
}

var topButtonEventListener = function() {
  var amountScrolled = 300;

  $(window).scroll(function() {
    if ( $(window).scrollTop() > amountScrolled ) {
      $('a.back-to-top').fadeIn('slow');
    } else {
      $('a.back-to-top').fadeOut('slow');
    }
  });

  $('a.back-to-top').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 700);
    return false;
  });
}

var prepareExcel = function() {
  var _printArea = $('#printDump'),
    taskArr = [],
    _dataTable = "";

  for(boardName in PART['project']) {
    var _object = {},
      _project = PART['project'][boardName];

    _object['name'] = _project['name'];
    for(var i = 0; i < _project['cards'].length; i++ ) {
      var _card = _project['cards'][i];

      if(_card['labels'][0] !== undefined) {
        if(_object[_card['labels'][0]['name']] === undefined)  _object[_card['labels'][0]['name']] = [];
        _object[_card['labels'][0]['name']].push(_card);
      }
    }

    taskArr.push(_object);
  }

  console.log(taskArr);

  for(var i = 0; i < taskArr.length; i++) {
    _dataTable += '<tr><td colspan=\'6\' style=\'background-color: green;\'> ' + taskArr[i]['name'] + ' </td></tr>';

    for(labelName in taskArr[i]) {
      if(labelName !== 'name') {
        _dataTable += '<tr><td  colspan=\'6\' style=\'background-color: yellow;\'>' + labelName + '</td></tr>';

        for(var j = 0; j < taskArr[i][labelName].length; j++) {
          var _card = taskArr[i][labelName][j];

          if(_card['estimate'] > 0) {
            _dataTable += '<tr><td colspan=\'3\'>' + _card['name'] + '</td><td colspan=\'2\'>';

            var memCount = 0;
            for(member in _card['members']) {
              _dataTable += (memCount === 0) ? member : ", " + member;
              memCount++;
            }
            _dataTable += '</td>';

            if(_card['estimate'] === _card['spend']) {
              _dataTable += '<td>DONE</td>';
            } else if (_card['spend'] > 0) {
              _dataTable += '<td>DOING</td>';
            } else {
              _dataTable += '<td>  </td>'; 
            }

            _dataTable += '</tr>';
          }
        }
      }
    }
    _dataTable += '<tr><td></td></tr>';
  }

  _printArea.html(_dataTable);
  
}

var initializing = function() {
  var deferred = $.Deferred();

  $.when(getMemberInformation()).done(
    function(members) {
      PART.members = members;

      PART['estimate'] = 0;
      PART['spend'] = 0;
      PART['date_spend'] = {};

      showMemberCheckBox(members);
      iterationPeriodCalculator();
      topButtonEventListener();
      console.log("%c MEMBER INFORMATION IS LOADED!!", 'color: #228B22');

      deferred.resolve();
    }
  );

  return deferred.promise();
}

$(function() {
  $.when(authorizeToTrello()).done(
    function() {
      $('#indicator').css('display', 'block');
      $.when(initializing()).done(function() {
        console.log("%c @@@@@@@@@@ SCRUM IS READY!! @@@@@@@@@@", 'background: #222; color: #bada55'); 
        $('#indicator').css('display', 'none');
      });
    });
});



