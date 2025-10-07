import React, { useState, useEffect } from "react";
import axios from "axios";

const Messages = ({ courseId }) => {
  const [discussions, setDiscussions] = useState([]); // list of discussions
  const [selectedDiscussion, setSelectedDiscussion] = useState(null); // active chat
  const [showCompose, setShowCompose] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [composeData, setComposeData] = useState({ subject: "", message: "" });

  // 🔹 Fetch discussions for this course
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const res = await axios.get(`/api/discussions/${courseId}`, {
          withCredentials: true, // if using cookies
        });
        setDiscussions(res.data);
      } catch (err) {
        console.error("Error fetching discussions:", err);
      }
    };

    if (courseId) fetchDiscussions();
  }, [courseId]);

  // 🔹 Select a discussion
  const handleSelectDiscussion = (discussion) => {
    setSelectedDiscussion(discussion);
  };

  // 🔹 Post a reply to a discussion
  const handleSendReply = async () => {
    if (!newReply.trim() || !selectedDiscussion) return;

    try {
      const res = await axios.post(
        `/api/discussions/${selectedDiscussion._id}/reply`,
        { text: newReply },
        { withCredentials: true }
      );

      // Update local state (add new reply)
      setSelectedDiscussion((prev) => ({
        ...prev,
        replies: [...(prev.replies || []), res.data],
      }));
      setNewReply("");
    } catch (err) {
      console.error("Error posting reply:", err);
    }
  };

  // 🔹 Create a new discussion
  const handleComposeSubmit = async (e) => {
    e.preventDefault();
    if (!composeData.subject.trim() || !composeData.message.trim()) return;

    try {
      const res = await axios.post(
        `/api/discussions/${courseId}`,
        {
          subject: composeData.subject,
          text: composeData.message,
        },
        { withCredentials: true }
      );

      setDiscussions([res.data, ...discussions]); // add new discussion to list
      setComposeData({ subject: "", message: "" });
      setShowCompose(false);
    } catch (err) {
      console.error("Error creating discussion:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Messages</h1>
        <button
          onClick={() => setShowCompose(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Compose Message
        </button>
      </div>

      {/* Main container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex">
        {/* Sidebar - Discussions */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
          {discussions.length === 0 ? (
            <div className="p-4 text-gray-500">No chats yet</div>
          ) : (
            discussions.map((d) => (
              <div
                key={d._id}
                onClick={() => handleSelectDiscussion(d)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedDiscussion?._id === d._id
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : ""
                }`}
              >
                <p className="font-medium text-gray-900 truncate">{d.subject}</p>
                <p className="text-sm text-gray-600 truncate">
                  {d.replies?.[d.replies.length - 1]?.text ||
                    d.text ||
                    "No replies yet"}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Main Content - Selected Discussion */}
        <div className="flex-1 flex flex-col">
          {selectedDiscussion ? (
            <>
              {/* Discussion Header */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">
                  {selectedDiscussion.subject}
                </h3>
                <p className="text-sm text-gray-500">{selectedDiscussion.text}</p>
              </div>

              {/* Replies */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {(selectedDiscussion.replies || []).map((reply, idx) => (
                  <div key={idx} className="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-gray-800">{reply.text}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(reply.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Reply Input */}
              <div className="p-4 border-t border-gray-200 flex space-x-3">
                <input
                  type="text"
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendReply}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Send
                </button>
              </div>
            </>
          ) : discussions.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">No chats yet</p>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Select a discussion to view messages</p>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              New Discussion
            </h3>
            <form onSubmit={handleComposeSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  value={composeData.subject}
                  onChange={(e) =>
                    setComposeData({ ...composeData, subject: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  value={composeData.message}
                  onChange={(e) =>
                    setComposeData({ ...composeData, message: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={4}
                />
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Create
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
