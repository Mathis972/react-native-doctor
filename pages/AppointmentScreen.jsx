import * as React from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

import { View, Text } from 'react-native';

const AppointmentScreen = ({navigation,route}) => {
    const mapRef = React.useRef(null);
    const markerData = {latitude: route.params.appointment.lat ?? 0, longitude: route.params.appointment.lon ?? 0, latitudeDelta: 0.01,
        longitudeDelta: 0.01}
    return <View>
        <Text>Client {route.params.appointment.profiles.first_name} {route.params.appointment.profiles.last_name}</Text>
        <Text>Addresse {route.params.appointment.address}</Text>
        <MapView ref={mapRef} style={{height: 300, width: "100%"}} onMapReady={() => mapRef.current.animateToRegion(markerData, 2000)} 
        provider={PROVIDER_GOOGLE}>
        <Marker
            coordinate={markerData}
            title={`${route.params.appointment.profiles.first_name} ${route.params.appointment.profiles.last_name}`}
            pinColor='blue'
            description={route.params.appointment.address}
            />
        </MapView>
    </View>
}

export default AppointmentScreen