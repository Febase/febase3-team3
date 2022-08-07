import React from 'react';
import logo from './logo.svg';
import './App.css';
import Cursor from './Cursor/Cursor';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Febase3 Team3 Hello World!</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Cursor>
          <div
            style={{
              padding: '8px 20px',
              margin: '16px',
              backgroundColor: '#919921',
            }}
          >
            target
          </div>
        </Cursor>
      </header>
    </div>
  );
}

export default App;
