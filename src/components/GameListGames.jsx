import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './GameListGames.css';

// Componente de Item Arrastável (separado para clareza)
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

  // Adicionamos um pequeno atraso para diferenciar clique de arrasto
  // Se o mouse se mover muito ou por muito tempo, é um arrasto, senão é um clique.
  const [isDragging, setIsDragging] = useState(false);
  const [clickTimeout, setClickTimeout] = useState(null);

  const handleMouseDown = (e) => {
    // Inicia um timer para verificar se é um clique ou arrasto
    setClickTimeout(setTimeout(() => {
      setIsDragging(true);
    }, 150)); // 150ms de atraso para considerar arrasto
  };

  const handleMouseUp = (e) => {
    clearTimeout(clickTimeout);
    if (!isDragging) {
      // Se não estava arrastando, é um clique
      onClick(game.id);
    }
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    clearTimeout(clickTimeout);
    setIsDragging(false);
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes} // Atributos de acessibilidade e ARIA
      {...listeners} // Listeners para o drag handle (mousedown, mouseup, etc.)
      className="game-li"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
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
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/lists/${listId}/games`);
        setGames(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGamesByList();
  }, [listId]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = games.findIndex((game) => game.id === active.id);
      const newIndex = games.findIndex((game) => game.id === over.id);

      const newOrder = arrayMove(games, oldIndex, newIndex);
      setGames(newOrder);

      try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/lists/${listId}/replacement`, {
          sourceIndex: oldIndex,
          destinationIndex: newIndex
        });
      } catch (err) {
        console.error("Erro ao atualizar a ordem no backend:", err);
        setGames(games); // Reverte a mudança no frontend se a API falhar
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

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <ul className="games-ul">
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
