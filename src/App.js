import React, { useState } from 'react';
import HomePage from './components/HomePage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      {/* Hanya tampilkan HomePage */}
      <div className={`page-container ${currentPage === 'home' ? 'visible' : 'hidden'}`}>
        <HomePage onWidgetClick={() => navigateTo('form')} />
      </div>
    </div>
  );
}

export default App;
