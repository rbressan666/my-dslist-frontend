import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importe useNavigate

function GameList() {
  const [gameLists, setGameLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Inicialize useNavigate

  useEffect(() => {
    const fetchGameLists = async () => {
      try {
        const response = await axios.get('http://localhost:8080/lists' );
        setGameLists(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGameLists();
  }, []);

  const handleListClick = (listId) => {
    // Redireciona para a rota de jogos de uma lista específica
    // Por enquanto, vamos apenas para a lista de jogos, sem o detalhe do jogo individual
    // O professor deve ter um endpoint para /lists/{listId}/games
    navigate(`/lists/${listId}/games`); // Esta rota ainda não está definida no App.jsx, vamos ajustar isso em breve
  };

  if (loading) {
    return <div>Carregando listas de jogos...</div>;
  }

  if (error) {
    return <div>Erro ao carregar listas: {error.message}</div>;
  }

  return (
    <div>
      <h1>Listas de Jogos</h1>
      <ul>
        {gameLists.map(list => (
          <li key={list.id} onClick={() => handleListClick(list.id)} style={{ cursor: 'pointer' }}>
            <h2>{list.name}</h2>
            {/* Aqui você pode adicionar um link para a página de detalhes da lista */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GameList;
