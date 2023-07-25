import Start from './components/Start';
import Chat from './components/Chat';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyAW2YTG28gLkh_2_tpLTdiE3_sJVyPAaU0",
    authDomain: "chatapp-c6753.firebaseapp.com",
    projectId: "chatapp-c6753",
    storageBucket: "chatapp-c6753.appspot.com",
    messagingSenderId: "761041089695",
    appId: "1:761041089695:web:1ec2b7a797cfd54e1e5eaa"
  };

  // initializing firebase
  const app = initializeApp(firebaseConfig);

  // db is object that can be passed to Start or Chat to read and write to/from database
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
        >
          {props => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;