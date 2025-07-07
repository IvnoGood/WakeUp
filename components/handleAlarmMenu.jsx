import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';

export const handleAlarmMenuSelect = async (value, alarmId, alarm, setFavorites, favorites,) => {
    const navigation = useRouter();
    if (value === 'delete') {
        const RawSavedDevices = JSON.parse(await AsyncStorage.getItem('alarms'))
        const newArray = RawSavedDevices.filter(alarm => alarm.id !== alarmId)
        await AsyncStorage.setItem('alarms', JSON.stringify(newArray));

        const newFavArray = favorites.filter(fav => alarm.id !== fav.id);
        await AsyncStorage.setItem('favs', JSON.stringify(newFavArray))

        console.log('completed succesfully');
        setFavorites(newFavArray)
    } else if (value === 'manageFavs') {
        const isFav = favorites.map(favorite => {
            if (favorite.id == alarmId) {
                return true
            } else {
                return false
            }
        })[0];
        if (isFav) {
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
    } else if (value === 'edit') {
        await AsyncStorage.setItem('EditableContent', JSON.stringify(alarm))
        navigation.push('/editFile')

    }
}