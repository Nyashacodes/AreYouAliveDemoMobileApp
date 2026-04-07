import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'LAST_CHECK_IN'; // Key for AsyncStorage

export default function HomeScreen() {
  const [lastCheckIn, setLastCheckIn] = useState<Date | null>(null);

  console.log('🔵 HomeScreen render', { lastCheckIn });

  // Load last check-in when app opens
  useEffect(() => {
    console.log('🟡 App mounted → loading last check-in'); 

    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);

      if (saved) {
        console.log('🟢 Found saved check-in:', saved);
        setLastCheckIn(new Date(saved));
      } else {
        console.log('⚪ No previous check-in found');
      }
    })();
  }, []);

  const handleCheckIn = async () => {
    console.log('🔴 Button pressed → checking in');

    const now = new Date();
    console.log('🕒 Current time:', now.toISOString());

    setLastCheckIn(now);
    await AsyncStorage.setItem(STORAGE_KEY, now.toISOString());

    console.log('✅ Check-in saved to storage');

     try {
    await fetch('http://localhost:5000/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp: now.toISOString() }),
    });

    console.log('🌐 Sent check-in to server');
  } catch (err) {
    console.log('❌ API error:', err);
  }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={handleCheckIn}>
        <Text style={styles.text}>I'M SAFE</Text>
      </Pressable>

      {lastCheckIn && (
        <Text style={styles.timestamp}>
          Last check-in: {lastCheckIn.toLocaleString()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  text: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  timestamp: {
    marginTop: 20,
    color: '#444',
    fontSize: 14,
  },
});
