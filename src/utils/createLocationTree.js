const createLocationTree = (locationObj) => {

    {
        return {
          name: 'root',
          children: locationObj.placesList.map((place) => {
            const zones = locationObj.placeObj[place.value]?.zonesList || [];
            const selfsObj = locationObj.placeObj[place.value]?.selfsObj || {};
      
            return {
              name: place.label,
              children: zones.map((zone) => {
                const selfs = selfsObj[zone.value] || [];
      
                return {
                  name: zone.label,
                  children: selfs.map((self) => ({
                    name: self.label
                  }))
                };
              })
            };
          })
        };
    }

} 
export default createLocationTree;