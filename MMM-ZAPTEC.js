Module.register("MMM-ZAPTEC", {
  // Default module config.
  defaults: {
    bearerToken: "",
    updateInterval: 60000, // update every minute
    lang: "swe" // default language is Swedish
  },

  // Define start sequence.
  start: function() {
    Log.info("Starting module: " + this.name);
    this.chargerData = [];
    this.sendSocketNotification("GET_CHARGER_DATA", this.config);
    this.scheduleUpdate();
  },

  // Override dom generator.
getDom: function() {
  var wrapper = document.createElement("div");
  wrapper.className = "small align-left"; // add align-left class here

  var chargersToShow = [];
  if (this.config.Charger === "all") {
    chargersToShow = this.chargerData;
  } else if (this.config.Charger === "none") {
    chargersToShow = [];
  } else {
    var chargerIndex = parseInt(this.config.Charger) - 1;
    if (this.chargerData[chargerIndex]) {
      chargersToShow.push(this.chargerData[chargerIndex]);
    }
  }

  for (var i = 0; i < chargersToShow.length; i++) {
    var charger = chargersToShow[i];
    var chargerWrapper = document.createElement("div");
    chargerWrapper.className = "chargerWrapper";

    // Retrieve the appropriate translation based on the language setting
    var lang = this.config.lang;
    var operatingMode = "";
    switch (charger.OperatingMode) {
      case 1:
        operatingMode = lang === "eng" ? "Available" : "Ledigt";
        break;
      case 2:
        operatingMode = lang === "eng" ? "Authorizing" : "Auktoriserar";
        break;
      case 3:
        operatingMode = lang === "eng" ? "Charging" : "Laddar";
        break;
      case 5:
        operatingMode = lang === "eng" ? "Finished charging" : "Slutade ladda";
        break;
      default:
        operatingMode = charger.OperatingMode;
        break;
    }

    chargerWrapper.innerHTML = "Charger " + (i+1) + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + operatingMode;
    wrapper.appendChild(chargerWrapper);
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
  }
});
