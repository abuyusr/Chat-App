import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";

const Chat = ({ db, route, navigation, isConnected }) => {
  const { name, color, userID } = route.params;
  const [messages, setMessages] = useState([]);

  let unsubMessages;

  useEffect(() => {
    if (isConnected === true ) {
      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

    navigation.setOptions({ title: name });
    
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    unsubMessages = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach(doc => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis())
        })
      })
      cacheMessages(newMessages);
        setMessages(newMessages);
    })
  } else loadCachedMessages();
  //clean up code
  return () => {
    if (unsubMessages) unsubMessages();
  }
 }, [isConnected]);
 const loadCachedMessages = async () => {
  const cachedMessages = await AsyncStorage.getItem('messages') || [];
  setMessages(JSON.parse(cachedMessages));
}

 const cacheMessages = async (messagesToCache) => {
  try {
    await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
  } catch (error) {
    console.error(error.message);
  }
}
 const onSend = async (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
  }

  const renderInputToolbar = (props) => {
    if (isConnected === true) return <InputToolbar {...props} />;
    else return null;
  }
  
  const renderBubble = (props) => {
    return <Bubble
    {...props}
    wrapperStyle={{
      right: {
        backgroundColor: '#000'
      },
      left: {
        backgroundColor: '#fff'
      }
    }}
  />
}
useEffect(() => {
  navigation.setOptions({ title: name });
}, []);

return (
<View style={{flex: 1, backgroundColor: color}}>

<GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID, 
          name: name,
        }}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
 });
 export default Chat;


