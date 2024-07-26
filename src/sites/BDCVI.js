import React from 'react';
import TournamentEvent from '../components/TournamentEvent';

const BDCVI = () => {
    const tournamentEvents = [
        {
          title: "Sealed Deck Competition",
          description: "Build a deck from a sealed pool of cards and compete against other players.",
          requiredEquipment: ["6 Booster Packs", "Basic Lands", "Deck Registration Sheet"]
        },
        {
          title: "Commander Free-for-All",
          description: "Bring your best Commander deck for a multiplayer showdown!",
          requiredEquipment: ["100-card Commander Deck", "Playmat", "Dice or Counters"]
        },
        // Add more events as needed
      ];
    
      return (
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">Summer Magic Tournament</h1>
          <p className="mb-8">Welcome to our annual Summer Magic Tournament! Below you'll find the list of events and their details.</p>
          
          {tournamentEvents.map((event, index) => (
            <TournamentEvent 
              key={index}
              title={event.title}
              description={event.description}
              requiredEquipment={event.requiredEquipment}
            />
          ))}
        </div>
      );
    };

export default BDCVI;