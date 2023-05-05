const NodeHelper = require("node_helper");
const axios = require("axios");
module.exports = NodeHelper.create({
  start: function() {
    console.log(`Starting helper: ${this.name}`);
  },

  setConfig: function(config) {
    this.config = config;
    this.username = config.username;
    this.password = config.password;
  },

scheduleDataRefresh: function() {
  const scheduleIfTokenSet = () => {
    if (this.bearerToken) {
      console.log("Scheduling data refresh");
      setInterval(() => {
        console.log("Retrieving charger data");
        const options = {
          method: "GET",
          url: "https://api.zaptec.com/api/chargers",
          headers: {
            "Authorization": `Bearer ${this.bearerToken}`,
            "accept": "text/plain"
          }
        };
        this.makeRequest(options);

        // If enableChargeHistory is true, send the GET_CHARGE_HISTORY notification
        if (this.config.enableChargeHistory) {
          this.sendSocketNotification("GET_CHARGE_HISTORY");
        }

      }, 300000); // Set the interval to 5 minutes (300000 milliseconds)
    } else {
      console.error("Error: Bearer token not set. Please authenticate with Zaptec API first.");
      setTimeout(scheduleIfTokenSet, 1000); // Check again after 1 second
    }
  };

  scheduleIfTokenSet();
},


  refreshBearerToken: function() {
    console.log("Refreshing bearer token");
    const self = this;

    const encodedCredentials = Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64');
    console.log(`Encoded credentials: ${encodedCredentials}`);

    const options = {
      method: "POST",
      url: "https://api.zaptec.com/oauth/token",
      headers: {
        "accept": "application/json",
        "content-type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${encodedCredentials}`
      },
      data: `grant_type=password&username=${encodeURIComponent(this.config.username)}&password=${encodeURIComponent(this.config.password)}`
    };
axios(options)
    .then(function(response) {
      if (response.status === 200) {
        self.bearerToken = response.data.access_token;
        console.log("Got bearer token:", self.bearerToken);
        self.scheduleDataRefresh(); // Schedule data refresh after getting the token
      } else {
        console.error(`Error getting bearer token: ${response.statusText}`);
      }
    })
      .catch(function(error) {
        console.error(`Error getting bearer token: ${error}`);
      })
      .finally(function() {
        setTimeout(() => {
          self.refreshBearerToken();
        }, 86400000); // Refresh every 24 hours
      });
  },

socketNotificationReceived: function(notification, payload) {
  console.log("Received socket notification:", notification, "with payload:", payload);

  if (notification === "SET_CONFIG") {
    this.setConfig(payload);
    this.refreshBearerToken();
    this.scheduleDataRefresh();
  } else if (notification === "GET_CHARGER_DATA") {
    if (this.bearerToken) {
      const options = {
        method: "GET",
        url: "https://api.zaptec.com/api/chargers",
        headers: {
          "Authorization": `Bearer ${this.bearerToken}`,
          "accept": "text/plain"
        }
      };
      this.makeRequest(options);
    } else {
      console.error("Error: Bearer token not set. Please authenticate with Zaptec API first.");
    }
  } else if (notification === "GET_CHARGE_HISTORY") {
    if (this.bearerToken) {
      this.getChargeHistory();
    } else {
      console.error("Error: Bearer token not set. Please authenticate with Zaptec API first.");
    }
  }
},

getChargeHistory: function() {
  const self = this;
  const options = {
    method: "GET",
    url: "https://api.zaptec.com/api/chargehistory",
    headers: {
      "Authorization": `Bearer ${this.bearerToken}`,
      "accept": "text/plain"
    }
  };
  axios(options)
    .then(function(response) {
      if (response.status === 200) {
        const chargeHistoryData = response.data.Data;
        console.log("Got charge history data:", chargeHistoryData);
        self.sendSocketNotification("CHARGE_HISTORY_RESULT", { chargeHistoryData: chargeHistoryData });
      } else {
        console.error(`Error getting charge history data: ${response.statusText}`);
        self.sendSocketNotification("CHARGE_HISTORY_RESULT", { error: response.statusText });
      }
    })
    .catch(function(error) {
      console.error(`Error getting charge history data: ${error}`);
      self.sendSocketNotification("CHARGE_HISTORY_RESULT", { error: error.message });
    });
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
});
