import { useState } from 'react';
import Header from "../components/Header";
import LeftNav from "../components/LeftNav";
import VideoStage from "../components/VideoStage";
import RightPanel from "../components/RightPanel";

function LiveClassPage() {
  const [activePanel, setActivePanel] = useState('chat');

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation */}
        <LeftNav activePanel={activePanel} onPanelChange={setActivePanel} />

        {/* Video Stage */}
        <VideoStage />

        {/* Right Panel */}
        <RightPanel activePanel={activePanel} />
      </div>
    </div>
  );
}

export default LiveClassPage;