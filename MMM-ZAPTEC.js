Module.register("MMM-ZAPTEC", {
  // Default module config.
  defaults: {
    bearerToken: "",
    updateInterval: 60000 // update every minute
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

  for (var i = 0; i < this.chargerData.length; i++) {
    var charger = this.chargerData[i];
    var chargerWrapper = document.createElement("div");
    chargerWrapper.className = "chargerWrapper";
    var operatingMode = "";
    switch (charger.OperatingMode) {
      case 1:
        operatingMode = "ledigt";
        break;
      case 2:
        operatingMode = "Auktoriserar";
        break;
      case 3:
        operatingMode = "laddar";
        break;
      case 5:
        operatingMode = "slutade ladda";
        break;
      default:
        operatingMode = charger.OperatingMode;
        break;
    }
    chargerWrapper.innerHTML = "Laddare     " + (i+1) + " " + operatingMode;
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
      this.updateDom();
    }
  }
});
