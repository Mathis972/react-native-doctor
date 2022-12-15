import { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Agenda, AgendaList, Calendar, CalendarList } from 'react-native-calendars';
import { Button, Input } from 'react-native-elements';
import { supabase } from '../supabase';

export default function AccountScreen({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const session = route.params.session;

  useEffect(() => {
    if (session) {
      getProfile();
      getAppointments();
    }
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`first_name, last_name`)
        .eq('id', session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        setUsername(data.first_name + ' ' + data.last_name);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session?.user.id,
        username,
        updated_at: new Date(),
      };

      let { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function getAppointments() {
    try {
      let { data, error } = await supabase
        .from('appointments')
        .select('*, profiles!appointments_client_id_fkey(*)')
        .eq('doctor_id', session?.user.id);
      if (error) throw error;
      if (data) {
        console?.log(data);
        for (const apt of data) {
          const isBefore = new Date() > new Date(apt.date);
          markedDates[apt.date] = {
            selected: true,
            marked: true,
            selectedColor: isBefore ? 'grey' : 'blue',
            name: `RDV avec ${apt.profiles.first_name} ${apt.profiles.last_name}`,
          };
          setMarkedDates(markedDates);
          console.log(markedDates);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Username"
          value={username || ''}
          onChangeText={(text) => setUsername(text)}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() => updateProfile({ username })}
          disabled={loading}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
      <Calendar
        onDayPress={day => {
            console.log('selected day', day);
        }}
        onMonthChange={month => {
            console.log('month changed', month);
        }}
        markingType={'multi-dot'}
        markedDates={markedDates}
        hideArrows={true}
        renderArrow={direction => <Arrow />}
        hideExtraDays={true}
        disableMonthChange={true}
        firstDay={1}
        hideDayNames={false}
        onPressArrowLeft={subtractMonth => subtractMonth()}
        onPressArrowRight={addMonth => addMonth()}
        disableAllTouchEventsForDisabledDays={true}
        enableSwipeMonths={true}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
});
