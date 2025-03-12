import React, { useState } from 'react';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');

    const sendMessage = async () => {
        if (userInput.trim() === '') return;

        const userMessage = { sender: 'user-cb', text: userInput };
        setMessages([...messages, userMessage]);
        setUserInput('');

        try {
            const response = await fetch('http://localhost:8000/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: userInput }),
            });

            const data = await response.json();
            const botMessage = { sender: 'bot-cb', text: data.answer };
            setMessages(prevMessages => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error fetching bot response:', error);
        }
    };

    return (
        <div className="fixed bottom-12 right-8 z-50">
            <div className="bg-white rounded-lg shadow-lg w-72 h-96 p-5 flex flex-col scrollbar-hide">
                <div className="flex-grow flex flex-col overflow-y-auto scrollbar-hide">
                {messages.map((msg, index) => (
                    <div
                    key={index}
                    className={`mb-2 p-2 rounded-lg max-w-[70%] ${
                        msg.sender === 'user' ? 'bg-cyan-100 self-end' : 'bg-gray-200 self-start'
                    }`}
                    >
                    {msg.text}
                    </div>
                ))}
                </div>
                <div className="flex items-center mt-2">
                <input
                    type="text"
                    className="flex-grow p-2 rounded-l-lg bg-gray-100 outline-none"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button className="p-2 rounded-r-lg bg-blue-500 text-white" onClick={sendMessage}>
                    Send
                </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
