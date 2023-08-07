import { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { getAuth, signInAnonymously } from 'firebase/auth';


const Start = ({ navigation }) => {
    //initialize authentication handler
    const auth = getAuth();

    const [name, setName] = useState('');
    const [color, setColor] = useState('');

    const backGrColor = {
        green: { backgroundColor: '#56E453' },
        blue: { backgroundColor: '#5396E4' },
        purple: { backgroundColor: '#9161F6' },
        orange: { backgroundColor: '#F58E54' }
    };

    const { green, blue, purple, orange } = backGrColor;

    const signInUser = () => {
        signInAnonymously(auth)
            .then(result => {
                navigation.navigate('Chat', {userID: result.user.uid,
                    name: name,
                    color: color
                });
                Alert.alert('Signed in Successfully');
            })
            .catch((error) => {
                Alert.alert('Unable to sign in. Try again later');
            })
    }

    return (
        <ImageBackground
            source={require('../assets/background-image.png')}
            resizeMode= 'cover'
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <View style={styles.box}>
                    <Text style={styles.title}>Chat App</Text>
                        <TextInput 
                        style={styles.textInput}
                        value={name}
                        onChangeText={setName}
                        placeholder='Your name'
                    />
                    <View style={styles.colorSelect}>
                        <Text style={styles.colorSelectText}>Choose Background Color</Text>
                        <View style={styles.colorCircleWrapper}>
                            <TouchableOpacity 
                                style={[styles.colorCircle, { backgroundColor: 'green'} ]}
                                onPress={() => setColor('#56E453')}
                            ></TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.colorCircle, blue]}
                                onPress={() => setColor('#5396E4')}
                            ></TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.colorCircle, purple]}
                                onPress={() => setColor('#9161F6')}
                            ></TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.colorCircle, orange]}
                                onPress={() => setColor('#F58E54')}
                            ></TouchableOpacity>
                        </View>
                    </View>
                    
                    <TouchableOpacity
                        style={styles.button}
                        onPress={signInUser}
                    >
                        <Text style={styles.buttonText}>Start Chatting</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    box: {
        width: '88%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    textInput: {
        width: '88%',
        padding: 15,
        borderWidth: 1,
        marginTop: 15,
        marginBottom: 15
    },
    backgroundImage: {
        flex: 1,
    },
    title: {
        fontWeight: '600',
        fontSize: 45,
    },
    colorSelect: {
        width: "100%",
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 16,
        borderWidth: 1,
        padding: 5,
    },
    colorSelectText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#757083',
        opacity: 100,
        marginBottom: 10
    },
    
    colorCircleWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: "88%"
    },
    colorCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        margin: 2,
        marginHorizontal: 13

    },
    colorCircleSelected: {
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: 'brown'
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        padding: 10,
        width: '88%',
        height: 56,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 600
    }
});

export default Start;