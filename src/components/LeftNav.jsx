function LeftNav({ activePanel, onPanelChange }) {
  const navItems = [
   
    { id: 'participants', icon: '👥', title: 'Participants' },
    { id: 'chat', icon: '💬', title: 'Messages' },
  
  ];

  return (
    <aside className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-6 gap-6">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onPanelChange(item.id)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all ${
            activePanel === item.id 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
          title={item.title}
        >
          {item.icon}
        </button>
      ))}
      
      <div className="mt-auto">
       
      </div>
    </aside>
  );
}

export default LeftNav