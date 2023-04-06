const NodeHelper = require('node_helper');
const request = require('request');

module.exports = NodeHelper.create({

  start: function() {
    console.log('MMM-ZAPTEC helper started...');
  },

  getZaptecData: function(url, token) {
    const self = this;
    const options = {
      url: url,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    request(options, function(err, res, body) {
      if (err) {
        console.log(err);
        self.sendSocketNotification('ZAPTEC_DATA_ERROR');
      } else {
        const data = JSON.parse(body);
        const operatingModes = data.Data.map(function(item) {
          return item.OperatingMode;
        });
        self.sendSocketNotification('ZAPTEC_DATA_RECEIVED', operatingModes);
      }
    });
  },

  socketNotificationReceived: function(notification, payload) {
    const self = this;
    if (notification === 'GET_ZAPTEC_DATA') {
      self.getZaptecData(payload.url, payload.token);
    }
  }

});
