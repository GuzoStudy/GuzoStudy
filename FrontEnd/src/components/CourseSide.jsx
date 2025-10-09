import React from 'react';
import { Plus, Upload, Move, Eye, Trash2 } from 'lucide-react';

const CourseSide = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'basic', name: 'Basic Info', icon: 'M12 4v16m8-8H4' }, // Placeholder icon
    { id: 'media', name: 'Media', icon: 'M3 7h18M3 12h18M3 17h18' },
    { id: 'curriculum', name: 'Curriculum', icon: 'M12 6v12m6-6H6' },
    { id: 'assessments', name: 'Assessments', icon: 'M5 13l4 4L19 7' },
    { id: 'pricing', name: 'Pricing', icon: 'M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z' },
    { id: 'settings', name: 'Settings', icon: 'M12 8c1.104 0 2 .896 2 2s-.896 2-2 2-2-.896-2-2 .896-2 2-2z' },
  ];

  return (
    <aside className="bg-white shadow-sm w-64 hidden md:block border-r border-gray-200">
      <div className="p-6">
        <nav className="mt-4">
          <ul className="space-y-1">
            {tabs.map(tab => (
              <li key={tab.id}>
                <button
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={tab.icon}
                      />
                    </svg>
                    {tab.name}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default CourseSide;
