 function ParticipantsPanel() {
    const participants = [
      { id: 1, name: 'Casey Johnson', role: 'Instructor', status: 'speaking', avatar: '👩‍🏫' },
      { id: 2, name: 'John Smith', role: 'Student', status: 'muted', avatar: '👨‍🎓' },
      { id: 3, name: 'Sarah Wilson', role: 'Student', status: 'online', avatar: '👩‍🎓' },
      { id: 4, name: 'Mike Chen', role: 'Student', status: 'hand-raised', avatar: '👨‍🎓' },
      { id: 5, name: 'You', role: 'Student', status: 'online', avatar: '👤' }
    ];
  
    const getStatusColor = (status) => {
      switch (status) {
        case 'speaking': return 'bg-green-500';
        case 'muted': return 'bg-red-500';
        case 'hand-raised': return 'bg-yellow-500';
        default: return 'bg-gray-400';
      }
    };
  
    const getStatusText = (status) => {
      switch (status) {
        case 'speaking': return 'Speaking';
        case 'muted': return 'Muted';
        case 'hand-raised': return 'Hand Raised';
        default: return 'Online';
      }
    };
  
    return (
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Participants ({participants.length})</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {participants.map((participant) => (
            <div key={participant.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                  {participant.avatar}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-800">{participant.name}</h4>
                    {participant.role === 'Instructor' && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Host
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(participant.status)}`}></div>
                    <span className="text-xs text-gray-500">{getStatusText(participant.status)}</span>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <button className="p-1 text-gray-400 hover:text-gray-600" title="Mute">
                    🎤
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600" title="Video">
                    📷
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  export default ParticipantsPanel