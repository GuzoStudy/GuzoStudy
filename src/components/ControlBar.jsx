 function ControlBar() {
    return (
      <div className="bg-gray-100 border-t flex justify-center gap-6 py-3">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-full">🎤</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-full">📷</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-full">🖥️</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-full">✋</button>
        <button className="bg-red-600 text-white px-4 py-2 rounded-full">End</button>
      </div>
    );
  }

  export default ControlBar
  