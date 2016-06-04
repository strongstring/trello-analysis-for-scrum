var iterationStartDay = "#datetimepicker1";
var iterationWorkDay = "#datetimepicker2";

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

// LOGICAL
var getMemberInformation = function() {
  var deferred = $.Deferred(),
    deferredArr = [],
    _memberObj = {};

  for(ProjectName in BOARD) {
    deferredArr.push(
      Trello.get('/boards/' + BOARD[ProjectName]['id'] + '/members/', 
      function(members) {
        for(var i = 0; i < members.length; i++) {
          var _key = members[i]['username'];
          if(_memberObj[_key] === undefined) _memberObj[_key] = members[i];
        }
      }, function(error) {
        console.log(error);
      })
    );
  }

  $.when.apply($, deferredArr).done(function() {
    deferred.resolve(_memberObj);
  });
  
  return deferred.promise();
};

// INTERFACE
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
          _resouceTable += '<tr class="taskDone">';
        } else if (_card['spend'] !== undefined && _card['spend'] > 0) { 
          _resouceTable += '<tr class="taskDoing">';
        } else {
          _resouceTable += '<tr>';
        }

        _resouceTable += '<td rowspan="'+memCount+'" class="textLabel"><a onClick="openWindow(\''+_card['url']+'\')">' + _card['name'] + '</a></td>';

        var memLineCount = 0;
        for(memberName in _card['members']) {
          if(isSelectedMember(memberName)) {
            var _date = new Date($(iterationStartDay).data()['date']),
              _member = _card['members'][memberName];

            if(_member['estimate'] !== undefined && _member['estimate'] > 0.0) {

              if(memLineCount !== 0) {
                if(_member['spend'] === _member['estimate']) {
                  _resouceTable += '<tr class="taskDone">';
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

      estimateValForLogical -= (memCount*8);
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
        + '<a href="#' + _project['name'] + '">'
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

  $('.resourceMenu').css('display', 'block');
};

var getBoardInfo = function(boardID) {
  var _obj = {};

  for (boardName in BOARD) {
    if (BOARD[boardName]['id'] === boardID) {
      _obj['board'] = boardName;
      _obj['name'] = BOARD[boardName]['name'];
      break;
    }
  }

  return _obj;
}

var getSNE = function(boardID, cards) {
  var deferred = $.Deferred(),
  targetBoardName = getBoardInfo(boardID)['board'];

  if(PART['project'][targetBoardName] === undefined) PART['project'][targetBoardName] = {};
  PART.project[targetBoardName]['name'] = getBoardInfo(boardID)['name'];
  PART.project[targetBoardName]['cards'] = [];

  // calculate comment S&E
  for (var i = 0; i < cards.length; i++) {
    var _card = cards[i],
      _cardName;

    for ( var j = 0; j < _card.actions.length; j++) {
      var _action = _card.actions[j];

      if(j === 0) _card['name'] = _card.actions[j].data.card.name;

      // check 'plus!' about S & E comment)
      if(_action.type !== 'updateCard' && _action.data.text !== null && _action.data.text.indexOf('plus!') !== -1 && _action.data.text.indexOf('^resetsync') === -1) {
        var _commentText = _action.data.text.substring(6);
        var _commentInfo = _commentText.split(' '),
          duplicatedFlag = false,
          // _member = new Array(_action.memberCreator.username),
          _member = new Array(),
          _date = new Date(_action.date);

        for( var k = 0; k < _commentInfo.length; k++) {
          if(_commentInfo[k].indexOf('@') !== -1) {
            // S&E Member Setting
            duplicatedFlag = false;
            if(_commentInfo[k].substring(1) === "me") {
              _member.push(_action.memberCreator.username);
            } else {
              _member.push(_commentInfo[k].substring(1));
            }
          } else if (_commentInfo[k].indexOf('d') !== -1) {
            // S&E Date Setting
            _date.setDate(_date.getDate() + parseInt(_commentInfo[k].substring(0, 2)));
          } else if ((_commentInfo[k].indexOf('/') !== -1 || parseFloat(_commentInfo[k]) !== NaN) && _commentInfo[k] !== '') {
            // var _timeArr = _commentInfo[k].split('/');
            var _timeArr = [];
            if(_commentInfo[k].indexOf('/') !== -1 ) {
              _timeArr = _commentInfo[k].split('/');
            } else {
              _timeArr[0] = _commentInfo[k];
              _timeArr[1] = 0;
            }
            var spendValue = parseFloat(_timeArr[0]),
              estimateValue = parseFloat(_timeArr[1]);

            // if dont have @username, that S
            if(_member.length === 0) _member.push(_action.memberCreator.username);

            // for double S&E in one comment line
            if(!duplicatedFlag) {
              // add info in card
              if(_card['spend'] === undefined) _card['spend'] = 0;
              if(_card['estimate'] === undefined) _card['estimate'] = 0;
              if(_card['date_spend'] === undefined) _card['date_spend'] = {};

              for (var m = 0; m < _member.length; m++) {
                // add member in card
                if(_card['members'] === undefined) _card['members'] = {};
                if(_card['members'][_member[m]] === undefined)  _card['members'][_member[m]] = {};
                if(_card['members'][_member[m]]['fullName'] === undefined) _card['members'][_member[m]]['fullName'] = PART['members'][_member[m]]['fullName'];
                if(_card['members'][_member[m]]['date_spend'] === undefined) _card['members'][_member[m]]['date_spend'] = {};
                if(_card['members'][_member[m]]['spend'] === undefined)  _card['members'][_member[m]]['spend'] = 0;
                if(_card['members'][_member[m]]['estimate'] === undefined) _card['members'][_member[m]]['estimate'] = 0;

                // add member in card
                if(PART['members'] === undefined) PART['members'] = {};
                if(PART['members'][_member[m]] === undefined) PART['members'][_member[m]] = {};
                if(PART['members'][_member[m]]['date_spend'] === undefined) PART['members'][_member[m]]['date_spend'] = {};
                if(PART['members'][_member[m]]['spend'] === undefined)  PART['members'][_member[m]]['spend'] = 0;
                if(PART['members'][_member[m]]['estimate'] === undefined) PART['members'][_member[m]]['estimate'] = 0;

                if(parseFloat(_timeArr[0]) !== NaN) {
                  // add spend in member in card
                  if(_card['members'][_member[m]]['date_spend'][_date.getDate()]  === undefined) 
                    _card['members'][_member[m]]['date_spend'][_date.getDate()] = 0;
                  if(_card['date_spend'][_date.getDate()] === undefined) 
                    _card['date_spend'][_date.getDate()] = 0;
                  if(PART['members'][_member[m]]['date_spend'][_date.getDate()] === undefined) 
                    PART['members'][_member[m]]['date_spend'][_date.getDate()] = 0;

                  _card['members'][_member[m]]['date_spend'][_date.getDate()] += spendValue;
                  _card['date_spend'][_date.getDate()] += spendValue;
                  _card['members'][_member[m]]['spend'] += spendValue;
                  _card['spend'] += spendValue

                  PART['members'][_member[m]]['date_spend'][_date.getDate()] += spendValue;
                  PART['members'][_member[m]]['spend'] += spendValue;
                }

                if(parseFloat(_timeArr[1]) !== NaN) {
                  // add estimate in member in card
                  _card['members'][_member[m]]['estimate'] += estimateValue;
                  _card['estimate'] += estimateValue

                  PART['members'][_member[m]]['estimate'] += estimateValue;
                }
              } // for (m) : member counter
              duplicatedFlag = true;
            }
          }
        } // for (k)
      } // if (check 'plus!' about S & E comment)
    } // for (j)
    PART.project[targetBoardName]['cards'].push(_card);
  } // for (i)

  deferred.resolve();
  return deferred.promise();
};

var calcSNE = function(boardID) {
  var targetBoard = PART['project'][getBoardInfo(boardID)['board']];

  // to team
  if(PART['spend'] === undefined) PART['spend'] = 0;
  if(PART['estimate'] === undefined) PART['estimate'] = 0;
  if(PART['date_spend'] === undefined) PART['date_spend'] = {};

  // to project
  if(targetBoard['spend'] === undefined) targetBoard['spend'] = 0;
  if(targetBoard['estimate'] === undefined) targetBoard['estimate'] = 0;
  if(targetBoard['date_spend'] === undefined) targetBoard['date_spend'] = {};

  for (var i = 0; i < targetBoard['cards'].length; i++) {
    var _card = targetBoard['cards'][i];

    if(_card['spend'] !== undefined) {
      PART['spend'] += _card['spend'];
      targetBoard['spend'] += _card['spend'];
    }

    if(_card['estimate'] !== undefined) {
      PART['estimate'] += _card['estimate'];
      targetBoard['estimate'] += _card['estimate'];
    }
    
    if(_card['date_spend'] !== undefined) {
      for(_dateKey in _card['date_spend']) {
        if(PART['date_spend'][_dateKey] === undefined) PART['date_spend'][_dateKey] = 0;
        if(targetBoard['date_spend'][_dateKey] === undefined) targetBoard['date_spend'][_dateKey] = 0;

        PART['date_spend'][_dateKey] += _card['date_spend'][_dateKey];
        targetBoard['date_spend'][_dateKey] += _card['date_spend'][_dateKey];
      }
    }
  }
}

// LOGICAL
var getActionToBoard = function(boardID) {
  var deferred = $.Deferred(),
    _obj = {};

  Trello.get('/boards/' + boardID 
    + '/cards/?field=&actions=commentCard,updateCard:name&actions_limit=1000&action_memberCreator_fields=fullName,initials,username,url,idPremOrgsAdmin&checklists=none&cards=visible',
    function(res) {
      if(DEBUG_MODE) console.log(res);
      $.when(getSNE(boardID, res)).done(function(){
        console.log("%c " + getBoardInfo(boardID)['name'] + " IS GAIN !!", 'color: #228B22');
        $.when(calcSNE(boardID)).done(function() {
          console.log("%c " + getBoardInfo(boardID)['name'] + " IS CALCULATED !!", 'color: #228B22');
          deferred.resolve();
        });
      });
  }, function(error) {
    console.log(error);
  });

  return deferred.promise();
}

var calcStart = function() {
  var deferred = [];

  // var count = 0;
  for(boardName in BOARD) {
    // if(count === 2) break;
    console.log("push board data " + BOARD[boardName]['name']);
    deferred.push(getActionToBoard(BOARD[boardName]['id']));
    // count++;
  }

  $.when.apply($, deferred).done(
    function() {
      showProjectPreview();
      showMemberResourceToGraph();
      showMemberResource();
      showProjectResource();
      prepareExcel();
      $('#exportExcel').removeClass('disabled');
      console.log("%c @@@@@@@@@@  ALL ACTION IS CALCULATED!! @@@@@@@@@@", 'background: #222; color: #bada55'); 
      $('#indicator').css('display', 'none');
  });

}

var clearMemeber = function() {

  $.when(getMemberInformation()).done(
    function(members) {
      for(member in members) {
        PART['members'][member] = {};
        PART['members'][member]['fullName'] = members[member]['fullName'];
        PART['members'][member]['estimate'] = 0;
        PART['members'][member]['spend'] = 0;
        PART['members'][member]['date_spend'] = {};
      }

      PART['estimate'] = 0;
      PART['spend'] = 0;
      PART['date_spend'] = {};
    });
}

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

var authorizeToTrello = function() {

  var deferred = $.Deferred();
  var onAuthorize = function() { console.log("Successful authentication"); deferred.resolve();};
  var authenticationFailure = function() { console.log("Failed authentication"); deferred.reject();};

  Trello.authorize({
      type: "popup",
      success: onAuthorize
  });

  return deferred.promise();
};

var reDrawTask = function() {
  $('#projectDashBoard').empty();
  showMemberResource();
  showProjectResource();
}

var searchSNE = function() {
  $('#indicator').css('display', 'block');
    clearMemeber();
    calcStart();
  $('#startSearch').css('display', 'none');
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
