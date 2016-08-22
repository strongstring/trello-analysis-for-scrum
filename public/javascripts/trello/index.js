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

  // memberSelector.empty();

  // for(memberName in members) {
  //   memberSelector.append(
  //     '<div class="checkbox col-md-3" style="margin-top:0px;"><label>'
  //     + '<input class="checkbox" type="checkbox" checked value="'+ memberName +'">' 
  //     + members[memberName]['fullName'] + '</label></div>'
  //   );
  // }

  // memberSelector.append(
  //   '<button class="btn btn-primary" style="margin-left:10px;" onClick="unCheck()">Uncheck</button>'
  // );

  // $(".checkbox").change(reDrawTask);
};

var unCheck = function() {
  $('input.checkbox').attr('checked', false)
}

var showMemberResource = function() {
  // $('#projectDashBoard').empty();
  // $('#projectDashBoard').append(
  //   '<div class="panel panel-default">'
  //   + '<div class="panel-heading panel-title">Total Project Resource</div>'
  //   + '<div class="panel-body" id="total_resource"></div>'
  // );
  // var _resouceTable = '<table class="table col-md-12"><tr class="primary"><td>Member</td><td>E</td>';

  // var firstDay = new Date($(iterationStartDay).data()['date']),
  //   workDay = new Date($(iterationWorkDay).data()['date']);

  // for(var i = 0; i < ITERATION_PERIOD; i++) {
  //   if(firstDay.getDate() === workDay.getDate()) {
  //     _resouceTable += '<td style="border-left:solid 2px; border-right:solid 2px;">' + firstDay.getDate() + '</td>';
  //   } else {
  //     _resouceTable += '<td>' + firstDay.getDate() + '</td>';
  //   }
  //   firstDay.setDate(firstDay.getDate() + 1);
  // }

  // _resouceTable += '<td>R</td></tr>';

  // for (memberName in PART.members) {
  //   var _member = PART['members'][memberName],
  //     _date = new Date($(iterationStartDay).data()['date']);

  //   _resouceTable += '<tr><td class="textLabel">' + _member['fullName'] + '</td><td>'+ _member['estimate'].toFixed(1) +'</td>';
  //   for(var j = 0; j < ITERATION_PERIOD; j++) {
  //     var _dateSpend = _member['date_spend'][_date.getDate()];
  //     _dateSpend = (_dateSpend === undefined) ? ' ' : _dateSpend.toFixed(1);
  //     if(_dateSpend < 0.1) _dateSpend = ' ';

  //     if(parseInt(_date.getDate()) === parseInt(workDay.getDate())) {
  //       _resouceTable += '<td style="border-left:solid 2px; border-right:solid 2px;">' + _dateSpend + '</td>';
  //     } else {
  //       _resouceTable += '<td>' + _dateSpend + '</td>'
  //     }
  //     _date.setDate(_date.getDate() + 1);
  //   }
  //   _resouceTable += '<td>'+ (_member['estimate'] - _member['spend']).toFixed(1) +'</td></tr>';
  // }

  // _resouceTable += '</table>';
  // $('#total_resource').append(_resouceTable);
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




var reDrawTask = function() {
  $('#projectDashBoard').empty();
  showMemberResource();
  showProjectResource();
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


TT.filter('short', function() {
  return function(input) {
    if(input.length > 20) {
      return input.substr(0, 20) + "...";
    } else {
      return input;
    }
  }
});

TT.filter('cutZero', function() {
  return function(input) {
    if(input === 0) {
      return "";
    } else {
      return input;
    }
  }
});

TT.controller('TrelloController', 
function($q, $timeout, $scope, $mdDialog, TrelloConnectService) {

  var Ctrl = this;
  var TC = new TrelloConnectService();

  $scope.MEMBERS = [];
  $scope.SEASON = 1;
  $scope.ITERATION_Date = new Date();
  $scope.WEEK = [];
  $scope.DAY = [];
  $scope.simple = true;
  $scope.selectedMember = "";

  var iterationCalc = function() {
    // var firstDay = new Date($(iterationStartDay).data()['date']),
    // workDay = new Date($(iterationWorkDay).data()['date']);
    var workDay = new Date($(iterationWorkDay).data().date);
    var first = new Date($(iterationStartDay).data().date);
    var area = getWeeksArea(first);
    var second = new Date(area.second);

    console.log("area", area);
    console.log("workDay", workDay);
    console.log("first", first);
    console.log("second", second);
    if(workDay < second) {
      $scope.SEASON = 1;
      $scope.ITERATION_Date = first;
    } else {
      $scope.SEASON = 2;
      $scope.ITERATION_Date = second;
    }

    DumpDate = angular.copy($scope.ITERATION_Date);
    var dumpWeek = [];
    var dumpDay = [];
    for(var i = 0; i < 5; i++) {

      dumpWeek[i] = DumpDate.getMonth() + 1 + '/' + DumpDate.getDate();
      dumpDay[i] = DumpDate.getDate();
      DumpDate.setDate(DumpDate.getDate() + 1);
      console.log(dumpWeek);
      console.log(dumpDay);
    }
    $scope.WEEK = angular.copy(dumpWeek);
    $scope.DAY = angular.copy(dumpDay);

    setTimeout(function() {
      $scope.$apply();
    });
  };

  var iterationPeriodCalculator = function() {
    var _workday = new Date(),
      _baseIterationDate = getIterationStartDay();

    _workday.setDate(_workday.getDate() -1);

    $(iterationStartDay).datetimepicker({
      defaultDate: _baseIterationDate,
      format: 'YYYY-MM-DD'
    });
    $(iterationWorkDay).datetimepicker({
      defaultDate : getDateString(_workday),
      format: 'YYYY-MM-DD'
    });

    $(iterationStartDay).on("dp.change", iterationCalc);
    $(iterationWorkDay).on("dp.change", iterationCalc);

    // $('#exportExcel').attr('download', 'HResouce_'+getDateString(new Date(_baseIterationDate))+'.xls');
  }

  Ctrl.getTaskState = function(card) {
    if((card.estimate - card.spend) === 0) {
      var yest = (new Date()).getDate() - 1;
      if(card.date_spend[yest] > 0) {
        return "taskFinish";
      } else {
        return "taskDone";
      }
    } else if(card.spend !== 0) {
      return "taskDoing";
    } else {
      return "textLabel";
    }
  }

  $scope.realTask = function(card) {

    var isSelected = false;
    if(card.members === undefined) return false;
    if($scope.selectedMember !== "") {
      var length = card.members.length;
      for(var i = 0; i < length; i++) {
        if(card.members[i].username === $scope.selectedMember) {
          isSelected = true;
          break;
        }
      }
    } else {
      isSelected = true;
    }

    if($scope.simple) {
      if(card.estimate > 0 && card.estimate === card.spend){
        var datee = (new Date()).getDate();
        if(card.date_spend[datee-1] > 0 || card.date_spend[datee] > 0 ) {
          return true;
        } else {
          return false;
        }        
      } else {
        if(isSelected) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      if(card.estimate > 0 && isSelected){
        return true;
      } else {
        return false;
      }
    }
  }

  var showMemberResourceToGraph = function() {
    var _dataObj = {"estimateG" : [], "spendG" : []},
      firstDay = new Date($(iterationStartDay).data().date),
      today = new Date();
      targetElement = $('#flot-line-chart-multi');
      PART = angular.copy($scope.PART);

    firstDay.setDate(firstDay.getDate() - 1);

    if (DEBUG_MODE) console.log("member is " + $scope.MEMBERS.length);

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

        estimateValForLogical -= ($scope.MEMBERS.length*5.75);
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

    Ctrl.showDesc = function(ev, card) {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title(card.name)
          .textContent(card.desc)
          .ariaLabel('Alert Dialog Demo')
          .ok('Got it!')
          .targetEvent(ev)
      );
    };

    Ctrl.getDesc = function(card) {
      if(card.desc !== undefined && card.desc.length !== 0) {
        return true;
      } else {
        return  false;
      }
    };

    Ctrl.openWindow = function(card) {
      window.open(card.url, '_blank');
      window.focus();
    }

    Ctrl.init = function() {
      $('#indicator').css('display', 'block');
      TC.init().then(
        function(results) {
          console.log("%c @@@@@@@@@@ SCRUM IS READY!! @@@@@@@@@@", 'background: #222; color: #bada55'); 

          $scope.MEMBERS = TC.MEMBERS;
          $scope.BOARDS = TC.BOARDS;
          $scope.PART = TC.PART;
          // console.log("MEMBERS", $scope.MEMBERS);
          console.log("BOARDS", $scope.BOARDS);
          iterationPeriodCalculator();
          iterationCalc(); 
          // showMemberResourceToGraph();
          $timeout(function() {
            showMemberResourceToGraph();
            $('#indicator').css('display', 'none');
          }, 2000);
        }
      );
    }
});

