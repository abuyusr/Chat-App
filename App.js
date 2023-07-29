import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';

import { StyleSheet, Alert } from 'react-native';
// import the screens
import Start from './components/Start';
import Chat from './components/Chat';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Create the navigator
const Stack = createNativeStackNavigator();

// iniltialize a connection to firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, disableNetwork, enableNetwork } from 'firebase/firestore';


const App = () => {
  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("No internet connection");
    disableNetwork(db);
  } else if (connectionStatus.isConnected === true) {
    enableNetwork(db);
  }
  }, [connectionStatus.isConnected]);

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAW2YTG28gLkh_2_tpLTdiE3_sJVyPAaU0",
  authDomain: "chatapp-c6753.firebaseapp.com",
  projectId: "chatapp-c6753",
  storageBucket: "chatapp-c6753.appspot.com",
  messagingSenderId: "761041089695",
  appId: "1:761041089695:web:1ec2b7a797cfd54e1e5eaa"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen name="Chat">
          {(props) => <Chat isConnected={connectionStatus.isConnected} {...props} db={db} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default App;