const getLightStatus = async (ipAddress) => {
    console.log(ipAddress)
    return await fetch(`http://${ipAddress}/json/info`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            //console.log(data);
            return { isConnected: true, response: data }
        })
        .catch((e) => {
            console.log(e)
            return { isConnected: false, response: null }
        })
}


export default getLightStatus