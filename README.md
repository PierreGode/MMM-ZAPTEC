# MMM-ZAPTEC 

This is a [MagicMirror²](https://magicmirror.builders/) module for connecting to the ZAPTEC API
and showing charger information on your Mirror.
18 languages supported



[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/J3J2EARPK)

## Screenshots

![image](https://user-images.githubusercontent.com/8579922/233061820-5e3606fb-693b-4d10-bdaf-df3b4048f9a5.png)
![image](https://user-images.githubusercontent.com/8579922/236442228-eb3d4f31-8324-4f9f-b887-34be1ae1b63e.png)
![image](https://user-images.githubusercontent.com/8579922/236442489-1de8acd2-7890-4389-a0c5-94275a33a664.png)
![image](https://user-images.githubusercontent.com/8579922/236442808-66bb94ed-3900-4c0b-a62c-57bdd1dd3ca7.png)



## How to install

```
cd MagicMirror/modules
```
```
git clone https://github.com/PierreGode/MMM-ZAPTEC.git
```
In MagicMirror/config/config.js


## Config

```
{
  module: "MMM-ZAPTEC",
  position: "bottom_right",
  header: "Zaptec",
  config: {
    username: "YOUR_USERNAME",
    password: "YOUR_PASSWORD",
    updateInterval: 30000,
    lang: "sv",
    enableChargeHistory: true,
    charger: "all",
    showHistoryEntries: 5 
 }
},
```

## Description

```
charger: "all", // set to "all" to display data for all chargers, 
or set to a specific charger number (1-99) to display data for only that charge, set none to hide chargers.

showHistoryEntries: 5 // define the max amount of charge history entries to show
```

yes sorry for username and password but the token only had a ttl of 24H / will find a resolition for this in the future.

Restart magic mirror.(pm2 restart)
After starting the module can take up to 60 sec to pull the first data.

```
languages supported.

Arabic: ar (العربية)
Chinese: zh (中文)
Danish: da (Dansk)
Dutch: nl (Nederlands)
English: en (English)
Finnish: fi (Suomi)
French: fr (Français)
German: de (Deutsch)
Hindi: hi (हिन्दी)
Icelandic: is (Íslenska)
Italian: it (Italiano)
Japanese: ja (日本語)
Korean: ko (한국어)
Norwegian: no (Norsk)
Polish: pl (Polski)
Portuguese: pt (Português)
Spanish: es (Español)
Swedish: sv (Svenska)
```

Api free: yes
<p>
development status: Complete 
