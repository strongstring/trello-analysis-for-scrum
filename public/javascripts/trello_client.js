var DEBUG_MODE = false;

var COMMON_ID = "I02GmIoD",
  IPOLIS_ID = "3UZJ3kPG",
  SSM_ID = "g0DBnhdi",
  SMARTCAM_ID = "nisQ181R",
  WISENET_ID = "duBw0VfK",
  ARGUS_ID = "u6SqfXJ9";

var MOBILE_PART = {
  members : {},
  project : {
    "common" : {}, 
    "ipolis" : {},
    "ssm" : {},
    "smartcam" : {},
    "wisenet" : {},
    "argus" : {},
  },
};

var objectCopy = function(obj) {
 return JSON.parse(JSON.stringify(obj));
}


var authorizeToTrello = function() {

  var authenticationSuccess = function() { console.log("Successful authentication"); };
  var authenticationFailure = function() { console.log("Failed authentication"); };

  Trello.authorize({
    type: "popup",
    name: "Getting Started Application",
    scope: {
      read: true,
      write: true },
    expiration: "never",
    success: authenticationSuccess,
    error: authenticationFailure
  });
};

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
  var _date;

  var dd = date.getDate(),
    mm = date.getMonth() + 1,
    yyyy = date.getFullYear();

    if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 
    _date = yyyy+'-'+mm+'-'+dd;

    return _date;
}

var getDayFromDate = function(date) {
  var _date;

  var dd = date.getDate(),
    mm = date.getMonth() + 1,
    yyyy = date.getFullYear();

    if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 
    _date = yyyy+'-'+mm+'-'+dd;

    return _date;
}

// LOGICAL
var getMember = function() {
  var deferred = $.Deferred(),
    _memberObj = {};

  Trello.get('/boards/' + COMMON_ID + '/members/', 
  function(members) {
    for(var i = 0; i < members.length; i++) {
      var _key = members[i]['username'];
      _memberObj[_key] = members[i];
    }
    deferred.resolve(_memberObj);
  }, function(error) {
    console.log(error);
  })

  return deferred.promise();
};

// INTERFACE
var getSelectedMember = function() {
  var _arr = [],
    _checkedID = $('#memberSelectForm div input:checked');

  for(member in MOBILE_PART['members']) {
    for(var j = 0; j <_checkedID.length; j++) {
      if(member === _checkedID[j].value) _arr.push(member);
    }
  }
  // for(var i = 0; i < MOBILE_PART.members.length; i++) {
  //   for(var j = 0; j <_checkedID.length; j++) {
  //     if(MOBILE_PART.members[i].id === _checkedID[j].value) _obj.push(MOBILE_PART.members[i]);
  //   }
  // }
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

var getMemberIndex = function(userName) {
    
  var _index = -1;

  for(var i = 0; i < MOBILE_PART.members.length; i++) {
    if(MOBILE_PART.members[i].username === userName) _index = i;
  }
  return _index;
};

var showMemberCheckBox = function(members) {
  var memberSelector = $('#memberSelectForm');

  memberSelector.empty();

  for(memberName in members) {
    memberSelector.append(
      '<div class="checkbox col-md-6" style="margin-top:0px;"><label>'
      + '<input type="checkbox" checked value="'+ memberName +'">' 
      + memberName + '</label></div>'
    );
  }
}

var showMemberResource = function() {
  $('#projectDashBoard').empty();
  $('#projectDashBoard').append('<div class="panel panel-default"><div class="panel-heading panel-title">Total Project Resource</div><div class="panel-body" id="total_resource"></div>');
  var _resouceTable = '<table class="table"><tr class="primary">'
    + '<td>Member</td><td>E</td>';

  var firstDay = new Date($('#iterationStartDay').val()),
    workDay = new Date($('#workDay').val());

  for(var i = 0; i < 14; i++) {
    if(firstDay.getDate() === workDay.getDate()) {
      _resouceTable += '<td style="border-left:solid 2px; border-right:solid 2px;">' + firstDay.getDate() + '</td>';
    } else {
      _resouceTable += '<td>' + firstDay.getDate() + '</td>';
    }
    firstDay.setDate(firstDay.getDate() + 1);
  }

  _resouceTable += '<td>R</td></tr>';

  for (memberName in MOBILE_PART.members) {
    var _member = MOBILE_PART['members'][memberName],
      _date = new Date($('#iterationStartDay').val());

    _resouceTable += '<tr><td class="textLabel">' + memberName + '</td><td>'+ _member['estimate'].toFixed(1) +'</td>';
    for(var j = 0; j < 14; j++) {
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

  for(projectName in MOBILE_PART['project']) {
    var _project = MOBILE_PART['project'][projectName];

    var _resouceTable = '<div class="panel panel-default"><div class="panel-heading panel-title">' + MOBILE_PART['project'][projectName]['name'] + '</div><div class="panel-body">'
      + '<table class="table"><tr class="primary">' + '<td>Task</td><td>Member</td><td>E</td>';
    console.log("project : " + projectName + ", cardLength : " + _project['cards'].length);

    var firstDay = new Date($('#iterationStartDay').val()),
      workDay = new Date($('#workDay').val());

    for(var i = 0; i < 14; i++) {
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

      if(memCount > 0) {
        if(_card['estimate'] !== undefined && _card['estimate'] !== 0) {
          if(_card['spend'] === _card['estimate']) {
            _resouceTable += '<tr class="taskDone"><td rowspan="'+memCount+'" class="textLabel">' + _card['name'] + '</td>';
          } else if (_card['spend'] !== undefined && _card['spend'] > 0) { 
            _resouceTable += '<tr class="taskDoing"><td rowspan="'+memCount+'" class="textLabel">' + _card['name'] + '</td>';
          } else {
            _resouceTable += '<tr><td rowspan="'+memCount+'" class="textLabel">' + _card['name'] + '</td>';
          }

          var memLineCount = 0;
          for(memberName in _card['members']) {
            if(isSelectedMember(memberName)) {
              var _date = new Date($('#iterationStartDay').val());

              if(_card['members'][memberName]['estimate'] !== undefined && _card['members'][memberName]['estimate'] > 0.0) {

                if(memLineCount === 0) {
                  // _resouceTable += '<tr>'
                  _resouceTable += '<td class="textLabel">' + memberName + '</td><td>'+ _card['members'][memberName]['estimate'].toFixed(1) +'</td>';
                } else {
                  if(_card['members'][memberName]['spend'] === _card['members'][memberName]['estimate']) {
                    _resouceTable += '<tr class="taskDone"><td class="textLabel">' + memberName + '</td><td>'+ _card['members'][memberName]['estimate'].toFixed(1) +'</td>';
                  } else if (_card['members'][memberName]['spend'] !== undefined && _card['members'][memberName]['spend'] > 0) {
                    _resouceTable += '<tr class="taskDoing"><td class="textLabel">' + memberName + '</td><td>'+ _card['members'][memberName]['estimate'].toFixed(1) +'</td>';
                  } else {
                    _resouceTable += '<tr><td class="textLabel">' + memberName + '</td><td>'+ _card['members'][memberName]['estimate'].toFixed(1) +'</td>';
                  }
                }

                for(var k = 0; k < 14; k++) {
                  var _dateSpend = _card['members'][memberName]['date_spend'][_date.getDate()];
                  _dateSpend = (_dateSpend === undefined) ? ' ' : _dateSpend.toFixed(1);
                  if(_dateSpend < 0.1) _dateSpend = ' ';

                  if(_date.getDate() === workDay.getDate()) {
                    _resouceTable += '<td style="border-left:solid 2px; border-right:solid 2px;">' + _dateSpend + '</td>';
                  } else {
                    _resouceTable += '<td>' + _dateSpend + '</td>'
                  }
                  _date.setDate(_date.getDate() + 1);
                }

                _resouceTable += '<td>'+ (_card['members'][memberName]['estimate'] - _card['members'][memberName]['spend']).toFixed(1) +'</td></tr>';
                memLineCount ++;
              }
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
    firstDay = new Date($('#iterationStartDay').val()),
    today = new Date();
    targetElement = $('#flot-line-chart-multi');

  firstDay.setDate(firstDay.getDate() - 1);

  var memCount = 6;
  // for(member in MOBILE_PART['members']) {
  //   memCount ++;
  // }

  console.log("member is " + memCount);

  var estimateValForLogical = MOBILE_PART['estimate'],
    estimateValForReal = MOBILE_PART['estimate'];

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
      console.log(estimateValForLogical);
      if(MOBILE_PART['date_spend'][firstDay.getDate()] !== undefined) {
        estimateValForReal -= MOBILE_PART['date_spend'][firstDay.getDate()];
      }

      _estimateData.push(estimateValForLogical);
      _spendData.push(estimateValForReal);
    }
    _dataObj['spendG'].push(_estimateData);
    if(!stopflag) _dataObj['estimateG'].push(_spendData);
  }

  console.log(_dataObj);

  $.plot($("#flot-line-chart-multi"), [{
        data: _dataObj['estimateG'],
        label: "LOGICAL ESTIMATE GRAPH"
    }, {
        data: _dataObj['spendG'],
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

var showlogMemberResource = function() {
  for(var i = 0; i < MOBILE_PART.members.length; i++) {
    console.log('name : ' + MOBILE_PART.members[i].username);
    console.log('estimate : '+ MOBILE_PART.members[i].estimate);
    console.log('spend : '+ MOBILE_PART.members[i].spend);
    for( spendDate in MOBILE_PART.members[i]['date_spend']) {
      console.log('date_spend : ' + spendDate +  ' : ' + MOBILE_PART.members[i]['date_spend'][spendDate]);
    }
  }
}

var showlogMemberResourceFromBoard = function(boardID) {
  var _obj = {"members" : {}, "cards" : [], "spend" : 0, "estimate" : 0, "date_spend" : []},
    targetBoardName = "common";

  switch(boardID) {
    case "I02GmIoD" : targetBoardName = "common"; break;
    case "3UZJ3kPG" : targetBoardName = "ipolis"; break;
    case "g0DBnhdi" : targetBoardName = "ssm"; break;
    case "nisQ181R" : targetBoardName = "smartcam"; break;
    case "duBw0VfK" : targetBoardName = "wisenet"; break;
    case "u6SqfXJ9" : targetBoardName = "argus"; break;
    default : break;
  }

  var _targetBoard = MOBILE_PART['project'][targetBoardName];
  for(var i = 0; i < _targetBoard['cards'].length; i++) {
    var _card = _targetBoard['cards'][i];

    _card['spend'] = 0;
    _card['estimate'] = 0;
    _card['date_spend'] = {};
    console.log("=======================");
    console.log("card" + i + ": " + _card['name']);

    if(_card.members !== undefined) {
      for(var mName in _card['members']) {
        console.log("member : " + mName + " spend : " + _card['members'][mName]['spend'] + " estimate : " + _card['members'][mName]['estimate']);
        if(_card['members'][mName]['date_spend'] !== undefined)
          for(var key in _card['members'][mName]['date_spend']) {
            console.log("date_spend " + key + ", " + _card['members'][mName]['date_spend'][key]);
          }
      }
    }

    MOBILE_PART['project'][targetBoardName]['cards'][i] = _card;
  }
  console.log(_obj);
}

var showProjectResouce = function() {
  var _resouceTable = '<tbody>'

  for(project in MOBILE_PART.project) {
    var _projectTable = "";

    _projectTable += '<td>'+project+'<br />(' + _member['spend'] +" / "+ _member['estimate'] + ')</td>';

    _resouceTable += '<td>'+_userName+'<br />(' + _member['spend'] +" / "+ _member['estimate'] + ')</td>';
  }
};

// LOGICAL
var getCard = function(boardID, All) {
  var deferred = $.Deferred(),
    _isAll = (All === undefined || All === false) ? 'visible' : 'all';

  Trello.get('/board/' + boardID + "/cards/" + _isAll,
    function(cards) {
      // console.log(cards);
      deferred.resolve(cards);
    }, function(error) {
      console.log(error);
    }
  );

  return deferred.promise();
}

var getBoardInfo = function(boardID) {
  var _obj = {};
  switch(boardID) {
    case "I02GmIoD" : 
      _obj['board'] = "common";
      _obj['name'] = "COMMON"
      break;
    case "3UZJ3kPG" : 
      _obj['board'] = "ipolis";
      _obj['name'] = "iPOLiS mobile";
      break;
    case "g0DBnhdi" :
      _obj['board'] = "ssm";
      _obj['name'] = "SSM mobile";
      break;
    case "nisQ181R" : 
      _obj['board'] = "smartcam";
      _obj['name'] = "SmartCam mobile";
      break;
    case "duBw0VfK" :
      _obj['board'] = "wisenet";
      _obj['name'] = "WiseNet mobile";
      break;
    case "u6SqfXJ9" :
      _obj['board'] = "argus";
      _obj['name'] = "Argus";
      break;
    default : break;
  }

  return _obj;
}

var getSNE = function(boardID, cards) {
  var deferred = $.Deferred(),
  targetBoardName = getBoardInfo(boardID)['board'];

  MOBILE_PART.project[targetBoardName]['name'] = getBoardInfo(boardID)['name'];
  MOBILE_PART.project[targetBoardName]['cards'] = [];

  // calculate comment S&E
  for (var i = 0; i < cards.length; i++) {
    var _card = cards[i],
      _cardName;

    for ( var j = 0; j < _card.actions.length; j++) {
      var _action = _card.actions[j];

      if(j === 0) _card['name'] = _card.actions[j].data.card.name;

      // check 'plus!' about S & E comment
      if(_action.data.text !== null && _action.data.text.indexOf('plus!') !== -1) {
        var _commentText = _action.data.text.substring(6);
        var _commentInfo = _commentText.split(' '),
          duplicatedFlag = false,
          // _member = new Array(_action.memberCreator.username),
          _member = new Array(),
          _date = new Date(_action.date);

        if(boardID === COMMON_ID) console.log(_action.data.text);
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

              if(i === 0) console.log("task member length : " + _member.length);
              for (var m = 0; m < _member.length; m++) {
                if (i === 0) console.log(_member[m]);
                if (i === 0) console.log(spendValue);
                // add member in card
                if(_card['members'] === undefined) _card['members'] = {};
                if(_card['members'][_member[m]] === undefined)  _card['members'][_member[m]] = {};
                if(_card['members'][_member[m]]['date_spend'] === undefined) _card['members'][_member[m]]['date_spend'] = {};
                if(_card['members'][_member[m]]['spend'] === undefined)  _card['members'][_member[m]]['spend'] = 0;
                if(_card['members'][_member[m]]['estimate'] === undefined) _card['members'][_member[m]]['estimate'] = 0;

                // add member in card
                if(MOBILE_PART['members'] === undefined) MOBILE_PART['members'] = {};
                if(MOBILE_PART['members'][_member[m]] === undefined)  MOBILE_PART['members'][_member[m]] = {};
                if(MOBILE_PART['members'][_member[m]]['date_spend'] === undefined) MOBILE_PART['members'][_member[m]]['date_spend'] = {};
                if(MOBILE_PART['members'][_member[m]]['spend'] === undefined)  MOBILE_PART['members'][_member[m]]['spend'] = 0;
                if(MOBILE_PART['members'][_member[m]]['estimate'] === undefined) MOBILE_PART['members'][_member[m]]['estimate'] = 0;

                if(parseFloat(_timeArr[0]) !== NaN) {
                  // add spend in member in card
                  if(_card['members'][_member[m]]['date_spend'][_date.getDate()]  === undefined) 
                    _card['members'][_member[m]]['date_spend'][_date.getDate()] = 0;
                  if(_card['date_spend'][_date.getDate()] === undefined) 
                    _card['date_spend'][_date.getDate()] = 0;
                  if(MOBILE_PART['members'][_member[m]]['date_spend'][_date.getDate()] === undefined) 
                    MOBILE_PART['members'][_member[m]]['date_spend'][_date.getDate()] = 0;

                  _card['members'][_member[m]]['date_spend'][_date.getDate()] += spendValue;
                  _card['date_spend'][_date.getDate()] += spendValue;
                  _card['members'][_member[m]]['spend'] += spendValue;
                  _card['spend'] += spendValue

                  MOBILE_PART['members'][_member[m]]['date_spend'][_date.getDate()] += spendValue;
                  MOBILE_PART['members'][_member[m]]['spend'] += spendValue;
                }

                if(parseFloat(_timeArr[1]) !== NaN) {
                  // add estimate in member in card
                  _card['members'][_member[m]]['estimate'] += estimateValue;
                  _card['estimate'] += estimateValue

                  MOBILE_PART['members'][_member[m]]['estimate'] += estimateValue;
                }
              } // for (m) : member counter
              duplicatedFlag = true;
            }
          }
        } // for (k)
      } // if (check 'plus!' about S & E comment)
    } // for (j)
    MOBILE_PART.project[targetBoardName]['cards'].push(_card);
  } // for (i)

  deferred.resolve();
  return deferred.promise();
};

var calcSNE = function(boardID) {
  var targetBoard = MOBILE_PART['project'][getBoardInfo(boardID)['board']];

  // to team
  if(MOBILE_PART['spend'] === undefined) MOBILE_PART['spend'] = 0;
  if(MOBILE_PART['estimate'] === undefined) MOBILE_PART['estimate'] = 0;
  if(MOBILE_PART['date_spend'] === undefined) MOBILE_PART['date_spend'] = {};

  // to project
  if(targetBoard['spend'] === undefined) targetBoard['spend'] = 0;
  if(targetBoard['estimate'] === undefined) targetBoard['estimate'] = 0;
  if(targetBoard['date_spend'] === undefined) targetBoard['date_spend'] = {};

  for (var i = 0; i < targetBoard['cards'].length; i++) {
    var _card = targetBoard['cards'][i];

    if(_card['spend'] !== undefined) {
      MOBILE_PART['spend'] += _card['spend'];
      targetBoard['spend'] += _card['spend'];
    }

    if(_card['estimate'] !== undefined) {
      MOBILE_PART['estimate'] += _card['estimate'];
      targetBoard['estimate'] += _card['estimate'];
    }
    
    if(_card['date_spend'] !== undefined) {
      for(_dateKey in _card['date_spend']) {
        if(MOBILE_PART['date_spend'][_dateKey] === undefined) MOBILE_PART['date_spend'][_dateKey] = 0;
        if(targetBoard['date_spend'][_dateKey] === undefined) targetBoard['date_spend'][_dateKey] = 0;

        MOBILE_PART['date_spend'][_dateKey] += _card['date_spend'][_dateKey];
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
    + '/cards/?field=&actions=commentCard&actions_limit=1000&action_memberCreator_fields=fullName,initials,username,url,idPremOrgsAdmin&checklists=none&cards=visible',
    function(res) {
      console.log(res);
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
  $.when(getActionToBoard(COMMON_ID), getActionToBoard(IPOLIS_ID), getActionToBoard(SSM_ID), getActionToBoard(SMARTCAM_ID), 
    getActionToBoard(WISENET_ID), getActionToBoard(ARGUS_ID)).done(
    function(res1, res2, res3, res4, res5) {
      showMemberResource();
      showProjectResource();
      showMemberResourceToGraph();
      console.log("%c @@@@@@@@@@  ALL ACTION IS CALCULATED!! @@@@@@@@@@", 'background: #222; color: #bada55'); 
    }
  );
}

var searchSNE = function() {
  var deferred = $.Deferred();

  if(MOBILE_PART.project['common']['spend'] !== undefined) {
    // $.when(initializing()).done(
    //   function() {
    //     calcStart();
    //   }
    // );
    for(member in MOBILE_PART['members']) {
      MOBILE_PART['members'][members]['spend'] = 0;
      MOBILE_PART['members'][members]['estimate'] = 0;
    }
    MOBILE_PART['estimate'] = 0;
    MOBILE_PART['spend'] = 0;
    MOBILE_PART['date_spend'] = {};
    calcStart();
  } else {
    calcStart();
  }
}

var getBoardData = function(boardID) {
  var _obj = {};

  Trello.get('/boards/' + IPOLIS_ID, function(res) {
    console.log(res);
  }, function(error) {
    console.log(error);
  });

  return _obj
}

var getMemberInformation = function() {
    getMember(IPOLIS_ID);
}

var getMemberName = function(index) {
  var _name = "unknown";

  for(p in MOBILE_PART.member) {
    if(MOBILE_PART.member[p]['index'] == index) _name = p;
  }
  return _name;
}

var getMamberTime = function(board, index) {
  var _targetName = getMemberName(index);

  if(board.member.hasOwnProperty(_targetName)) {
      return _targetName + "<br />" + board.member[_targetName]['spend'] + " / " + board.member[_targetName]['estimate'];
  } else {
    return " <br /> ";
  }
}

var makeTask = function(project) {
  var panel = $('.panel-body');

  for(var i=0; i<project.length; i++) {
    // create header
    panel.append('<div class="panel panel-info"><div class="row panel-heading">'
      + '<div class="col-md-5 font_resizing">'+project[i].name+'<br />'+ project[i]['spend'] +' / '+ project[i]['estimate'] +'</div>'
      + '<div class="col-md-1 font_resizing">'+getMamberTime(project[i], 1)+'</div>'
      + '<div class="col-md-1 font_resizing">'+getMamberTime(project[i], 2)+'</div>'
      + '<div class="col-md-1 font_resizing">'+getMamberTime(project[i], 3)+'</div>'
      + '<div class="col-md-1 font_resizing">'+getMamberTime(project[i], 4)+'</div>'
      + '<div class="col-md-1 font_resizing">'+getMamberTime(project[i], 5)+'</div>'
      + '<div class="col-md-1 font_resizing">'+getMamberTime(project[i], 6)+'</div>'
      + '<div class="col-md-1 font_resizing">'+getMamberTime(project[i], 7)+'</div>');

    for(t in project[i].task) {
      var tName = (t.length > 50) ? (t.substring(0, 50) + "...") : t ;
      panel.append('<div class="row"><div class="col-md-5 tast_cell" style="font-size:13px;"><p style="float:left;">'+tName+'</p><p class="rightPont">( / )</p></div>'
        + '<div class="col-md-1 font_resizing tast_cell"> <br />  </div>'
        + '<div class="col-md-1 font_resizing tast_cell"> <br />  </div>'
        + '<div class="col-md-1 font_resizing tast_cell"> <br />  </div>'
        + '<div class="col-md-1 font_resizing tast_cell"> <br />  </div>'
        + '<div class="col-md-1 font_resizing tast_cell"> <br />  </div>'
        + '<div class="col-md-1 font_resizing tast_cell"> <br />  </div>'
        + '<div class="col-md-1 font_resizing tast_cell"> <br />  </div></div>');
    }

    panel.append('</div></div>');
  }
};

var dateMaker = function() {
  var _workday = new Date;
  _workday.setDate(_workday.getDate() -1);

  $('#iterationStartDay').val("2016-05-23");
  $('#workDay').val(getDateString(_workday));

}

var initializing = function() {
  var deferred = $.Deferred();

  $.when(getMember()).done(
    function(members) {
      MOBILE_PART.members = members;

      MOBILE_PART['estimate'] = 0;
      MOBILE_PART['spend'] = 0;
      MOBILE_PART['date_spend'] = {};

      showMemberCheckBox(members);
      console.log("%c MEMBER INFORMATION IS LOADED!!", 'color: #228B22');

      deferred.resolve();
    }
  );

  return deferred.promise();
}

$(function() {
  authorizeToTrello();
  $.when(initializing()).done(function() {
    dateMaker();
    console.log("%c @@@@@@@@@@ SCRUM IS READY!! @@@@@@@@@@", 'background: #222; color: #bada55'); 
  });
});
