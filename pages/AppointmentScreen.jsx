import * as React from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

import { View, Text, Button } from 'react-native';
import {
  cancelScheduledNotificationAsync,
  scheduleNotificationAsync,
} from 'expo-notifications';

const AppointmentScreen = ({ navigation, route }) => {
  const [notificationId, setNotificationId] = React.useState(0);
  const isBefore = new Date() > new Date(route.params.appointment.date);

  const mapRef = React.useRef(null);
  const markerData = {
    latitude: route.params.appointment.lat ?? 0,
    longitude: route.params.appointment.lon ?? 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const setupNotification = async () => {
    const trigger = new Date(route.params.appointment.date);
    const notifId = await scheduleNotificationAsync({
      content: {
        title: "Rendez vous prévu ajourd'hui !",
        body: `RDV avec Mr ${route.params.appointment.profiles.first_name} ${route.params.appointment.profiles.last_name} au ${route.params.appointment.address}!`,
      },
      trigger: trigger,
    });
    setNotificationId(notifId);
  };
  return (
    <View>
      <Text>
        Client {route.params.appointment.profiles.first_name}{' '}
        {route.params.appointment.profiles.last_name}
      </Text>
      <Text>Addresse {route.params.appointment.address}</Text>
      {!isBefore && (
        <View>
          <Text>Souhaitez vous etre notifié le jour du RDV?</Text>
          {!notificationId ? (
            <Button title="Me notifier" onPress={setupNotification}></Button>
          ) : (
            <Button
              title="Ne plus me notifier"
              onPress={() => {
                cancelScheduledNotificationAsync(notificationId);
                setNotificationId(0);
              }}
            />
          )}
        </View>
      )}
      <MapView
        ref={mapRef}
        style={{ height: 300, width: '100%' }}
        onMapReady={() => mapRef.current.animateToRegion(markerData, 2000)}
        provider={PROVIDER_GOOGLE}
      >
        <Marker
          coordinate={markerData}
          title={`${route.params.appointment.profiles.first_name} ${route.params.appointment.profiles.last_name}`}
          pinColor="blue"
          description={route.params.appointment.address}
        />
      </MapView>
    </View>
  );
};

export default AppointmentScreen;
