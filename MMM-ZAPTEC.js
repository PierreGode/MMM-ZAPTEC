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
    this.getData();
    this.scheduleUpdate();
  },

  // Override dom generator.
// Override dom generator.
  getDom: function() {
    var wrapper = document.createElement("div");
    wrapper.className = "small";

    // Add header
    var header = document.createElement("div");
    header.innerHTML = "<h4>Zaptec Charger</h4>";
    wrapper.appendChild(header);

    for (var i = 0; i < this.chargerData.length; i++) {
      var charger = this.chargerData[i];
      var chargerWrapper = document.createElement("div");
      chargerWrapper.innerHTML = "Charger " + (i+1) + " - OperatingMode: " + charger.OperatingMode;
      wrapper.appendChild(chargerWrapper);
    }
    return wrapper;
  },

  // Fetch charger data.
  getData: function() {
    Log.info("Fetching data for module: " + this.name);
    var self = this;
    var url = "https://api.zaptec.com/api/chargers/";
    var token = this.config.bearerToken;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        self.chargerData = data;
        self.updateDom();
      }
    };
    xhr.send();
  },

  // Schedule module update.
  scheduleUpdate: function(delay) {
    var self = this;
    var nextLoad = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      nextLoad = delay;
    }
    setTimeout(function() {
      self.getData();
    }, nextLoad);
  },
});
