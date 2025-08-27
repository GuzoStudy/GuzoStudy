// import ChatPanel from './ChatPanel';
// import ParticipantsPanel from './ParticipantsPanel';

import ChatPanel from './ChatPanel'
import ParticipantsPanel from './PartcipantsPanel';
 function RightPanel({ activePanel }) {
  const renderPanel = () => {
    switch (activePanel) {
      case 'chat':
        return <ChatPanel />;
      case 'participants':
        return <ParticipantsPanel />;
      default:
        return <ChatPanel />;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        <button 
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activePanel === 'chat' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          Messages (4)
        </button>
        <button 
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activePanel === 'participants' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          Participants
        </button>
      </div>
      
      {renderPanel()}
    </div>
  );
}

export default RightPanel;