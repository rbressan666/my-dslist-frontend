import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameList from './components/GameList';
import GameDetails from './components/GameDetails'; // Vamos criar este componente em breve
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GameList />} />
          <Route path="/games/:id" element={<GameDetails />} />
          {/* Adicione outras rotas aqui conforme necessário */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
