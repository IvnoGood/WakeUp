# Configure the app

Table of contents:

- [Why do we need notification access](https://github.com/IvnoGood/WakeUp/blob/devloppement/docs/findWLEDIp.md#why-do-we-need-notification-access)

- [How to find WLED device ip](https://github.com/IvnoGood/WakeUp/blob/devloppement/docs/findWLEDIp.md#how-to-find-wled-device-ip)

# Why do we need notification access

Notifications on some app might be a little stressing but in this app we need them to schedule your alarms let me explain:

</br>

We display notifications using [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) but schedule them using [Expo TaskManager](https://docs.expo.dev/versions/latest/sdk/task-manager/) to let the app work in foreground. <br/>

Then we use a notification listener to listen to every changes in notifications

```javascript
Notifications.addNotificationReceivedListener((notification)  => {...
```

and then further we call the alarm process

```javascript
// Manually start your light sequence function
blink(device, alarm);
```

so with all of that your alarms can set up and lunch correctly

# How to find WLED device IP

Your WLED device IP address is needed to make API calls (or talk with your device for our non tech-savvy friends) to find it you first need to check if it's in connected to wifi.

## Check if it's connected to wifi

To check that you can connect it to a computer go to the [WLED installation website](https://install.wled.me/) click install and choose your device then change it's wifi in the configuration or you can re-install the firmware binaries if you have problems check the [official website](https://kno.wled.ge/basics/getting-started/) for more informations.

## Check IP

### Method n°1

To check the ip it can be done through the [WLED installation website](https://install.wled.me/) on the visit device button

> [!WARNING]  
> Don't paste the whole link just use the IP address alone eg: http://192.168.1.170/#Colors → 192.168.1.170

### Method n°2

You can check it on your phone using the app Network Analyzer on android go to the LAN Scan tab and then scan your network

> [!WARNING]  
> Make sure you're connected to the same network as your WLED device

Once the scan has finished check for device name like (wled-[some id]) grab it's IP and paste it on the app.

## Final Step

Paste all and then check if it works then you're be good to go
