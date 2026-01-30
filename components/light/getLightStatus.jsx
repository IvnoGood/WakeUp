const getLightStatus = async (ipAddress, deviceType) => {
    if (deviceType === 'Arduino') {
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