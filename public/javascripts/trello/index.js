var iterationStartDay = "#datetimepicker1";
var iterationWorkDay = "#datetimepicker2";

Date.prototype.getWeekNumber = function(){
    var d = new Date(+this);
    d.setHours(0,0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
};

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

TT.filter('nameShort', function() {
  return function(input) {
    if(input.length > 8) {
      return input.substr(0, 8) + "...";
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
function($q, $timeout, $scope, $mdDialog, TrelloConnectService, $element) {

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

  var WeekNumber;


  // var dateChange = function() {
  //   var mWorkday = angular.copy($scope.workDay);
  //   var firstDay = angular.copy(Ctrl.IterationStartDay);
  //   var second = new Date(getWeeksArea(firstDay).second);

  //   var dayString = mWorkday.getDay();
  //   switch(dayString) {
  //     case 0 :  mWorkday.setDate(mWorkday.getDate() - 2);
  //       break;
  //     case 1 :  mWorkday.setDate(mWorkday.getDate() - 3);
  //       break;
  //     default : mWorkday.setDate(mWorkday.getDate() - 1); 
  //       break;
  //   }

  //   var boundIterationDate;
  //   var season;
  //   if(mWorkday.getDate() < second.getDate()) {
  //     season = 1;
  //     boundIterationDate = firstDay;
  //   } else {
  //     season = 2;
  //     boundIterationDate = second;
  //   }
  // }

  var iterationPeriodCalculator = function() {
    var mWorkday = angular.copy($scope.workDay);
    var firstDay = angular.copy(Ctrl.IterationStartDay);
    var second = new Date(getWeeksArea(firstDay).second);

    WeekNumber = firstDay.getWeekNumber(); // 몇주차 Week인지 확인

    var dayString = mWorkday.getDay();
    switch(dayString) {
      case 0 :  mWorkday.setDate(mWorkday.getDate() - 2);
        break;
      case 1 :  mWorkday.setDate(mWorkday.getDate() - 3);
        break;
      default : mWorkday.setDate(mWorkday.getDate() - 1); 
        break;
    }

    console.log("second", second);
    var boundIterationDate = firstDay;
    // var season;
    // if(mWorkday.getDate() !== second.getDate() || mWorkday < second) {
    //   season = 1;
    //   boundIterationDate = firstDay;
    // } else {
    //   season = 2;
    //   boundIterationDate = second;
    // }

    console.log("boundIterationDate", boundIterationDate);

    DumpDate = angular.copy(boundIterationDate);
    var dumpWeek = [];
    var dumpDay = [];
    for(var i = 0; i < 14; i++) {
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
    // $scope.SEASON = season;

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

  var isPrevDay = function(cardName, workDay) {
    var prevDay = false;
    var firstDate = angular.copy(Ctrl.IterationStartDay);
    var workDate = $scope.workDay;
    var prevMonth = firstDate.getMonth();

    if(workDate.getMonth() !== prevMonth) {
      var lastDay = new Date(firstDate.getFullYear(), firstDate.getMonth() + 1, 0).getDate();
      var firstDay = firstDate.getDate();

      for(var i = firstDay; i <= lastDay; i++) {
        if(i - workDay === 0) {
          prevDay = true;
          break;
        }
      }
      return prevDay;
    } else {
      return prevDay;
    }
  };

  Ctrl.getTaskState = function(card, username) {
    // console.log("card.name", card.name, card.estimate)
    if(card.estimate === undefined || card.estimate === 0 ) return "taskHide";
    if($scope.selectedMember !== "" && username !== $scope.selectedMember) {
      return "taskHide";
    }
    if(card.estimate == card.spend) {
      var workDay = ($scope.workDay).getDate();
      var lastDayWorkDay = Object.keys(card.date_spend)[Object.keys(card.date_spend).length -1];
      var isPrevWorkDay = isPrevDay(card.name, lastDayWorkDay);
      if (card.date_spend[workDay] > 0) {
        return "taskFinish";
      } else {
        return ($scope.simple) ? "taskHide" : "taskDone";
      }
    } else if(card.spend === 0) {
      return "textLabel";
    } else {
      return "taskDoing";
    }
  }

  $scope.realTask = function(element, card) {
    console.log(arguments);
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
        var workMonth = ($scope.workDay).getMonth();
        var lastDay = Object.keys(card.date_spend)[Object.keys(card.date_spend).length -1];
        if( !isPrevDay(lastDay) && lastDay < workDay ){
          mSelectedMember = false;
        } 
      } 
    }

    return mSelectedMember;
  }

  var showMemberResourceToGraph = function() {
    var _dataObj = {"estimateG" : [], "spendG" : []};
    var firstDay = angular.copy(Ctrl.IterationStartDay);
      firstDay.setDate(firstDay.getDate() -1);
    var today = new Date();
      PART = angular.copy($scope.PART);

    console.log("hihihihi", firstDay);

    if (DEBUG_MODE) console.log("member is " + $scope.MEMBERS.length);

    var estimateValForLogical = $scope.MEMBERS.length * 10 * 8;
    var estimateValForReal = PART['estimate'];

    var stopflag = false;
    for(var i = 0; i < 14; i++) {
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

        if(i !== 6 && i !== 7 && i !== 13) {
          estimateValForLogical -= ($scope.MEMBERS.length*8);
        }
        if(PART['date_spend'][firstDay.getDate()] !== undefined) {
          estimateValForReal -= PART['date_spend'][firstDay.getDate()];
          console.log("PART['date_spend'][firstDay.getDate()]", firstDay.getDate(), PART['date_spend'][firstDay.getDate()]);
        }
        console.log("estimateValForLogical", estimateValForLogical);
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
            content: function(label, xval, yval, flotItem){
              return "Orders <b>"+yval+"</b> for <span>"+chartData.axis[xval][2]+"</span>"
             },
             shifts: {
               x: -30,
               y: -50
             },
              xDateFormat: "%y-%0m-%0d",
          }
      });

      function showTooltip(x, y, contents) {
          $('<div id="tooltip">' + contents + '</div>').css({
              position: 'absolute',
              display: 'none',
              top: y + 5,
              left: x + 5,
              border: '1px solid #fdd',
              padding: '2px',
              'background-color': '#fee'
          }).appendTo("body").fadeIn(200);
      }

       $("#flot-line-chart-multi").bind("plothover", function (event, pos, item) {
          if (item) {
              if (previousPoint != item.dataIndex) {
                  previousPoint = item.dataIndex;

                  $("#tooltip").remove();
                  var x = item.datapoint[0].toFixed(0),
                      y = item.datapoint[1].toFixed(0);

                  showTooltip(item.pageX, item.pageY, y);
              }
          }
          else {
              $("#tooltip").remove();
              previousPoint = null;
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

    var getBoardWeek = function(arr, board, memberName) {
      var length = board.cards.length;
      // var plans = [];

      for(var i = 0; i < length; i++) {
        try {
          var card = board.cards[i];
          var memberLength = card.members.length;

          if(card.members === undefined) break; // 레퍼런스의 경우 멤버없음.
            for(var j = 0; j < memberLength; j++) {
              var member = card.members[j];

              if(member.username === memberName) {
                var dumpCard = angular.copy(card);
                dumpCard.name = "[" + board.name + "] " + card.name;
                dumpCard.members = getObjInArr(dumpCard.members, 'username', memberName);
                arr.push(dumpCard);
                // console.log("Add + ", member.username, " name ", dumpCard.name );
                break;
              }
            }
        } catch (e) {
          console.log(card);
        }
      }

      console.log(arr);

      // return plans;
    }

    var total_plans = [];
    var rc = " \n "

    $scope.getPlan = function() {
      if($scope.selectedMember === '') return
      
      total_plans = getPlan($scope.selectedMember);

      var resultString = getPlanner();
      resultString += getFirstArchive();
      resultString += getLastArchive();

      return resultString;
    };

    var getPlanner = function() {
      var resultString = "["+WeekNumber + "/" + (WeekNumber + 1) +"주차 계획]" + rc;
      var length = total_plans.length;

      resultString += "#  계획"+ rc;
      for(var i = 0; i < length; i++) {
        resultString += '-. ' + total_plans[i].name + rc;
        // console.log(resultString);
      }

      resultString += rc + rc;

      return resultString;
    };

    var getFirstArchive = function() {
      var firstDay = angular.copy(Ctrl.IterationStartDay);
      var second = new Date(getWeeksArea(firstDay).second).getDate();

      var resultString = "[" + WeekNumber +"주차 성과]" + rc;
      var done   = "#  진행완료" + rc;
      var doing  = "#  진행중" + rc;
      var notyet = "#  미진행" + rc;
      var length = total_plans.length;

      var first = firstDay.getDate();

      console.log("first " + first, "second " + second);

      for(var i = 0; i < length; i++) {
        var card = total_plans[i];
        var estimate = card.members[0].estimate;
        var dateSpend = card.members[0].date_spend;
        var spend = 0;
        var cardString = "-. " + card.name;

        console.log(card);
        for(day in dateSpend) {
          var dateNumber = typeof day === 'string' ? parseInt(day, 10) : day;
          if(dateNumber >= first && dateNumber < second) {
            console.log(card.name, "first " + first, "second " + second, day, dateSpend[day]);
            if(spend === 0) {
              cardString += "[" + day + " ~ "
            }
            spend += dateSpend[day];

            if(estimate === spend) {
              cardString += day + "]" + rc;
            }
          }
        }

        console.log("@@ " + cardString + " @@");
        console.log("estimate", estimate, "spend", spend);
        if(estimate === spend) {
          // 끝난경우
          done += cardString;
        } else if (spend === 0) {
          // 시작도 안한경우
          cardString += rc;
          notyet += cardString;
        } else {
          // 하다 만거
          cardString += ", (" + (spend/estimate * 100).toFixed(1) + "%)]" + rc;
          doing += cardString;
        }
      }

      return resultString + done + doing + notyet + rc + rc;
    };

    var getLastArchive = function() {
      var firstDay = angular.copy(Ctrl.IterationStartDay);
      var first = firstDay.getDate();
      var second = new Date(getWeeksArea(firstDay).second).getDate();
      var last = second + 7;

      var resultString = "[" + (WeekNumber + 1) +"주차 성과]" + rc;
      var done   = "#  진행완료" + rc;
      var doing  = "#  진행중" + rc;
      var notyet = "#  미진행" + rc;
      var length = total_plans.length;

      console.log("second " + second, "last" + (second + 7));

      for(var i = 0; i < length; i++) {
        var card = total_plans[i];
        var estimate = card.members[0].estimate;
        var dateSpend = card.members[0].date_spend;
        var spend = 0;
        var alreadySpend = 0;
        var cardString = "-. " + card.name;

        console.log(card);
        for(day in dateSpend) {
          var dateNumber = typeof day === 'string' ? parseInt(day, 10) : day;
          if(dateNumber >= second && dateNumber < last) {
            console.log(card.name, "second " + second, "last " + last, day, dateSpend[day]);
            if(spend === 0 && alreadySpend === 0) {
              if(spend + alreadySpend === estimate) {
                cardString += "[" + day + "]";
              } else {
                cardString += "[" + day + " ~ ";
              }
            }
            spend += dateSpend[day];

            if(estimate === (spend + alreadySpend)) {
              cardString += day + "]" + rc;
            }
          } else {
            if(spend === 0 && alreadySpend === 0) {
              if(spend + alreadySpend === estimate) {
                cardString += "[" + day + "]";
              } else {
                cardString += "[" + day + " ~ ";
              }
            }
            alreadySpend += dateSpend[day];
          }
        }

        console.log("@@ " + cardString + " @@");
        console.log("estimate", estimate, "spend", spend);
        if(alreadySpend === estimate) {

        } else if(estimate === (spend + alreadySpend)) {
          // 끝난경우
          done += cardString;
        } else if (spend === 0 && alreadySpend === 0) {
          // 시작도 안한경우
          cardString += rc;
          notyet += cardString;
        } else {
          // 하다 만거
          cardString += ", (" + ((spend + alreadySpend)/estimate * 100).toFixed(1) + "%)]" + rc;
          doing += cardString;
        }
      }

      return resultString + done + doing + notyet + rc + rc;
    };

    var planReview = function() {

    };

    var getPlan = function(username) {
      var length = TC.BOARDS.length;
      var mLength = TC.MEMBERS.length;

      var memberPlans = [];

      for(var i = 0; i < length; i++) {
        var board = TC.BOARDS[i];
        getBoardWeek(memberPlans, board, username);
      }

      // console.log(memberPlans);
      var length = memberPlans.length;

      for(var i = 0; i < length; i++) {
        var plan = memberPlans[i];
        // console.log(plan, plan.name);
      }

      return memberPlans;
      // getBoardWeek : function(board, memberName) {

      // },
      // getWeek : function(memberName) {

      // },
      // getArchiveFirstWeek : function(memberName) {

      // },
      // getArchiveLastWeek : function(memberName) {

      // },
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
              iterationPeriodCalculator();
              console.log($scope.workDay);

              $timeout(function() {
                $scope.$apply();
              })
            });
          }, 2000);
        }, function(error) {
          console.log(error);
          if(error.status === 401) {
            setTimeout(function() {
              location.href = "";
            }, 1000);
          }
        }
      );
    }
});

