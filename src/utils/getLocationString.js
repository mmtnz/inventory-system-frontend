const getLocationString = (place, location, sublocation) => {

    if (location) {
        if (sublocation) {
            return `${place} / ${location} '/' ${sublocation}`
        }
        return `${place} / ${location}`
    }
    return `${place}`
}
export {getLocationString};