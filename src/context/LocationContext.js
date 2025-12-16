import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { createContext, useContext, useEffect, useState } from 'react';
import { stores as defaultStores } from '../data/stores';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [stores, setStores] = useState(defaultStores);
    const [sortedStores, setSortedStores] = useState(defaultStores);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            // Calculate distances and sort stores
            updateStoresWithDistance(location.coords, defaultStores);
            setLoading(false);
        })();
    }, []);

    const updateStoresWithDistance = (userCoords, storesList) => {
        const storesWithDistance = storesList.map(store => {
            const distance = getDistance(
                { latitude: userCoords.latitude, longitude: userCoords.longitude },
                { latitude: store.latitude, longitude: store.longitude }
            );
            // Convert to km and round to 2 decimals
            return { ...store, distance: (distance / 1000).toFixed(2), distanceValue: distance };
        });

        // Sort by distance (nearest first)
        const sorted = storesWithDistance.sort((a, b) => a.distanceValue - b.distanceValue);
        setSortedStores(sorted);
    };

    return (
        <LocationContext.Provider value={{ location, errorMsg, sortedStores, loading }}>
            {children}
        </LocationContext.Provider>
    );
};
