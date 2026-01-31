import { Platform } from "react-native";

const getLightStatus = async (ipAddress, deviceType) => {
    if (Platform.OS === "web") {
        return {
            isConnected: true, response: {
                "ip_address": "0.0.0.0",
                "stripState": "on",
                "signal": 59
            }
        }
    } else if (deviceType === 'Arduino') {
        return await fetch(`http://${ipAddress}/status`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                return { isConnected: true, response: data }
            })
            .catch((e) => {
                console.log("Error while getting device status", e)
                return { isConnected: false, response: null }
            })
    } else {
        return await fetch(`http://${ipAddress}/json/info`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                //console.log(data);
                return { isConnected: true, response: data }
            })
            .catch((e) => {
                console.log("Error while getting device status", e)
                return { isConnected: false, response: null }
            })
    }
}


export default getLightStatus