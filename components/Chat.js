import { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";

// onSnapshot implements real time communication by acting as a listener

const Chat = ({route, navigation, db}) => {
    const { name, color, userID} = route.params;
    const [messages, setMessages] = useState([]);
    // state's setter function accepts a call back function with parameter refering to last set value of the state (previousMessages)
    const onSend = (newMessages) => {
      addDoc(collection(db, "messages"), newMessages[0])
    }

    useEffect(() => {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newMessages = [];
        querySnapshot.forEach((doc) => {
        const newMessage = doc.data();
        newMessage.createdAt = new Date(newMessage.createdAt.toMillis());
        newMessages.push(newMessage);
        });
        setMessages(newMessages);
      })
      return () => {
        unsubscribe();
      }
    }, []);

    useEffect(() => {
      navigation.setOptions({ title: name });
    }, []);
  
  const renderBubble = (props) => {
    return <Bubble
      {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000"
          },
          left: {
            backgroundColor: "#FFF"
          }
        }}
      />
  }
    
return (
 <View style={[styles.container, { backgroundColor: color }]}>
   <GiftedChat
    messages={messages}
    renderBubble={renderBubble}
    onSend={messages => onSend(messages)}
    user={{
      _id: userID,
      name: name
    }}
  />


  { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
 </View>
);
}
const styles = StyleSheet.create({
container: {
 flex: 1
}
});
export default Chat;