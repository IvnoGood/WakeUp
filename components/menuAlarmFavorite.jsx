export const menuAlarmFavorite = (alarm, favorites) => {
    const strAlarm = JSON.stringify(alarm)
    const strFavs = JSON.stringify(favorites)

    const isFav = strFavs.indexOf(strAlarm)
    if (isFav != -1) {
        return 'Remove favorite'
    } else { return 'Add to favorites' }
}