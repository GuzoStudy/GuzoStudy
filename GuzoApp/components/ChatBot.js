// import React, { useState, useRef, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import axios from "axios";
// import { OPENAI_API_KEY } from "@env";

// export default function ChatBot() {
//   const [showChatbot, setShowChatbot] = useState(false);
//   const [messages, setMessages] = useState([
//     { role: "bot", text: "Hey there 👋 How can I help you today?" },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const scrollRef = useRef();

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollToEnd({ animated: true });
//     }
//   }, [messages]);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage = { role: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const response = await axios.post(
//         "https://api.openai.com/v1/chat/completions",
//         {
//           model: "gpt-3.5-turbo",
//           messages: [...messages, userMessage],
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${OPENAI_API_KEY}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const botText =
//         response.data.choices?.[0]?.message?.content ||
//         "Sorry, something went wrong.";

//       setMessages((prev) => [...prev, { role: "bot", text: botText }]);
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [
//         ...prev,
//         { role: "bot", text: "API Error. Check console." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* Floating toggle button */}
//       <TouchableOpacity
//         style={styles.floatingButton}
//         onPress={() => setShowChatbot(!showChatbot)}>
//         <Text style={styles.floatingButtonText}>
//           {showChatbot ? "×" : "💬"}
//         </Text>
//       </TouchableOpacity>

//       {showChatbot && (
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : undefined}
//           style={styles.chatContainer}>
//           <View style={styles.chatBox}>
//             {/* Header */}
//             <View style={styles.chatHeader}>
//               <Text style={styles.headerText}>Chatbot</Text>
//               <TouchableOpacity onPress={() => setShowChatbot(false)}>
//                 <Text style={styles.headerText}>▼</Text>
//               </TouchableOpacity>
//             </View>

//             {/* Message list */}
//             <ScrollView
//               ref={scrollRef}
//               contentContainerStyle={styles.chatBody}
//               showsVerticalScrollIndicator={false}>
//               {messages.map((msg, idx) => (
//                 <View
//                   key={idx}
//                   style={[
//                     styles.messageWrapper,
//                     msg.role === "user"
//                       ? styles.messageUserAlign
//                       : styles.messageBotAlign,
//                   ]}>
//                   <View
//                     style={[
//                       styles.messageBubble,
//                       msg.role === "user"
//                         ? styles.userBubble
//                         : styles.botBubble,
//                     ]}>
//                     <Text
//                       style={
//                         msg.role === "user" ? styles.userText : styles.botText
//                       }>
//                       {msg.text}
//                     </Text>
//                   </View>
//                 </View>
//               ))}

//               {loading && (
//                 <View style={styles.messageBotAlign}>
//                   <View style={[styles.messageBubble, styles.botBubble]}>
//                     <Text style={styles.botText}>...</Text>
//                   </View>
//                 </View>
//               )}
//             </ScrollView>

//             {/* Footer input */}
//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Message..."
//                 value={input}
//                 onChangeText={setInput}
//                 multiline
//               />
//               <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
//                 <Text style={styles.sendButtonText}>➤</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </KeyboardAvoidingView>
//       )}
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   floatingButton: {
//     position: "absolute",
//     bottom: 32,
//     right: 32,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "#4F46E5", // Indigo-700
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//   },
//   floatingButtonText: {
//     color: "white",
//     fontSize: 24,
//   },
//   chatContainer: {
//     position: "absolute",
//     bottom: 96,
//     right: 16,
//     width: 360,
//     maxHeight: 500,
//     zIndex: 999,
//   },
//   chatBox: {
//     backgroundColor: "white",
//     borderRadius: 16,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     elevation: 10,
//     flex: 1,
//     overflow: "hidden",
//   },
//   chatHeader: {
//     backgroundColor: "#4F46E5",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 12,
//   },
//   headerText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   chatBody: {
//     padding: 12,
//     gap: 8,
//   },
//   messageWrapper: {
//     flexDirection: "row",
//     marginBottom: 4,
//   },
//   messageUserAlign: {
//     justifyContent: "flex-end",
//   },
//   messageBotAlign: {
//     justifyContent: "flex-start",
//   },
//   messageBubble: {
//     maxWidth: "70%",
//     borderRadius: 12,
//     padding: 10,
//   },
//   userBubble: {
//     backgroundColor: "#4F46E5",
//     borderTopRightRadius: 2,
//   },
//   botBubble: {
//     backgroundColor: "#F3F4F6",
//     borderTopLeftRadius: 2,
//   },
//   userText: {
//     color: "white",
//   },
//   botText: {
//     color: "#1F2937",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderTopWidth: 1,
//     borderTopColor: "#E5E7EB",
//     padding: 8,
//   },
//   input: {
//     flex: 1,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 12,
//     maxHeight: 100,
//   },
//   sendButton: {
//     marginLeft: 8,
//     backgroundColor: "#4F46E5",
//     borderRadius: 8,
//     padding: 10,
//   },
//   sendButtonText: {
//     color: "white",
//     fontSize: 16,
//   },
// });
