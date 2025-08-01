const getLightStatus = async (ipAddress) => {
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


export default getLightStatus