import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameList from './components/GameList';
import GameDetails from './components/GameDetails';
import GameListGames from './components/GameListGames'; // 1. Importe o novo componente
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GameList />} />
          <Route path="/lists/:listId/games" element={<GameListGames />} /> {/* 2. Adicione a nova rota */}
          <Route path="/games/:id" element={<GameDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
