# MMM-ZAPTEC 

This is a Magic Mirror module for connecting to the ZAPTEC API
and showing information on your Mirror.



[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/J3J2EARPK)


Irritation 1: Show zaptec chargers and the status of them.

![image](https://user-images.githubusercontent.com/8579922/233061820-5e3606fb-693b-4d10-bdaf-df3b4048f9a5.png)
![image](https://user-images.githubusercontent.com/8579922/236442228-eb3d4f31-8324-4f9f-b887-34be1ae1b63e.png)
![image](https://user-images.githubusercontent.com/8579922/236442489-1de8acd2-7890-4389-a0c5-94275a33a664.png)
![image](https://user-images.githubusercontent.com/8579922/236442808-66bb94ed-3900-4c0b-a62c-57bdd1dd3ca7.png)



To get your api token go [here](https://api.zaptec.com/help/index.html)
then authorize
and go to /api/chargers and > try it out > execute 
you will get an curl line with a Bearer: copy that token.


How to install:
```
cd MagicMirror/modules
```
```
git clone https://github.com/PierreGode/MMM-ZAPTEC.git
```
In MagicMirror/config/config.js



```
{
  module: "MMM-ZAPTEC",
  position: "bottom_right",
  header: "Zaptec",
  config: {
    username: "YOUR_USERNAME",
    password: "YOUR_PASSWORD",
    updateInterval: 30000,
    lang: "swe",
    enableChargeHistory: true,
    charger: "all", // set to "all" to display data for all chargers, or set to a specific charger number (1-8) to display data for only that charger
    showHistoryEntries: 5 // define the max amount of charge history entries to show
  }
},

```
Restart magic mirror.
After starting the module can take up to 60 sec to pull the first data.

```
languages supported.

Arabic (ara)
Chinese (chi)
Danish (dan)
Dutch (dut)
English (eng)
Finnish (fin)
French (fre)
German (ger)
Hindi (hin)
Icelandic (isl)
Italian (ita)
Japanese (jpn)
Korean (kor)
Norwegian (nor)
Polish (pol)
Portuguese (por)
Spanish (spa)
Swedish (swe)
```
Api free: yes
<p>
development status: WIP 
