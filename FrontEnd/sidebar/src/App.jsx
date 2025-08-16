// App.js
import React from "react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./Sidebar"; // Adjust the path if needed

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
    </BrowserRouter>
  );
}

export default App;
