import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { addDoc, doc, onSnapshot, orderBy, query, collection } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';


const Chat = ({ db, route, navigation, isConnected, storage }) => {
    const { name, color, userID } = route.params;
    const [messages, setMessages] = useState([]);
    let unsubChat;
    const onSend = (newMessages) => {
        addDoc(collection(db, 'messages'), newMessages[0]);
    }
    const renderBubble = (props) => {
        return <Bubble 
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor:'#000'
                },
                left: {
                    backgroundColor:'#fff'
                }
            }}
        />
    }

    useEffect(() => {
        navigation.setOptions({ title: name });
        let unsubChat;
        if (isConnected === true) {
            //unregister current onSnapshot() listener to avoid registering multiple listeners when useEffect code is reexecuted
            if (unsubChat) unsubChat();
            unsubChat = null;

            const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
            unsubChat = onSnapshot(q, (documentsSnapshot) => {
                let newMessagesList = [];
                documentsSnapshot.forEach(doc => {
                    newMessagesList.push({ 
                        id: doc.id, 
                        ...doc.data(),
                        createdAt: new Date(doc.data().createdAt.toMillis()),
                    });
                });
                cacheMessages(newMessagesList);
                setMessages(newMessagesList);
            });
        } else loadCachedMessages();

        //Clean up code
        return () => {
            if (unsubChat) unsubChat();
        }
    }, [isConnected]);

    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
    };

    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem('messages') || [];
        setMessages(JSON.parce(cachedMessages));
    };

    const renderInputToolBar = (props) => {
        if (isConnected) {
            return <InputToolbar {...props} />;
        } else {
            return null;
        } 
    };

    const renderCustomActions = (props) => {
        return <CustomActions storage={storage} {...props} />
    };

    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView 
                    style={{width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3}}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    };

    return (
        <View style={[{ backgroundColor: color }, styles.container]}>
            <GiftedChat 
                style={styles.textBox}
                messages={messages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolBar}
                onSend={messages => onSend(messages)}
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView}
                user={{
                    _id: userID, name
                }}
            />
            { Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 600
    },
    textBox: {
        flex: 1
    }
});

export default Chat;