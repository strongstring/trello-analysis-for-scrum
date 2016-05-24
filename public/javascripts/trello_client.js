var DEBUG_MODE = true;

var COMMON_ID = "I02GmIoD",
  IPOLIS_ID = "3UZJ3kPG",
  SSM_ID = "g0DBnhdi",
  SMARTCAM_ID = "nisQ181R",
  WISENET_ID = "duBw0VfK",
  ARGUS_ID = "u6SqfXJ9";

var MOBILE_PART = {
  spend : 0,
  estimate : 0,
  member : {},
  project : [],
};

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

var getBoardData = function(boardID) {
  var _obj = {};

  Trello.get('/boards/' + IPOLIS_ID, function(res) {
    console.log(res);
  }, function(error) {
    console.log(error);
  });

  return _obj
}

var getMemberSpend = function(result) {
  var deferred = $.Deferred(),
    _obj = {};

  _obj.board = result.actions[0].data.board;
  _obj.board.task = {};
  for(var i = 0; i < result.actions.length; i++) {
    var _action = result.actions[i];
    if(DEBUG_MODE) console.log("getMemberSpend::_action = " + JSON.stringify(_action));

    if(_action.type === 'commentCard' && _action.data.text !== null && _action.data.text.indexOf('plus!') !== -1 ){
      // Text Check
      var _text = _action.data.text.substring(6)
      var _textInfo = _text.split(' '),
        _member = _action.memberCreator.username;

      if(DEBUG_MODE) console.log("getMemberSpend::_text =" + _text);

      for(var j = 0; j < _textInfo.length; j++) {
        if(DEBUG_MODE) console.log("getMemberSpend::_textInfo["+j+"] =" + _textInfo[j]);
        if(_textInfo[j].indexOf('@') !== -1) {
          _member = _textInfo[j].substring(1);

          // if returnObj don't have member. add
          if(_obj[_member] === undefined) {
            _obj[_member] = {"spend" : 0, "estimate" : 0};
          }
        } else if (_textInfo[j].indexOf('d') !== -1) {

        } else if (_textInfo[j].indexOf('/') !== -1) {
          var _timeArr = _textInfo[j].split('/');
          if(_obj[_member] === undefined) {
            _obj[_member] = {"spend" : 0, "estimate" : 0};
          }

          // create task inside board
          var cardName = _action.data.card.name;
          var findIndex = false;
          for ( task in _obj.board.task ) {
            if(_obj.board.task.hasOwnProperty(cardName)) findIndex = true;
          }
          if(!findIndex) {
            _obj.board.task[cardName] = {};
            _obj.board.task[cardName][_member] = {"spend" : 0, "estimate" : 0};
          } else {
            if(_obj.board.task[cardName][_member] === undefined) 
              _obj.board.task[cardName][_member] = {"spend" : 0, "estimate" : 0};
          }

          // if(DEBUG_MODE) console.log("%c getMemberSpend::addTime spend = " + _timeArr[0] + ", estimate = " + _timeArr[1], 'background: #222; color: #bada55');
          if(parseInt(_timeArr[0])) {
            _obj.board.task[cardName][_member].spend += parseInt(_timeArr[0]);
            _obj[_member]['spend'] += parseInt(_timeArr[0]);
          } 
          if(parseInt(_timeArr[1])) {
            _obj.board.task[cardName][_member].estimate += parseInt(_timeArr[1]);
            _obj[_member]['estimate'] += parseInt(_timeArr[1]);
          }
        } else {
          console.log("getMemberSpend error : " + _textInfo[j]);
        }
      }
    }
  } // for

  deferred.resolve(_obj);
  
  return deferred.promise();
}

var getBoardList = function(boardID) {
  var _obj = {},
    deferred = $.Deferred();

  Trello.get('/boards/' + boardID 
    + '/?fields=&actions=commentCard&actions_limit=1000&action_memberCreator_fields=fullName%2Cinitials%2CmemberType%2Cusername%2CavatarHash%2Cbio%2CbioData%2Cconfirmed%2Cproducts%2Curl%2CidPremOrgsAdmin&checklists=none&cards=visible&card_fields=&card_checklists=all&card_checklist_checkItems=none&labels=all&labels_limit=1000',
    function(res) {
    console.log(res);
    // res.board = res.actions[0].data.board;
    $.when(getMemberSpend(res))
      .done(function(result) {
        // result.board = res.actions[0].data.board;
        result.board['spend'] = 0;
        result.board['estimate'] = 0;
        result.board.member = {};
        // MOBILE_PART['project'].push(result.board);

        for (k in result) {
          if (k !== 'board') {
            // console.log(result.board.name + "::" + k + "::" + JSON.stringify(result[k]));
            if(MOBILE_PART.member[k] === undefined) MOBILE_PART.member[k] = {"spend" : 0, "estimate" : 0};
            result.board.member[k] = result[k];
            result.board['spend'] += parseInt(result[k].spend);
            result.board['estimate'] += parseInt(result[k].estimate);
            MOBILE_PART.member[k].spend += parseInt(result[k].spend);
            MOBILE_PART.member[k].estimate += parseInt(result[k].estimate);
            MOBILE_PART["spend"] += parseInt(result[k].spend);
            MOBILE_PART["estimate"] += parseInt(result[k].estimate);
          }
        }
        MOBILE_PART['project'].push(result.board);

        console.log(result);
        deferred.resolve(result);
      });
      
  }, function(error) {
    console.log(error);
  });

  return deferred.promise();
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
      + '<div class="col-md-4 font_resizing">'+project[i].name+'<br />'+ project[i]['spend'] +' / '+ project[i]['estimate'] +'</div>'
      + '<div class="col-md-1 font_resizing">'+getMamberTime(project[i], 1)+'</div>'
      + '<div class="col-md-1 font_resizing">'+getMamberTime(project[i], 2)+'</div>'
      + '<div class="col-md-1 font_resizing">'+getMamberTime(project[i], 3)+'</div>'
      + '<div class="col-md-1 font_resizing">'+getMamberTime(project[i], 4)+'</div>'
      + '<div class="col-md-1 font_resizing">'+getMamberTime(project[i], 5)+'</div>'
      + '<div class="col-md-1 font_resizing">'+getMamberTime(project[i], 6)+'</div>'
      + '<div class="col-md-1 font_resizing">'+getMamberTime(project[i], 7)+'</div>'
      + '<div class="col-md-1 font_resizing"> <br /> </div>');

    for(t in project[i].task) {
      panel.append('<div class="row"><div class="col-md-4">'+t+'<br /><p class="rightPont">( / )</p></div>'
        + '<div class="col-md-1 font_resizing"> <br /> / </div>'
        + '<div class="col-md-1 font_resizing"> <br /> / </div>'
        + '<div class="col-md-1 font_resizing"> <br /> / </div>'
        + '<div class="col-md-1 font_resizing"> <br /> / </div>'
        + '<div class="col-md-1 font_resizing"> <br /> / </div>'
        + '<div class="col-md-1 font_resizing"> <br /> / </div>'
        + '<div class="col-md-1 font_resizing"> <br /> / </div>'
        + '<div class="col-md-1 font_resizing"> <br /> / </div></div>');
    }

    panel.append('</div></div>');
  }
};

var resetBoarList = function() {
  MOBILE_PART = {
    spend : 0,
    estimate : 0,
    member : {},
    project : [],
  };

  if(MOBILE_PART.spend === undefined) MOBILE_PART['spend'] = 0;
  if(MOBILE_PART.estimate === undefined) MOBILE_PART['estimate'] = 0;
  $.when(
    getBoardList(COMMON_ID), getBoardList(IPOLIS_ID), getBoardList(SSM_ID), getBoardList(SMARTCAM_ID),
    getBoardList(WISENET_ID), getBoardList(ARGUS_ID)
  ).done(function(result1, result2, result3, result4, result5) {
    console.log("ALL DONE");
    console.log(MOBILE_PART);
    var totalResouce_label = $('#total_resource').children()[0];
      peopleResouce_label = $('#total_resource').children();

    totalResouce_label.innerHTML = "PROJECT <br />" + MOBILE_PART.spend + " / " + MOBILE_PART.estimate;
    var peopleStartIndex = 1;

    for (p in MOBILE_PART.member) {
      peopleResouce_label[peopleStartIndex].innerHTML = p + "<br />" + MOBILE_PART.member[p].spend + " / " + MOBILE_PART.member[p].estimate;
      MOBILE_PART.member[p]['index'] = peopleStartIndex;
      peopleStartIndex ++;
    }

    makeTask(MOBILE_PART.project);
  });
}

$(function() {
  authorizeToTrello();
  resetBoarList();
});
