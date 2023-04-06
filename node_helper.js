const NodeHelper = require('node_helper');
const request = require('request');

module.exports = NodeHelper.create({

  start: function () {
    console.log('Starting node_helper for module: ' + this.name);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === 'GET_DATA') {
      const self = this;
      const options = {
        url: `https://${payload.server}/api/live`,
        headers: {
          Authorization: `Bearer ${payload.token}`,
          'User-Agent': 'MMM-ZAPTEC'
        }
      };
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          const data = JSON.parse(body);
          self.sendSocketNotification('DATA_RECEIVED', data);
        } else {
          console.log('Error fetching data: ', error);
        }
      });
    }
  }
});
