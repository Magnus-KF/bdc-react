import React, { useState, useEffect } from 'react';
import { db, addParticipation, getEventParticipations } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const TournamentEvent = ({ eventId, name, description, requiredEquipment }) => {
  const [competitors, setCompetitors] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState('');
  const [position, setPosition] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const competitorsSnapshot = await getDocs(collection(db, "competitors"));
        setCompetitors(competitorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        if (eventId) {
          const eventParticipations = await getEventParticipations(eventId);
          setParticipations(eventParticipations);
        } else {
          console.warn("No eventId provided to TournamentEvent component");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  const addResult = async () => {
    if (!eventId) {
      setError("Cannot add result: No event ID provided");
      return;
    }
    if (selectedCompetitor && position) {
      try {
        await addParticipation(eventId, selectedCompetitor, parseInt(position));
        const updatedParticipations = await getEventParticipations(eventId);
        setParticipations(updatedParticipations);
        setSelectedCompetitor('');
        setPosition('');
      } catch (err) {
        console.error("Error adding result:", err);
        setError("Failed to add result. Please try again.");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mtg-card mb-8">
      <h2 className="mtg-title">{name}</h2>
      <p className="mtg-description">{description}</p>
      
      <h3 className="text-lg font-bold mt-4 mb-2">Required Equipment:</h3>
      <ul className="list-disc list-inside mb-4">
        {requiredEquipment.map((item, index) => (
          <li key={index} className="mtg-text">{item}</li>
        ))}
      </ul>
      
      <h3 className="text-lg font-bold mt-4 mb-2">Results:</h3>
      <ul className="mb-4">
        {participations.sort((a, b) => a.position - b.position).map((participation) => (
          <li key={participation.id} className="mtg-text">
            Position {participation.position}: {competitors.find(c => c.id === participation.competitorId)?.name}
          </li>
        ))}
      </ul>
      
      <div className="flex mt-4">
        <select 
          value={selectedCompetitor}
          onChange={(e) => setSelectedCompetitor(e.target.value)}
          className="p-2 border border-mtg-secondary rounded mr-2"
        >
          <option value="">Select competitor</option>
          {competitors.map(competitor => (
            <option key={competitor.id} value={competitor.id}>{competitor.name}</option>
          ))}
        </select>
        <input 
          type="number" 
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Position"
          className="p-2 border border-mtg-secondary rounded mr-2"
        />
        <button onClick={addResult} className="mtg-button">Add Result</button>
      </div>
    </div>
  );
};

export default TournamentEvent;