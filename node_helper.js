const NodeHelper = require("node_helper");
const axios = require("axios");

module.exports = NodeHelper.create({
  start: function() {
    console.log(`Starting helper: ${this.name}`);
    setInterval(() => {
      console.log("Retrieving charger data");
      const options = {
        method: "GET",
        url: "https://api.zaptec.com/api/chargers",
        headers: {
          "Authorization": "Bearer " + this.config.bearerToken,
          "accept": "text/plain"
        }
      };
      this.makeRequest(options);
    }, this.config.updateInterval);
  },

  socketNotificationReceived: function(notification, payload) {
    console.log("Received socket notification:", notification, "with payload:", payload);

    if (notification === "GET_CHARGER_DATA") {
      this.config = payload;
      console.log("Retrieving charger data");
      const options = {
        method: "GET",
        url: "https://api.zaptec.com/api/chargers",
        headers: {
          "Authorization": "Bearer " + payload.bearerToken,
          "accept": "text/plain"
        }
      };
      this.makeRequest(options);
    } else if (notification === "GET_CHARGE_HISTORY") {
      this.config = payload;
      console.log("Retrieving charge history");
      const options = {
        method: "GET",
        url: "https://api.zaptec.com/api/chargehistory",
        headers: {
          "Authorization": "Bearer " + payload.bearerToken,
          "accept": "text/plain"
        },
        params: {
          charger: payload.charger,
          fromDate: payload.fromDate,
          toDate: payload.toDate
        }
      };
      this.getChargeHistory(options);
    }
  },

  makeRequest: function(options) {
    const self = this;
    axios(options)
      .then(function(response) {
        if (response.status === 200) {
          const chargerData = response.data.Data;
          console.log("Got charger data:", chargerData);
          self.sendSocketNotification("CHARGER_DATA_RESULT", { chargerData: chargerData });
        } else {
          console.error(`Error getting charger data: ${response.statusText}`);
          self.sendSocketNotification("CHARGER_DATA_RESULT", { error: response.statusText });
        }
      })
      .catch(function(error) {
        console.error(`Error getting charger data: ${error}`);
        self.sendSocketNotification("CHARGER_DATA_RESULT", { error: error.message });
      });
  },

getChargeHistory: function(options) {
  const self = this;
  axios(options)
    .then(function(response) {
      if (response.status === 200) {
        const chargeHistory = response.data.Data;
        console.log("Got charge history:", chargeHistory);
        // Get the last session only
        const lastSession = chargeHistory[chargeHistory.length - 1];
        const energyData = [lastSession.Energy];
        self.sendSocketNotification("CHARGE_HISTORY_RESULT", { energyData: energyData });
      } else {
        console.error(`Error getting charge history: ${response.statusText}`);
        self.sendSocketNotification("CHARGE_HISTORY_RESULT", { error: response.statusText });
      }
    })
    .catch(function(error) {
      console.error(`Error getting charge history: ${error}`);
      self.sendSocketNotification("CHARGE_HISTORY_RESULT", { error: error.message });
    });
}
});
