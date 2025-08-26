import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// 1. Importe do dnd-kit
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './GameListGames.css';

// 2. Componente de Item Arrastável (separado para clareza)
function SortableGameItem({ game, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: game.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners} // listeners para o drag handle
      className="game-li"
      onClick={() => onClick(game.id)} // Mantém o clique para detalhes
    >
      <img src={game.imgUrl} alt={game.title} className="game-img" />
      <div className="game-info">
        <h3>{game.title}</h3>
        <p>{game.shortDescription}</p>
      </div>
    </li>
  );
}

// Componente principal
function GameListGames() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGamesByList = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/lists/${listId}/games` );
        setGames(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGamesByList();
  }, [listId]);

  // 3. Função para lidar com o final do arrastar (lógica do dnd-kit)
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = games.findIndex((game) => game.id === active.id);
      const newIndex = games.findIndex((game) => game.id === over.id);

      // Atualiza o estado local para o frontend refletir a mudança imediatamente
      const newOrder = arrayMove(games, oldIndex, newIndex);
      setGames(newOrder);

      // Chama a API do backend para salvar a nova ordem
      try {
        await axios.post(`http://localhost:8080/lists/${listId}/replacement`, {
          sourceIndex: oldIndex,
          destinationIndex: newIndex
        } );
      } catch (err) {
        console.error("Erro ao atualizar a ordem no backend:", err);
        // Opcional: reverter a mudança se a API falhar
        setGames(games);
      }
    }
  };

  const handleGameClick = (gameId) => {
    navigate(`/games/${gameId}`);
  };

  if (loading) return <div>Carregando jogos da lista...</div>;
  if (error) return <div>Erro ao carregar jogos: {error.message}</div>;
  if (games.length === 0) return <div>Nenhum jogo encontrado para esta lista.</div>;

  return (
    <div className="game-list-container">
      <h1>Jogos da Lista (Arraste para reordenar)</h1>
      <button onClick={() => navigate('/')}>Voltar para Listas</button>

      {/* 4. Envolve a lista com o DndContext */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <ul className="games-ul">
          {/* 5. Envolve os itens com o SortableContext */}
          <SortableContext items={games} strategy={verticalListSortingStrategy}>
            {games.map(game => (
              <SortableGameItem key={game.id} game={game} onClick={handleGameClick} />
            ))}
          </SortableContext>
        </ul>
      </DndContext>
    </div>
  );
}

export default GameListGames;
