Module.register("MMM-ZAPTEC", {
  // Default module config.
  defaults: {
    bearerToken: "",
    updateInterval: 60000,
    lang: "swe",
    enableChargeHistory: false,
    fromDate: "",
    toDate: "",
    Charger: "all"
  },

  // Define start sequence.
  start: function() {
    Log.info("Starting module: " + this.name);
    this.chargerData = [];
    this.chargeHistory = [];
    this.sendSocketNotification("GET_CHARGER_DATA", this.config);
    this.scheduleUpdate();
  },


  // Override dom generator.
getDom: function() {
  var wrapper = document.createElement("div");
  wrapper.className = "small align-left";

  var chargerIndex = this.config.Charger === "all" ? null : parseInt(this.config.Charger) - 1;

  for (var i = 0; i < this.chargerData.length; i++) {
    if (chargerIndex !== null && chargerIndex !== i) {
      continue;
    }

    var charger = this.chargerData[i];
    var chargerWrapper = document.createElement("div");
    chargerWrapper.className = "chargerWrapper";

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

    if (chargerIndex !== null) {
      break;
    }
  }

  if (this.config.enableChargeHistory) {
    var historyWrapper = document.createElement("div");
    historyWrapper.className = "historyWrapper";

    var historyTable = document.createElement("table");
    historyTable.className = "small";
    var headerRow = document.createElement("tr");
    headerRow.innerHTML = "<th>Date</th><th>Duration</th><th>Energy (kWh)</th>";
    historyTable.appendChild(headerRow);

    for (var i = 0; i < this.chargeHistory.length; i++) {
      var history = this.chargeHistory[i];
      var historyRow = document.createElement("tr");
      historyRow.innerHTML = "<td>" + history.Date + "</td><td>" + history.Duration + "</td><td>" + history.Energy + "</td>";
      historyTable.appendChild(historyRow);
    }

    historyWrapper.appendChild(historyTable);
    wrapper.appendChild(historyWrapper);
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

  // Handle notifications from node_helper.
  socketNotificationReceived: function(notification, payload) {
    if (notification === "CHARGER_DATA_RESULT") {
      if (payload.error) {
        Log.error(`Error getting charger data: ${payload.error}`);
        return;
      }
      Log.info("Received charger data");
      this.chargerData = payload.chargerData;
      this.updateDom(1000);
    } else if (notification === "CHARGE_HISTORY_RESULT") {
      if (payload.error) {
        Log.error(`Error getting charge history: ${payload.error}`);
        return;
      }
      Log.info("Received charge history");
      // TODO: handle charge history data
    }
  }
});
