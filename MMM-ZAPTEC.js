Module.register("MMM-ZAPTEC", {
  // Define module defaults
  defaults: {},

  // Override start method.
  start: function() {
    this.message = "Hello World";
  },

  // Override dom generator.
  getDom: function() {
    var wrapper = document.createElement("div");
    wrapper.innerHTML = this.message;
    return wrapper;
  }
});
