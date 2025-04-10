'use client'


import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import hitesh from '../../public/hitesh.jpg'
import piyush from '../../public/piyush.jpg'

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAPI, setSelectedAPI] = useState(null); // 'hitesh' or 'piyush'
  const [chatId, setChatId] = useState(null); // Add chatId state
  const chatContainerRef = useRef(null);

  const handleSelectAPI = (api) => {
    setSelectedAPI(api);
    setMessages([]); // Clear previous chat
    setInput('');
    setChatId(crypto.randomUUID()); // Generate new chatId
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedAPI) return;

    const newMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');
    setLoading(true);

    try {
        const response = await axios.post(`/api/${selectedAPI}`, {
            message: input,
            chatId: chatId, // Include chatId in the request
        });
      const botMessage = { text: response.data.result, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { text: 'Sorry, I encountered an error.', sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen px-64 py-16 bg-gray-100">
      {/* Top Buttons */}
    <div className="mb-4 flex space-x-4">
        <button
            onClick={() => handleSelectAPI('hitesh')}
            className={`flex items-center px-4 py-2 rounded ${
                selectedAPI === 'hitesh' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'
            }`}
        >
            <Image src={hitesh} alt="Hitesh Icon" className="mr-2 w-12 h-12 rounded-full" /> {/* Replace with your icon URL */}
            Hitesh
        </button>
        <button
            onClick={() => handleSelectAPI('piyush')}
            className={`flex items-center px-4 rounded ${
                selectedAPI === 'piyush' ? 'bg-green-600 text-white' : 'bg-white text-green-600 border border-green-600'
            }`}
        >
            <Image src={piyush} alt="Piyush Icon" className="mr-2 w-12 h-12 rounded-full" /> {/* Replace with your icon URL */}
            Piyush
        </button>
    </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto border-none px-8 py-12 space-y-4 bg-white rounded-lg shadow-lg shadow-orange-100"
      >
        {!selectedAPI && (
          <div className="text-center text-gray-400">Please select a chat to begin.</div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {loading && selectedAPI && (
          <div className="flex justify-start">
            <div className="max-w-xs rounded-lg p-3 bg-gray-200 text-gray-800">
              ...
            </div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="p-4 border-t flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Type a message..."
          disabled={!selectedAPI}
        />
        <button
          onClick={sendMessage}
          className="bg-orange-500 text-white p-3 rounded-r-lg disabled:opacity-50"
          disabled={!selectedAPI}
        >
          Send
        </button>
      </div>
    </div>
  );
}


