getLastChargeHistory: function(options) {
  const self = this;
  axios(options)
    .then(function(response) {
      if (response.status === 200) {
        const chargeHistory = response.data.Data;
        const lastChargeHistory = chargeHistory[chargeHistory.length - 1];
        console.log("Got last charge history:", lastChargeHistory);
        self.sendSocketNotification("LAST_CHARGE_HISTORY_RESULT", { lastChargeHistory: lastChargeHistory });
      } else {
        console.error(`Error getting last charge history: ${response.statusText}`);
        self.sendSocketNotification("LAST_CHARGE_HISTORY_RESULT", { error: response.statusText });
      }
    })
    .catch(function(error) {
      console.error(`Error getting last charge history: ${error}`);
      self.sendSocketNotification("LAST_CHARGE_HISTORY_RESULT", { error: error.message });
    });
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
      }
    };
    this.getChargeHistory(options);
  } else if (notification === "GET_LAST_CHARGE_HISTORY") {
    this.config = payload;
    console.log("Retrieving last charge history");
    const options = {
      method: "GET",
      url: "https://api.zaptec.com/api/chargehistory",
      headers: {
        "Authorization": "Bearer " + payload.bearerToken,
        "accept": "text/plain"
      }
    };
    this.getLastChargeHistory(options);
  } else if (notification === "CHARGER_DATA_RESULT") {
    if (payload.error) {
      console.error(`Error getting charger data: ${payload.error}`);
      return;
    }
    console.log("Received charger data");
    this.chargerData = payload.chargerData;
    this.sendSocketNotification("CHARGER_DATA_RESULT", payload);
  } else if (notification === "CHARGE_HISTORY_RESULT") {
    if (payload.error) {
      console.error(`Error getting charge history: ${payload.error}`);
      return;
    }
    console.log("Received charge history");
    this.chargeHistory = payload.chargeHistory;
    this.sendSocketNotification("CHARGE_HISTORY_RESULT", payload);
  } else if (notification === "LAST_CHARGE_HISTORY_RESULT") {
    if (payload.error) {
      console.error(`Error getting last charge history: ${payload.error}`);
      return;
    }
    console.log("Received last charge history");
    this.lastChargeHistory = payload.lastChargeHistory;
    this.sendSocketNotification("LAST_CHARGE_HISTORY_RESULT", payload);
  }
}
