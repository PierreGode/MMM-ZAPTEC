Module.register("MMM-ZAPTEC", {
  // Default module config.
  defaults: {
    username: "",
    password: "",
    updateInterval: 60000, // update every minute
    lang: "eng", // default language is Swedish
    enableChargeHistory: false, // by default, charge history is not displayed
    showHistoryEntries: 5 // define the max amount of charge history entries to show
  },

  // Define start sequence.
  start: function() {
    this.sendSocketNotification("SET_CONFIG", this.config);
    Log.info("Starting module: " + this.name);
    this.chargerData = [];
    this.chargeHistoryData = [];
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

  // Check if charger data is empty
  if (this.chargerData.length === 0) {
    wrapper.innerHTML = "<span class='small fa fa-refresh fa-spin fa-fw'></span>";
    wrapper.className = "small dimmed";
    return wrapper;
  }

  // Display charger data
  for (var i = 0; i < this.chargerData.length; i++) {
    if (chargerIndex !== null && chargerIndex !== i) {
      continue;
    }

    var charger = this.chargerData[i];
    var chargerWrapper = document.createElement("div");
    chargerWrapper.className = "chargerWrapper";

    var lang = this.config.lang;
    var translationKeys = {
      1: "available",
      2: "authorizing",
      3: "charging",
      5: "finishedCharging"
    };
    var operatingModeKey = translationKeys[charger.OperatingMode] || charger.OperatingMode;
    var operatingMode = this.translations[lang][operatingModeKey];

    var chargerText = this.translations[lang].charger;

    chargerWrapper.innerHTML = chargerText + " " + (i + 1) + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + operatingMode;
    wrapper.appendChild(chargerWrapper);

    if (chargerIndex !== null) {
      break;
    }
  }
  
  // Display charge history data
  if (this.config.enableChargeHistory && this.chargeHistoryData.length > 0) {
    var chargeHistoryWrapper = document.createElement("div");
    chargeHistoryWrapper.className = "chargeHistoryWrapper";

    var chargeHistoryHeader = document.createElement("h4");
    if (this.translations[lang] && this.translations[lang].chargeHistory) {
      chargeHistoryHeader.innerHTML = this.translations[lang].chargeHistory;
    } else {
      chargeHistoryHeader.innerHTML = "Charge History";
    }

    chargeHistoryWrapper.appendChild(chargeHistoryHeader);

    var chargeHistoryList = document.createElement("ul");

    // Loop through the charge history data in reverse order
    var historyEntries = 0;
    for (var i = this.chargeHistoryData.length - 1; i >= 0 && historyEntries < this.config.showHistoryEntries; i--) {
      var charge = this.chargeHistoryData[i];
      var listItem = document.createElement("li");

      // Convert StartDateTime to a JavaScript Date object and adjust for timezone difference
      var startDate = new Date(charge.StartDateTime);
      startDate.setHours(startDate.getHours() + 2);

      // Convert EndDateTime to a JavaScript Date object and adjust for timezone difference
      var endDate = new Date(charge.EndDateTime);
      endDate.setHours(endDate.getHours() + 2);

      // Format the start date and time using 24-hour format
      var formattedStartDate = new Intl.DateTimeFormat(undefined, {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(startDate);

      // Format the end date and time using 24-hour format
      var formattedEndDate = new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(endDate);

      // Display the formatted start and end date and time, and the energy consumed
      listItem.innerHTML = `${formattedStartDate} - ${formattedEndDate}: ${charge.Energy} kWh`;

      chargeHistoryList.appendChild(listItem);
      historyEntries++;
    }

    chargeHistoryWrapper.appendChild(chargeHistoryList);
    wrapper.appendChild(chargeHistoryWrapper);
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

  // Request charge history data if enableChargeHistory is set to true
  if (this.config.enableChargeHistory) {
    setTimeout(function() {
      self.sendSocketNotification("GET_CHARGE_HISTORY");
    }, nextLoad);
  }
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
  } else if (notification === "CHARGE_HISTORY_RESULT") {
    if (payload.error) {
      Log.error(`Error getting charge history data: ${payload.error}`);
      return;
    }
    Log.info("Received charge history data");
    this.chargeHistoryData = payload.chargeHistoryData;
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
//@Created By Pierre Gode
