import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import uuid from 'react-native-uuid';

const navigation = useRouter();
export async function DeleteAlarm(value, alarmId, alarm, setFavorites, favorites, alarms, setAlarms) {
    try {
        const RawSavedDevices = JSON.parse(await AsyncStorage.getItem('alarms'))
        const newArray = RawSavedDevices.filter(alarm => alarm.id !== alarmId)
        await AsyncStorage.setItem('alarms', JSON.stringify(newArray));
        setAlarms ? setAlarms(newArray) : console.log("skipped setAlarms function bc not exist");

        const newFavArray = favorites.filter(fav => alarm.id !== fav.id);
        await AsyncStorage.setItem('favs', JSON.stringify(newFavArray))

        console.log('completed succesfully');
        setFavorites(newFavArray)
    } catch (e) {
        console.error("error while deleting the fav", e)
    }
}
export async function manageAlarmFavorite(value, alarmId, alarm, setFavorites, favorites, alarms, setAlarms) {
    try {
        /* const isFav = favorites.map(favorite => {
            if (favorite.id == alarmId) {
                return true
            }
        })[0]; */
        const fav = JSON.stringify(favorites)
        const strAlarm = JSON.stringify(alarm)
        var isFav = fav.indexOf(strAlarm)

        if (isFav != -1) {
            const newArray = favorites.filter(fav => alarm.id !== fav.id);
            await AsyncStorage.setItem('favs', JSON.stringify(newArray))
            console.log('completed succesfully');
            setFavorites ? setFavorites(newArray) : console.log("setFavorites function is null")
        } else {
            const rawFavs = await AsyncStorage.getItem('favs')
            const favs = rawFavs ? JSON.parse(rawFavs) : []

            const newFavs = [...favs, alarm]
            setFavorites(newFavs)
            await AsyncStorage.setItem('favs', JSON.stringify(newFavs))
            console.log("newfavs: ", newFavs)
        }
    } catch (e) {
        console.error("Error happened", e)
    }
}
export async function editAlarm(value, alarmId, alarm, setFavorites, favorites, alarms, setAlarms) {
    await AsyncStorage.setItem('EditableContent', JSON.stringify(alarm))
    navigation.push('/newAlarm')

}
export async function duplicateAlarm(value, alarmId, alarm, setFavorites, favorites, alarms, setAlarms) {
    try {
        if (alarms == null) {
            const rawAlarms = await AsyncStorage.getItem('alarms')
            if (rawAlarms) {
                alarms = JSON.parse(rawAlarms)
            } else {
                console.error("Error while fetching from alarms storage: ", rawAlarms)
                return
            }
        }

        var newAlarm = { ...alarm }
        newAlarm.title = "Duplicated - " + alarm.title
        newAlarm.id = uuid.v4()
        console.log("Alarms", alarms)
        console.log("NewAlarm", newAlarm)
        const newAlarms = [...alarms, newAlarm]
        if (setAlarms != null) {
            setAlarms(newAlarms)
        }
        console.log(newAlarms)
        await AsyncStorage.setItem('alarms', JSON.stringify(newAlarms))
    } catch (e) {
        console.error('Error happened', e)
    }
}