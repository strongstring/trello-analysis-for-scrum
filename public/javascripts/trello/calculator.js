
// var authorizeToTrello = function() {

//   var deferred = $.Deferred();
//   var onAuthorize = function() { console.log("Successful authentication"); deferred.resolve();};
//   var authenticationFailure = function() { console.log("Failed authentication"); deferred.reject();};

//   Trello.authorize({
//       type: "redirect",
//       success: onAuthorize
//   });

//   return deferred.promise();
// };

// // Member Information
// var getMemberInformation = function() {
//   var deferred = $.Deferred(),
//     deferredArr = [],
//     _memberObj = {};

//   for(ProjectName in BOARD) {
//     deferredArr.push(
//       Trello.get('/boards/' + BOARD[ProjectName]['id'] + '/members/', 
//       function(members) {
//         for(var i = 0; i < members.length; i++) {
//           var _key = members[i]['username'];
//           if(_memberObj[_key] === undefined) _memberObj[_key] = members[i];
//         }
//       }, function(error) {
//         console.log(error);
//       })
//     );
//   }

//   $.when.apply($, deferredArr).done(function() {
//     deferred.resolve(_memberObj);
//   });
  
//   return deferred.promise();
// };


// // Card S&E
// // var getSNE = function(boardID, cards) {
// //   var deferred = $.Deferred();
// //   var targetBoardName = getBoardInfo(boardID).board;

// //   if(PART.project[targetBoardName] === undefined) PART.project[targetBoardName] = {};
// //   PART.project[targetBoardName]['name'] = getBoardInfo(boardID)['name'];
// //   PART.project[targetBoardName]['cards'] = [];

// //   // calculate comment S&E
// //   var cardsLength = cards.length;
// //   for (var i = 0; i < cardsLength; i++) {
// //     var _card = cards[i],
// //       _cardName;

// //     var cardActionsLength = _card.actions.length;
// //     for ( var j = 0; j < cardActionsLength; j++) {
// //       var _action = _card.actions[j];

// //       if(j === 0) _card['name'] = _card.actions[j].data.card.name;

// //       // check 'plus!' about S & E comment)
// //       if(_action.type !== 'updateCard' && _action.data.text !== null && _action.data.text.indexOf('plus!') !== -1 && _action.data.text.indexOf('^resetsync') === -1) {
// //         var _commentText = _action.data.text.substring(6);
// //         var _commentInfo = _commentText.split(' '),
// //           duplicatedFlag = false,
// //           // _member = new Array(_action.memberCreator.username),
// //           _member = new Array(),
// //           _date = new Date(_action.date);

// //         var commentInfoLength = _commentInfo.length;
// //         for( var k = 0; k < commentInfoLength; k++) {
// //           if(_commentInfo[k].indexOf('@') !== -1) {
// //             // S&E Member Setting
// //             duplicatedFlag = false;
// //             if(_commentInfo[k].substring(1) === "me") {
// //               _member.push(_action.memberCreator.username);
// //             } else {
// //               _member.push(_commentInfo[k].substring(1));
// //             }
// //           } else if (_commentInfo[k].indexOf('d') !== -1) {
// //             // S&E Date Setting
// //             _date.setDate(_date.getDate() + parseInt(_commentInfo[k].substring(0, 2)));
// //           } else if ((_commentInfo[k].indexOf('/') !== -1 || parseFloat(_commentInfo[k]) !== NaN) && _commentInfo[k] !== '') {
// //             // var _timeArr = _commentInfo[k].split('/');
// //             var _timeArr = [];
// //             if(_commentInfo[k].indexOf('/') !== -1 ) {
// //               _timeArr = _commentInfo[k].split('/');
// //             } else {
// //               _timeArr[0] = _commentInfo[k];
// //               _timeArr[1] = 0;
// //             }
// //             var spendValue = parseFloat(_timeArr[0]),
// //               estimateValue = parseFloat(_timeArr[1]);

// //             // if dont have @username, that S
// //             if(_member.length === 0) _member.push(_action.memberCreator.username);

// //             // for double S&E in one comment line
// //             if(!duplicatedFlag) {
// //               // add info in card
// //               if(_card['spend'] === undefined) _card['spend'] = 0;
// //               if(_card['estimate'] === undefined) _card['estimate'] = 0;
// //               if(_card['date_spend'] === undefined) _card['date_spend'] = {};

// //               var memberLength = _member.length;
// //               for (var m = 0; m < memberLength; m++) {
// //                 // add member in card
// //                 if(_card['members'] === undefined) _card['members'] = {};
// //                 if(_card['members'][_member[m]] === undefined)  _card['members'][_member[m]] = {};
// //                 if(_card['members'][_member[m]]['fullName'] === undefined && PART['members'][_member[m]] !== undefined) 
// //                   _card['members'][_member[m]]['fullName'] = PART['members'][_member[m]]['fullName'];
// //                 if(_card['members'][_member[m]]['date_spend'] === undefined) _card['members'][_member[m]]['date_spend'] = {};
// //                 if(_card['members'][_member[m]]['spend'] === undefined)  _card['members'][_member[m]]['spend'] = 0;
// //                 if(_card['members'][_member[m]]['estimate'] === undefined) _card['members'][_member[m]]['estimate'] = 0;

// //                 // add member in card
// //                 if(PART['members'] === undefined) PART['members'] = {};
// //                 if(PART['members'][_member[m]] === undefined) PART['members'][_member[m]] = {};
// //                 if(PART['members'][_member[m]]['date_spend'] === undefined) PART['members'][_member[m]]['date_spend'] = {};
// //                 if(PART['members'][_member[m]]['spend'] === undefined)  PART['members'][_member[m]]['spend'] = 0;
// //                 if(PART['members'][_member[m]]['estimate'] === undefined) PART['members'][_member[m]]['estimate'] = 0;

// //                 if(parseFloat(_timeArr[0]) !== NaN) {
// //                   // add spend in member in card
// //                   if(_card['members'][_member[m]]['date_spend'][_date.getDate()]  === undefined) 
// //                     _card['members'][_member[m]]['date_spend'][_date.getDate()] = 0;
// //                   if(_card['date_spend'][_date.getDate()] === undefined) 
// //                     _card['date_spend'][_date.getDate()] = 0;
// //                   if(PART['members'][_member[m]]['date_spend'][_date.getDate()] === undefined) 
// //                     PART['members'][_member[m]]['date_spend'][_date.getDate()] = 0;

// //                   _card['members'][_member[m]]['date_spend'][_date.getDate()] += spendValue;
// //                   _card['date_spend'][_date.getDate()] += spendValue;
// //                   _card['members'][_member[m]]['spend'] += spendValue;
// //                   _card['spend'] += spendValue

// //                   PART['members'][_member[m]]['date_spend'][_date.getDate()] += spendValue;
// //                   PART['members'][_member[m]]['spend'] += spendValue;
// //                 }

// //                 if(parseFloat(_timeArr[1]) !== NaN) {
// //                   // add estimate in member in card
// //                   _card['members'][_member[m]]['estimate'] += estimateValue;
// //                   _card['estimate'] += estimateValue

// //                   PART['members'][_member[m]]['estimate'] += estimateValue;
// //                 }
// //               } // for (m) : member counter
// //               duplicatedFlag = true;
// //             }
// //           }
// //         } // for (k)
// //       } // if (check 'plus!' about S & E comment)
// //     } // for (j)
// //     PART.project[targetBoardName]['cards'].push(_card);
// //   } // for (i)

// //   deferred.resolve();
// //   return deferred.promise();
// // };

// // var calcSNE = function(boardID) {
// //   var boardInfo = getBoardInfo(boardID);
// //   var targetBoard = PART.project[boardInfo.board];

// //   // to team
// //   if(PART.spend === undefined) PART.spend = 0;
// //   if(PART.estimate=== undefined) PART.estimate = 0;
// //   if(PART.date_spend === undefined) PART.date_spend = {};

// //   // to project
// //   if(targetBoard.spend === undefined) targetBoard.spend = 0;
// //   if(targetBoard.estimate === undefined) targetBoard.estimate = 0;
// //   if(targetBoard.date_spend === undefined) targetBoard.date_spend = {};

// //   var cardsLEngth = targetBoard.cards.length;
// //   for (var i = 0; i < cardsLEngth; i++) {
// //     var _card = targetBoard.cards[i];

// //     if(_card.spend !== undefined) {
// //       PART.spend += _card.spend;
// //       targetBoard.spend += _card.spend;
// //     }

// //     if(_card.estimate !== undefined) {
// //       PART.estimate += _card.estimate;
// //       targetBoard.estimate += _card.estimate;
// //     }
    
// //     if(_card.date_spend !== undefined) {
// //       for(_dateKey in _card.date_spend) {
// //         if(PART.date_spend[_dateKey] === undefined) PART.date_spend[_dateKey] = 0;
// //         if(targetBoard.date_spend[_dateKey] === undefined) targetBoard.date_spend[_dateKey] = 0;

// //         PART.date_spend[_dateKey] += _card.date_spend[_dateKey];
// //         targetBoard.date_spend[_dateKey] += _card.date_spend[_dateKey];
// //       }
// //     }
// //   }
// // }

// // var getActionToBoard = function(boardID) {
// //   var deferred = $.Deferred(),
// //     _obj = {};

// //   Trello.get('/boards/' + boardID 
// //     + '/cards/?field=&actions=commentCard,updateCard:name&actions_limit=1000&action_memberCreator_fields=fullName,initials,username,url,idPremOrgsAdmin&checklists=none&cards=visible',
// //     function(res) {
// //       if(DEBUG_MODE) console.log(res);
// //       $.when(getSNE(boardID, res)).done(function(){
// //         console.log("%c " + getBoardInfo(boardID)['name'] + " IS GAIN !!", 'color: #228B22');
// //         $.when(calcSNE(boardID)).done(function() {
// //           console.log("%c " + getBoardInfo(boardID)['name'] + " IS CALCULATED !!", 'color: #228B22');
// //           deferred.resolve();
// //         });
// //       });
// //   }, function(error) {
// //     console.log(error);
// //   });

// //   return deferred.promise();
// // }

// var getBoardInfo = function(boardID) {
//   var _obj = {};

//   for (boardName in BOARD) {
//     if (BOARD[boardName].id === boardID) {
//       _obj.board = boardName;
//       _obj.name = BOARD[boardName].name;
//       break;
//     }
//   }

//   return _obj;
// }

// var clearMemeber = function() {
//   $.when(getMemberInformation()).done(
//     function(members) {
//       for(member in members) {
//         PART['members'][member] = {};
//         PART['members'][member]['fullName'] = members[member]['fullName'];
//         PART['members'][member]['estimate'] = 0;
//         PART['members'][member]['spend'] = 0;
//         PART['members'][member]['date_spend'] = {};
//       }

//       PART['estimate'] = 0;
//       PART['spend'] = 0;
//       PART['date_spend'] = {};
//     });
// }

// var calculationStart = function() {
//   var deferred = [],
//     selfDeferred = $.Deferred();

//   // var count = 0;
//   for(boardName in BOARD) {
//     // if(count === 2) break;
//     console.log("push board data " + BOARD[boardName]['name']);
//     deferred.push(getActionToBoard(BOARD[boardName]['id']));
//     // count++;
//   }

//   $.when.apply($, deferred).done(
//     function() {
//       selfDeferred.resolve();
//   });

//   return selfDeferred.promise();
// }