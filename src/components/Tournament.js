import React, { useState, useEffect } from 'react';
import TournamentEvent from './TournamentEvent';
import { getTournamentEvents } from '../firebase';

const Tournament = ({ tournamentId, name }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const tournamentEvents = await getTournamentEvents(tournamentId);
      setEvents(tournamentEvents);
    };
    fetchEvents();
  }, [tournamentId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{name}</h1>
      {events.map(event => (
        <TournamentEvent 
          key={event.id}
          eventId={event.id}
          name={event.name}
          description={event.description || ""}
          requiredEquipment={event.requiredEquipment || []}
        />
      ))}
    </div>
  );
};

export default Tournament;