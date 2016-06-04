var DEBUG_MODE = true;
var LOCALSTORAGE_KEY = "TRAIL_TRELLO";

var PART = {
  members : {},
  project : {}
};

// Custom Typing board
var BOARD = {
  "COMMON" : {
    "id" : "I02GmIoD",
    "name" : "COMMON" 
  },
  "IPOLIS_ID" : {
    "id" : "3UZJ3kPG",
    "name" : "iPOLiS mobile"
  },
  "SSM_ID" : {
    "id" : "g0DBnhdi",
    "name" : "SSM mobile"
  },
  "SMARTCAM_ID" : {
    "id" : "nisQ181R",
    "name" : "SmartCam mobile"
  },
  "WISENET_ID" : {
    "id" : "duBw0VfK",
    "name" : "WiseNet mobile"
  },
  "ARGUS_ID" : {
    "id" : "u6SqfXJ9",
    "name" : "Argus"
  },
}

// Iteration period
var ITERATION_START_DATE = "2016-05-23",
  ITERATION_PERIOD = 14;