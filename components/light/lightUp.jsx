import AsyncStorage from "@react-native-async-storage/async-storage";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function getAlarmState(alarm, isTesting) {
    const rawAlarmState = await AsyncStorage.getItem(alarm.id)
    let alarmState = rawAlarmState ? JSON.parse(rawAlarmState) : false
    if (alarmState === null && isTesting || alarmState || !alarmState && isTesting) {
        return true
    } else if (alarmState === null) {
        return null
    } else {
        return false
    }
}

export async function blink(devices, alarm, isTesting) {
    try {
        const maxpower = Math.floor(alarm.brightness)
        const precision = 1
        const alarmState = await getAlarmState(alarm, isTesting)
        if (alarmState === null) {
            console.error("Error while fetching data")
            return
        }

        if (precision == 0 || precision > 1) {
            console.warn('precision cannot be set to zero or > than 1')
            //setPrecision(1)
        }
        //Prepare the lamp by putting default values like color and transition time
        await fetch(`http://${devices.ip}/json/state`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "bri": 0, "on": true, transition: 4, seg: [{ "col": [devices.color] }] }),
        }).then(response => response.status)
            // .then(data => console.log(data))
            .catch(error => console.error('Error:', error));

        const Steps = maxpower * precision / alarm.sunriseTime
        let currentStep = Steps
        let multiplier = 1
        let bright = 0
        await sleep(1000);
        if (alarmState) {
            while (multiplier - 1 < alarm.sunriseTime) { //bright < maxpower && stop === true
                let state = await getAlarmState(alarm, isTesting)
                if (state) {
                    bright = Math.floor(currentStep * multiplier)
                    fetch(`http://${devices.ip}/json/state`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ bri: bright }),
                    }).then(response => response.status)
                        // .then(data => console.log(data))
                        .catch(error => console.error('Error:', error));
                    multiplier += 1
                    await sleep(1000)
                } else {
                    fetch(`http://${devices.ip}/json/state`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ bri: alarm.brightness }),
                    }).then(response => response.status)
                        // .then(data => console.log(data))
                        .catch(error => console.error('Error:', error));
                    break
                }
            }
        } else {
            console.warn("Maybe error but alarm lighUp stopped at lunch")
        }
        console.warn("finished succesfuly")
    } catch (e) {
        console.error("error happened", e)
    }
}