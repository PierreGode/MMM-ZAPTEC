Module.register("MMM-ZAPTEC", {
  // Default module config.
  defaults: {
    updateInterval: 60 * 1000, // 1 minute
    token: "",
    unit: "kWh"
  },

  // Define start sequence.
  start: function () {
    Log.info(`Starting module: ${this.name}`);
    this.energyData = [];
    this.loaded = false;
    this.getData();
    this.scheduleUpdate();
  },

  // Override dom generator.
  getDom: function () {
    var wrapper = document.createElement("div");

    if (!this.loaded) {
      wrapper.innerHTML = this.translate("LOADING");
      wrapper.className = "dimmed light small";
      return wrapper;
    }

    var energy = this.energyData[0];
    var energyValue = energy ? energy.toFixed(2) : "-";
    var energyUnit = this.config.unit;
    var label = this.translate("ENERGY_LABEL");

    wrapper.innerHTML = `${label}: ${energyValue} ${energyUnit}`;
    wrapper.className = "small";
    return wrapper;
  },

  // Override notification handler.
  notificationReceived: function (notification, payload, sender) {
    if (notification === "DOM_OBJECTS_CREATED") {
      this.sendSocketNotification("CONFIG", this.config);
    }
  },

  // Override socket notification handler.
  socketNotificationReceived: function (notification, payload) {
    if (notification === "DATA") {
      this.energyData = payload;
      this.loaded = true;
      this.updateDom();
    }
  },

  // Helper function to fetch data from the Zaptec API.
  getData: function () {
    this.sendSocketNotification("GET_DATA");
  },

  // Helper function to schedule regular data updates.
  scheduleUpdate: function () {
    var self = this;
    setInterval(function () {
      self.getData();
    }, this.config.updateInterval);
  },
});

