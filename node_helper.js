const request = require("request");
const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  // Override start method.
  start: function () {
    console.log(`Starting node helper for module [${this.name}]`);
  },

  // Override socket notification handler.
  socketNotificationReceived: function (notification, payload) {
    if (notification === "CONFIG") {
      this.config = payload;
      this.getData();
    }
  },

  // Helper function to fetch data from the Zaptec API.
  getData: function () {
    var self = this;
    var options = {
      url: "https://api.zaptec.com/api/chargehistory",
      headers: {
        Authorization: `Bearer ${this.config.token}`,
      },
      json: true,
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var energyData = body.Data.map(function (item) {
          return item.Energy;
        });
        self.sendSocketNotification("DATA", energyData);
      } else {
        console.log(
          `Error getting data from Zaptec API: ${error} (${response.statusCode})`
        );
      }
    });
  },
});
