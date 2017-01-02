var DEBUG_MODE = true;
var LOCALSTORAGE_KEY = "TRAIL_TRELLO";

var PART = {
  members : {},
  project : {}
};

var labelColor = { 
  "blue" : "#0079BF",
  "orange" : "#FFAB4A",
  "red" : "#EB5A46",
  "black" : "#4D4D4D",
  "green" : "#61BD4F",
  "yellow" : "#F2D600",
  "purple" : "#C377E0",
  "pink" : "#FF82CE",
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
  "INSTALLATION_ID" : {
    "id" : "3iri7Xmr",
    "name" : "Wisenet installation"
  },
  "S1SDK_ID" : {
    "id" : "GrBbXsnV",
    "name" : "S1 SDK"
  },
};

// Iteration period
var ITERATION_START_DATE = "2016-05-26",
  ITERATION_PERIOD = 14;