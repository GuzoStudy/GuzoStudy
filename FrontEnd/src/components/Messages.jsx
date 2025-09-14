import React, { useState } from 'react';
import { messagesData } from '../data/teacherData';

const Messages = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [activeTab, setActiveTab] = useState('inbox');

  const conversations = [
    {
      id: 1,
      student: 'Emily Chen',
      course: 'JavaScript Basics',
      lastMessage: 'Hi Professor, I have a question about async/await functions...',
      time: '10 min ago',
      unread: true,
      avatar: 'EC'
    },
    {
      id: 2,
      student: 'Michael Rodriguez',
      course: 'React Advanced',
      lastMessage: 'Thank you for the detailed explanation in today\'s class!',
      time: '2 hours ago',
      unread: true,
      avatar: 'MR'
    },
    {
      id: 3,
      student: 'Sarah Williams',
      course: 'Python Basics',
      lastMessage: 'Could you please review my assignment submission?',
      time: '5 hours ago',
      unread: false,
      avatar: 'SW'
    },
    {
      id: 4,
      student: 'David Kim',
      course: 'Web Design',
      lastMessage: 'The portfolio project looks great! Any feedback?',
      time: '1 day ago',
      unread: false,
      avatar: 'DK'
    },
    {
      id: 5,
      student: 'Lisa Johnson',
      course: 'Node.js Backend',
      lastMessage: 'When is the next live session scheduled?',
      time: '2 days ago',
      unread: false,
      avatar: 'LJ'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Messages</h1>
        <button
          onClick={() => setShowCompose(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Compose Message
        </button>
      </div>


      {/* Main Messages Interface */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex">
        {/* Sidebar - Conversation List */}
        <div className="w-1/3 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('inbox')}
                className={`text-sm font-medium ${activeTab === 'inbox' ? 'text-blue-600' : 'text-gray-500'}`}
              >
                Inbox (5)
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`text-sm font-medium ${activeTab === 'sent' ? 'text-blue-600' : 'text-gray-500'}`}
              >
                Sent
              </button>
            </div>
          </div>
          <div className="overflow-y-auto h-full">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedMessage(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedMessage?.id === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                } ${conversation.unread ? 'bg-blue-25' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">{conversation.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className={`text-sm font-medium ${conversation.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                        {conversation.student}
                      </p>
                      <span className="text-xs text-gray-500">{conversation.time}</span>
                    </div>
                    <p className="text-xs text-blue-600 mb-1">{conversation.course}</p>
                    <p className={`text-sm truncate ${conversation.unread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unread && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Message View */}
        <div className="flex-1 flex flex-col">
          {selectedMessage ? (
            <>
              {/* Message Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">{selectedMessage.avatar}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedMessage.student}</h3>
                      <p className="text-sm text-blue-600">{selectedMessage.course}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                        <p className="text-sm text-gray-800">{selectedMessage.lastMessage}</p>
                        <p className="text-xs text-gray-500 mt-1">{selectedMessage.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reply Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-500">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Message Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Compose Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">To</label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                  <option>Select a student...</option>
                  <option>Emily Chen</option>
                  <option>Michael Rodriguez</option>
                  <option>Sarah Williams</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" rows={4}></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;