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
  Ctrl.IterationStartDay = getIterationStartDay();
  $scope.workDay = new Date();
  $scope.WEEK = [];
  $scope.DAY = [];
  $scope.simple = true;
  $scope.selectedMember = "";
  Ctrl.holyday = [];


  var iterationPeriodCalculator = function() {
    var mWorkday = angular.copy($scope.workDay);
    var firstDay = angular.copy(Ctrl.IterationStartDay);
    var second = new Date(getWeeksArea(firstDay).second);

    var dayString = mWorkday.getDay();
    switch(dayString) {
      case 0 :  mWorkday.setDate(mWorkday.getDate() - 2);
        break;
      case 1 :  mWorkday.setDate(mWorkday.getDate() - 3);
        break;
      default : mWorkday.setDate(mWorkday.getDate() - 1); 
        break;
    }

    var boundIterationDate;
    var season;
    if(mWorkday < second) {
      season = 1;
      boundIterationDate = firstDay;
    } else {
      season = 2;
      boundIterationDate = second;
    }

    DumpDate = angular.copy(boundIterationDate);
    var dumpWeek = [];
    var dumpDay = [];
    for(var i = 0; i < 7; i++) {
      console.log("DumpDate", DumpDate.getDay());
      dumpWeek[i] = DumpDate.getMonth() + 1 + '/' + DumpDate.getDate();
      dumpDay[i] = DumpDate.getDate();
      if(DumpDate.getDay() === 6 || DumpDate.getDay() === 0) {
        Ctrl.holyday.push(angular.copy(dumpDay[i]));
      }
      console.log(dumpWeek);
      console.log(dumpDay);
      DumpDate.setDate(DumpDate.getDate() + 1);
    }
    $scope.WEEK = angular.copy(dumpWeek);
    $scope.DAY = angular.copy(dumpDay);
    $scope.workDay = mWorkday;
    $scope.SEASON = season;

    console.log("Ctrl.holyday", Ctrl.holyday);

    setTimeout(function() {
      $scope.$apply();
    });
  }

  Ctrl.isWorkDay = function(day) {
    if(day === ($scope.workDay).getDate()) {
      return true;
    } else {
      return false;
    }
  };

  Ctrl.isHolyday = function(day) {
    if(Ctrl.holyday.indexOf(day) === -1) {
      return false;
    } else {
      return true;
    }
  }

  Ctrl.getTaskState = function(card) {
    if((card.estimate - card.spend) === 0) {
      var workDay = ($scope.workDay).getDate();
      if(card.date_spend[workDay] > 0) {
        return "taskFinish";
      } else {
        if(Object.keys(card.date_spend)[Object.keys(card.date_spend).length -1]  > workDay) {
          return "taskDoing";
        } else {
          return "taskDone";
        }
      }
    } else if(card.spend !== 0) {
      return "taskDoing";
    } else {
      return "textLabel";
    }
  }

  $scope.realTask = function(card) {

    if(card.members === undefined || card.estimate <= 0) return false;

    var mSelectedMember = false;
    if($scope.selectedMember !== "") {
      var length = card.members.length;
      for(var i = 0; i < length; i++) {
        if(card.members[i].username === $scope.selectedMember) {
          mSelectedMember = true;
          break;
        }
      }
    } else {
      mSelectedMember = true;
    }

    if(card.estimate === card.spend){
      if($scope.simple) {
        var workDay = ($scope.workDay).getDate();
        if(Object.keys(card.date_spend)[Object.keys(card.date_spend).length -1] < workDay) {
          mSelectedMember = false;
        }
      } 
    }

    return mSelectedMember;
  }

  var showMemberResourceToGraph = function() {
    var _dataObj = {"estimateG" : [], "spendG" : []};
    var firstDay = Ctrl.IterationStartDay;
      // firstDay = new Date($(iterationStartDay).data().date),
      today = new Date();
      targetElement = $('#flot-line-chart-multi');
      PART = angular.copy($scope.PART);

    console.log("hihihihi", firstDay);

    if (DEBUG_MODE) console.log("member is " + $scope.MEMBERS.length);

    var estimateValForLogical = PART['estimate'],
      estimateValForReal = PART['estimate'];

    var stopflag = false;
    for(var i = 0; i < 13; i++) {
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

        if(i !== 5 && i !== 6 && i !== 11 && i !== 12) {
          estimateValForLogical -= ($scope.MEMBERS.length*8);
        }
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

    $scope.isSelectedMember = function(member) {
      console.log(member.username);
      if(member.username === $scope.selectedMember) {
        return true;
      } else {
        return false;
      }
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

    Ctrl.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };



    Ctrl.DEBUG = {
      getTaskResouce : function(ev, card) {
        console.log(card);
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title(card.name)
            .textContent("card.estimate" + card.estimate + ", card.spend" + card.spend + ", card.date_spend" + JSON.stringify(card.date_spend))
            .ariaLabel('Alert Dialog Demo')
            .ok('Got it!')
            .targetEvent(ev)
        );
      },
      getMemberResouce : function(ev, member) {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title(member.fullName)
            .textContent("member.estimate" + member.estimate + ", member.spend" + member.spend + ", member.date_spend" + JSON.stringify(member.date_spend))
            .ariaLabel('Alert Dialog Demo')
            .ok('Got it!')
            .targetEvent(ev)
        );
      },
    };

    Ctrl.announceClick = function(member) {
      if(member.username === 'mobile') {
        $scope.selectedMember = '';
      } else {
        $scope.selectedMember = member.username;
      }
      // $mdDialog.show(
      //   $mdDialog.alert()
      //     .title('You clicked!')
      //     .textContent('You clicked the menu item at member ' + member.username)
      //     .ok('Nice')
      //     .targetEvent(originatorEv)
      // );
      // originatorEv = null;
    };

    Ctrl.init = function() {
      $('#indicator').css('display', 'block');
      TC.init().then(
        function(results) {
          console.log("%c @@@@@@@@@@ SCRUM IS READY!! @@@@@@@@@@", 'background: #222; color: #bada55'); 

          $scope.MEMBERS = TC.MEMBERS;
          $scope.BOARDS = TC.BOARDS;
          $scope.PART = TC.PART;
          console.log("BOARDS", $scope.BOARDS);
          iterationPeriodCalculator();
          $timeout(function() {
            showMemberResourceToGraph();
            $('#indicator').css('display', 'none');

            $(iterationStartDay).datetimepicker({
              defaultDate: getIterationStartDay(),
              format: 'YYYY-MM-DD'
            });

            $(iterationWorkDay).datetimepicker({
              defaultDate : $scope.workDay,
              format: 'YYYY-MM-DD'
            });

            $(iterationStartDay).on("dp.change", function(data) {
              console.log(data);
            });
            $(iterationWorkDay).on("dp.change", function(data) {
              $scope.workDay = new Date($(iterationWorkDay).data().date);
              console.log($scope.workDay);

              $timeout(function() {
                $scope.$apply();
              })
            });

          }, 2000);
        }, function(error) {
          localStorage.removeItem('trello_token');
          location.reload();
        }
      );
    }
});

