import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import { useSelector } from 'react-redux';

const ChatWindow = () => {
  const authState = useSelector((state) => state.authReducer);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChat, setActiveChat] = useState('team');
  const [messages, setMessages] = useState({
    team: [{ sender: 'Alice', text: 'Hello team!' }, { sender: 'Bob', text: 'Hi Alice!' }],
  });
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [fetchUsers, { data: userData }] = useFetch();
  const [sendMessage] = useFetch();
  const [fetchMessages] = useFetch();

  const messageEndRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  // Fetch users on mount
  useEffect(() => {
    console.log('Fetching users...');
    fetchUsers({
      method: 'GET',
      url: '/user/users',
      headers: { Authorization: authState.token },
    }).catch(() => {});
  }, [fetchUsers, authState.token]);

  const users = userData || [];

  // Fetch messages when chat selected
  const handleSelectChat = async (chatId) => {
    setActiveChat(chatId);
    if (chatId === 'team') return;

    try {
      // console.log(`🚀 Fetching messages with user ID: ${chatId}`);
      const response = await fetchMessages({
        method: 'GET',
        url: `/chat/user/${chatId}`,
        headers: { Authorization: authState.token },
      });

      console.log('✅ Messages fetched successfully:', response);
      const fetchedMessages = (response || []).map((msg) => ({
        sender: msg.sender?.name || 'Unknown',
        receiver: msg.receiver?.name || 'Unknown',
        text: msg.text,
      }));
      setMessages((prevMessages) => ({
        ...prevMessages,
        [chatId]: fetchedMessages,
      }));
    } catch (error) {
      console.error('❌ Error fetching messages for user:', chatId, error);
    }
  };
  

  // Handle sending message
  const handleSend = async () => {
    if (!input.trim()) return;

    const chatType = activeChat === 'team' ? 'team' : 'user';
    const receiverId = chatType === 'user' ? activeChat : null;

    const newMsg = { sender: authState.user.name, text: input };

    console.log('Sending message:', { text: input, chatType, receiverId });

    try {
      await sendMessage({
        method: 'POST',
        headers: { Authorization: authState.token },
        url: '/chat/send',
        data: { text: input, chatType, receiverId },
      });

      // console.log('✅ Message sent successfully.');

      setMessages((prevMessages) => ({
        ...prevMessages,
        [activeChat]: [...(prevMessages[activeChat] || []), newMsg],
      }));

      setInput('');
    } catch (error) {
      console.error('❌ Error sending message:', error);
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Floating Chat Icon */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-6 h-[600px] w-full max-w-5xl border rounded-2xl shadow-lg overflow-hidden bg-white">
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-900 text-white p-4 flex flex-col">
              <h2 className="text-xl font-semibold mb-4">Chats</h2>
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 mb-4 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-300"
              />
              {/* Team Chat */}
              <div
                onClick={() => handleSelectChat('team')}
                className={`p-2 rounded-lg cursor-pointer mb-2 ${
                  activeChat === 'team' ? 'bg-gray-700' : 'hover:bg-gray-800'
                }`}
              >
                🧑‍🤝‍🧑 Team Chat
              </div>
              <hr className="my-2 border-gray-700" />
              {/* User List */}
              <div className="overflow-y-auto flex-1">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => handleSelectChat(user._id)}
                      className={`p-2 rounded-lg cursor-pointer mb-2 ${
                        activeChat === user._id ? 'bg-gray-700' : 'hover:bg-gray-800'
                      }`}
                    >
                      👤 {user.name}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No users found.</p>
                )}
              </div>
            </div>

            {/* Chat Window */}
            <div className="w-3/4 flex flex-col bg-white">
              {/* Header */}
              <div className="bg-gray-100 p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {activeChat === 'team'
                    ? '🧑‍🤝‍🧑 Team Chat'
                    : `👤 Chat with ${users.find((u) => u._id === activeChat)?.name || 'User'}`}
                </h2>
                <button onClick={() => setIsChatOpen(false)} className="text-gray-500 hover:text-gray-800">
                ❌
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {(messages[activeChat] || []).map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg max-w-xs ${
                      msg.sender === authState.user.name
                        ? 'bg-blue-500 text-white self-end ml-auto'
                        : 'bg-gray-200 self-start'
                    }`}
                  >
                    <p className="text-lg">
                      {msg.sender !== authState.user.name && <strong>{msg.sender}: </strong>}
                      {msg.text}
                    </p>
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>

              {/* Input Section */}
              <div className="p-4 border-t bg-gray-50 flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
                />
                <button
                  onClick={handleSend}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWindow;
