import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"
const CheckIfHasDevice = async () => {
    const router = useRouter()
    try {
        const RawSavedDevices = await AsyncStorage.getItem('devices')
        const SavedDevices = RawSavedDevices ? JSON.parse(RawSavedDevices) : null
        console.log("savedDevices", SavedDevices)
        if (SavedDevices === null) {
            router.push('welcome/welcomeScreen')
            console.log(SavedDevices)
        } else {
            console.log("device detected")
        }
    } catch (e) {
        console.error('error reading value', e)
    }
}

export default CheckIfHasDevice