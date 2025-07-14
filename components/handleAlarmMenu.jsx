import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import uuid from 'react-native-uuid';

export const handleAlarmMenuSelect = async (value, alarmId, alarm, setFavorites, favorites, alarms, setAlarms) => {
    const navigation = useRouter();
    if (value === 'delete') {
        const RawSavedDevices = JSON.parse(await AsyncStorage.getItem('alarms'))
        const newArray = RawSavedDevices.filter(alarm => alarm.id !== alarmId)
        await AsyncStorage.setItem('alarms', JSON.stringify(newArray));
        setAlarms(newArray)

        const newFavArray = favorites.filter(fav => alarm.id !== fav.id);
        await AsyncStorage.setItem('favs', JSON.stringify(newFavArray))

        console.log('completed succesfully');
        setFavorites(newFavArray)
    } else if (value === 'manageFavs') {
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
                setFavorites(newArray)
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
    } else if (value === 'edit') {
        await AsyncStorage.setItem('EditableContent', JSON.stringify(alarm))
        navigation.push('/newAlarm')

    } else if (value === 'duplicate') {
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
}