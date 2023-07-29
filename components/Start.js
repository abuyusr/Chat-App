import { getAuth, signInAnonymously } from "firebase/auth";
import { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, ImageBackground, TouchableOpacity, Alert } from 'react-native';
const Start = ({ navigation }) => {
  const auth = getAuth();
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  
  const signInUser = () => {
    signInAnonymously(auth)
      .then(result => {
        // Might need to pass the user's name and selected background color here
        navigation.navigate('Chat', { userID: result.user.uid, name: name, color: color });
        Alert.alert("Signed in successfully!");
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert("Error signing in", errorMessage);
        console.log(errorCode, errorMessage);
      });
  }
  
  const backgroundColors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];
  return (  
    <ImageBackground source={require('../assets/background-image.png')} style={styles.container}>
        <View style={styles.container}> 
        <Text style={styles.title}>Chat App</Text>      
          <View style={styles.colorSelect}>
            <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Type your name here"
              />
          <Text style={styles.colorSelectText}>Choose Background Color:</Text>
          
          <View style={styles.colorSelectContainer}>
              <TouchableOpacity 
                style={[styles.colorSelectButton, {backgroundColor: "#090C08"}]}
                onPress={() => setColor("#090C08")}
              />
              
              <TouchableOpacity
                style={[styles.colorSelectButton, {backgroundColor: "#474056"}]}
                onPress={() => setColor("#474056")}
              />
              
              <TouchableOpacity
                style={[styles.colorSelectButton, {backgroundColor: "#8A95A5"}]}
                onPress={() => setColor("#8A95A5")}
              />
              
              <TouchableOpacity
                style={[styles.colorSelectButton, {backgroundColor: "#B9C6AE"}]}
                onPress={() => setColor("#B9C6AE")}
              />
          </View>
        
              <TouchableOpacity style={[styles.chatButton]}> 
              <Text 
              // double check this code - trying to add the signInUser function to the onPress
              // might need to pass the user's name and selected background color here
              onPress={signInUser}>
                Log In to Start Chatting
              </Text>
              </TouchableOpacity>
            </View>
        </View>
    </ImageBackground>
 )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 50,
    width: "100%",
    padding: 16,
    borderWidth: 1,
    marginTop: 16,
    marginBottom: 16
  },
  title: {
    color: '#FFFFFF',
    fontSize: 45,
    fontWeight: '600',
    marginBottom: 10,
  },
  colorSelect: {
    width: "88%",
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderWidth: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  colorSelectText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757083',
    opacity: 100,
    marginBottom: 10
  },
  colorSelectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: "88%"
  },
  colorSelectButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 5
  },
  chatButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#757083',
    width: "100%",
    padding: 16,
    borderWidth: 1,
    margin: 16
  }
});

export default Start;
