Module.register("MMM-ZAPTEC", {
  // Default module config.
  defaults: {
    username: "",
    password: "",
    updateInterval: 60000, // update every minute
    lang: "swe" // default language is Swedish
  },

  // Define start sequence.
  start: function() {
    this.sendSocketNotification("SET_CONFIG", this.config);
    Log.info("Starting module: " + this.name);
    this.chargerData = [];
    this.sendSocketNotification("GET_CHARGER_DATA", this.config);
    this.scheduleUpdate();
    this.translations = {}; 
    this.getTranslations();
  },

  // Override dom generator.
  getDom: function() {
  var wrapper = document.createElement("div");
  wrapper.className = "small align-left";
  var chargerIndex = this.config.charger === "all" ? null : parseInt(this.config.charger) - 1;
  for (var i = 0; i < this.chargerData.length; i++) {
    if (chargerIndex !== null && chargerIndex !== i) {
      continue;
    }

    var charger = this.chargerData[i];
    var chargerWrapper = document.createElement("div");
    chargerWrapper.className = "chargerWrapper";

    // Retrieve the appropriate translation based on the language setting
    var lang = this.config.lang;
    var translationKeys = {
      1: "available",
      2: "authorizing",
      3: "charging",
      5: "finishedCharging"
    };
    var operatingModeKey = translationKeys[charger.OperatingMode] || charger.OperatingMode;
    var operatingMode = this.translations[lang][operatingModeKey];

    // Translate the word "Charger" to the selected language
    var chargerText = this.translations[lang].charger;

    chargerWrapper.innerHTML = chargerText + " " + (i + 1) + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + operatingMode;
    wrapper.appendChild(chargerWrapper);

    if (chargerIndex !== null) {
      break;
    }
  }
  return wrapper;
},

  // Schedule module update.
  scheduleUpdate: function(delay) {
    var self = this;
    var nextLoad = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      nextLoad = delay;
    }
    setTimeout(function() {
      self.sendSocketNotification("GET_CHARGER_DATA", self.config);
    }, nextLoad);
  },

  // Handle notifications from node_helper
  socketNotificationReceived: function(notification, payload) {
    if (notification === "CHARGER_DATA_RESULT") {
      if (payload.error) {
        Log.error(`Error getting charger data: ${payload.error}`);
        return;
      }
      Log.info("Received charger data");
      this.chargerData = payload.chargerData;
      this.updateDom(1000);
    }
  },

  // Get translations
  getTranslations: function() {
    var self = this;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        self.translations = JSON.parse(this.responseText);
      }
    };
    xhttp.open("GET", "/modules/MMM-ZAPTEC/lang.js", true);
    xhttp.send();
  },
});
