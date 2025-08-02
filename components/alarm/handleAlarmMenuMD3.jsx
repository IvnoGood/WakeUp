import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import uuid from 'react-native-uuid';

const navigation = useRouter();
export async function DeleteAlarm(value, alarmId, alarm, setFavorites, favorites, alarms, setAlarms) {
    try {
        const newArray = alarms.filter(alarm => alarm.id !== alarmId)
        await AsyncStorage.setItem('alarms', JSON.stringify(newArray));
        if (setAlarms) setAlarms(newArray)

        const newFavArray = favorites.filter(fav => alarm.id !== fav.id);
        await AsyncStorage.setItem('favs', JSON.stringify(newFavArray))

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
        let isFav = fav.indexOf(strAlarm)

        if (isFav != -1) {
            const newArray = favorites.filter(fav => alarm.id !== fav.id);
            await AsyncStorage.setItem('favs', JSON.stringify(newArray))
            if (setFavorites) setFavorites(newArray)
        } else {
            const rawFavs = await AsyncStorage.getItem('favs')
            const favs = rawFavs ? JSON.parse(rawFavs) : []

            const newFavs = [...favs, alarm]
            setFavorites(newFavs)
            await AsyncStorage.setItem('favs', JSON.stringify(newFavs))
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

        let newAlarm = { ...alarm }
        newAlarm.title = "Duplicated - " + alarm.title
        newAlarm.id = uuid.v4()
        const newAlarms = [...alarms, newAlarm]
        if (setAlarms != null) {
            setAlarms(newAlarms)
        }
        await AsyncStorage.setItem('alarms', JSON.stringify(newAlarms))
    } catch (e) {
        console.error('Error happened', e)
    }
}