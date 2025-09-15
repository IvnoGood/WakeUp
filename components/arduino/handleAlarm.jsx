export const fetchAlarmsFromArduino = async (device) => {
    const src = `http://${device.ip}/alarms`
    try {
        const response = await fetch(src)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        console.log("Fetched alarms from arduino", result);
        return result
    } catch (error) {
        console.error(error.message);
    }
}

export const sendAlarmsToArduino = async (device, alarm) => {
    const src = `http://${device.ip}/alarms`
    fetch(src, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(alarm)
    })
        .then((response) => response.json())
        //.then((data) => console.log("Success:", data))
        .catch((error) => console.error("Error:", error));
}

export const scheduleAlarmOnArduino = async (device, alarm) => {
    const src = `http://${device.ip}/setSchedule`
    fetch(src, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(alarm)
    })
        .then((response) => response.json())
        //.then((data) => console.log("Success:", data))
        .catch((error) => console.error("Error:", error));
}


export const unScheduleAlarmOnArduino = async (device, alarm) => {
    const src = `http://${device.ip}/remSchedule`
    fetch(src, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(alarm)
    })
        .then((response) => response.json())
        //.then((data) => console.log("Success:", data))
        .catch((error) => console.error("Error:", error));
}


export const listScheduleAlarmOnArduino = async (device) => {
    const src = `http://${device.ip}/listSchedule`
    try {
        const response = await fetch(src)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        console.log("All scheduled notifications: ", result);
        return result
    } catch (error) {
        console.error(error.message);
    }
}