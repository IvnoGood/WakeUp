import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"
const CheckIfHasDevice = async () => {
    const router = useRouter()
    try {
        const RawSavedDevices = await AsyncStorage.getItem('devices')
        const SavedDevices = RawSavedDevices ? JSON.parse(RawSavedDevices) : null
        if (SavedDevices === null) {
            router.push('welcome/welcomeScreen')
            return true
        } else {
            false
        }
    } catch (e) {
        console.error('error reading value', e)
        false
    }
}

export default CheckIfHasDevice