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
    }, 60000); // Refresh every minute

    setInterval(() => {
      if (this.config.enableChargeHistory) {
        console.log("Retrieving charge history");
        const now = new Date();
        const to = now.toISOString();
        const from = new Date(now.getTime() - (24 * 60 * 60 * 1000)).toISOString();
        const options = {
          method: "GET",
          url: "https://api.zaptec.com/api/chargehistory",
          headers: {
            "Authorization": "Bearer " + this.config.bearerToken,
            "accept": "text/plain"
          },
          params: {
            from: from,
            to: to
          }
        };
        this.makeRequest(options);
      }
    }, 60000); // Refresh every minute
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
          from: payload.from,
          to: payload.to,
          chargerId: payload.chargerId
        }
      };
      this.makeRequest(options);
    }
  }
});
makeRequest: function(options) {
    const self = this;
    axios(options)
      .then(function(response) {
        if (response.status === 200) {
          if (options.url.endsWith("api/chargers")) {
            const chargerData = response.data.Data;
            console.log("Got charger data:", chargerData);
            self.sendSocketNotification("CHARGER_DATA_RESULT", { chargerData: chargerData });
          } else if (options.url.endsWith("api/chargehistory")) {
            const chargeHistory = response.data.Data;
            console.log("Got charge history:", chargeHistory);
            self.sendSocketNotification("CHARGE_HISTORY_RESULT", { chargeHistory: chargeHistory });
          }
        } else {
          console.error(`Error getting data: ${response.statusText}`);
          if (options.url.endsWith("api/chargers")) {
            self.sendSocketNotification("CHARGER_DATA_RESULT", { error: response.statusText });
          } else if (options.url.endsWith("api/chargehistory")) {
            self.sendSocketNotification("CHARGE_HISTORY_RESULT", { error: response.statusText });
          }
        }
      })
      .catch(function(error) {
        console.error(`Error getting data: ${error}`);
        if (options.url.endsWith("api/chargers")) {
          self.sendSocketNotification("CHARGER_DATA_RESULT", { error: error.message });
        } else if (options.url.endsWith("api/chargehistory")) {
          self.sendSocketNotification("CHARGE_HISTORY_RESULT", { error: error.message });
        }
      });
  }
});
