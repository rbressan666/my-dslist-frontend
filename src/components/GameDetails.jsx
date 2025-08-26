import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function GameDetails() {
  const { id } = useParams(); // Pega o 'id' da URL (ex: /games/3)
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        // Substitua pela URL do seu backend no Render quando for para produção
        const response = await axios.get(`http://localhost:8080/games/${id}` );
        setGame(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]); // O useEffect será executado novamente se o 'id' mudar

  if (loading) {
    return <div>Carregando detalhes do jogo...</div>;
  }

  if (error) {
    return <div>Erro ao carregar detalhes: {error.message}</div>;
  }

  if (!game) {
    return <div>Jogo não encontrado.</div>;
  }

  return (
    <div>
      <h1>{game.title}</h1>
      <img src={game.imgUrl} alt={game.title} width="500" />
      <p><strong>Ano:</strong> {game.year}</p>
      <p><strong>Gênero:</strong> {game.genre}</p>
      <p><strong>Plataformas:</strong> {game.platforms}</p>
      <h2>Descrição</h2>
      <p>{game.longDescription}</p>
    </div>
  );
}

export default GameDetails;
