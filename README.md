# MMM-ZAPTEC 

This is a Magic Mirror module for connecting to the ZAPTEC API
and showing information on your Mirror.



[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/J3J2EARPK)



THIS JUST STARTED AND IS MISSING 80% OF FUNCTIONS

irritation 1: show zaptec chargers and the status of them.


how to install:
```
cd MagicMirror/modules
git clone https://github.com/PierreGode/MMM-ZAPTEC.git
```
in MagicMirror/config/config.js



```
{
  module: "MMM-ZAPTEC",
  position: "bottom_right",
  header: "Zaptec Charger",
  config: {
    bearerToken: "API TOKEN",
    updateInterval: 60000 // update every minute
  }
},
