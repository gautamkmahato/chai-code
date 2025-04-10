// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';

// export default function Chat() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const chatContainerRef = useRef(null);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const newMessage = { text: input, sender: 'user' };
//     setMessages((prevMessages) => [...prevMessages, newMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       const response = await axios.post('/api/hitesh', { message: input });
//       const botMessage = { text: response.data.result, sender: 'bot' };
//       setMessages((prevMessages) => [...prevMessages, botMessage]);
//     } catch (error) {
//       console.error('Error sending message:', error);
//       const errorMessage = { text: 'Sorry, I encountered an error.', sender: 'bot' };
//       setMessages((prevMessages) => [...prevMessages, errorMessage]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <div className="flex flex-col h-screen bg-gray-100 px-64 py-4">
//       <div
//         ref={chatContainerRef}
//         className="flex-1 overflow-y-auto p-4 space-y-4 bg-white rounded-lg shadow-lg"
//       >
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//           >
//             <div
//               className={`max-w-xs rounded-lg p-3 ${
//                 message.sender === 'user'
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-gray-200 text-gray-800'
//               }`}
//             >
//               {message.text}
//             </div>
//           </div>
//         ))}
//         {loading && (
//           <div className="flex justify-start">
//             <div className="max-w-xs rounded-lg p-3 bg-gray-200 text-gray-800">
//               ...
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="p-4 border-t flex space-x-2">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//           className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="Type a message..."
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-500 text-white p-3 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }