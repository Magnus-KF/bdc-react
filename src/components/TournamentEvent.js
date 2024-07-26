import React, { useState, useEffect } from 'react';
import { db, getEventParticipations, updateParticipation, deleteParticipation } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const TournamentEvent = ({ eventId, name, description, requiredEquipment, onParticipationChange }) => {
  const [competitors, setCompetitors] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState('');
  const [position, setPosition] = useState('');
  const [editingParticipation, setEditingParticipation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const competitorsSnapshot = await getDocs(collection(db, "competitors"));
        setCompetitors(competitorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const eventParticipations = await getEventParticipations(eventId);
        setParticipations(eventParticipations);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [eventId]);

  const addResult = async () => {
    if (selectedCompetitor && position) {
      try {
        await updateParticipation(eventId, selectedCompetitor, parseInt(position));
        const updatedParticipations = await getEventParticipations(eventId);
        setParticipations(updatedParticipations);
        setSelectedCompetitor('');
        setPosition('');
        if (onParticipationChange) {
          onParticipationChange();
        }
      } catch (err) {
        console.error("Error adding result:", err);
      }
    }
  };

  const handleEditParticipation = async () => {
    if (editingParticipation) {
      try {
        await updateParticipation(eventId, editingParticipation.competitorId, editingParticipation.position);
        const updatedParticipations = await getEventParticipations(eventId);
        setParticipations(updatedParticipations);
        setEditingParticipation(null);
        if (onParticipationChange) {
          onParticipationChange();
        }
      } catch (err) {
        console.error("Error updating participation:", err);
      }
    }
  };


  const handleDeleteParticipation = async (participationId) => {
    try {
      await deleteParticipation(participationId);
      const updatedParticipations = await getEventParticipations(eventId);
      setParticipations(updatedParticipations);
      if (onParticipationChange) {
        onParticipationChange();
      }
    } catch (err) {
      console.error("Error deleting participation:", err);
    }
  };

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
          <li key={participation.id} className="mtg-text flex items-center justify-between mb-2">
            {editingParticipation && editingParticipation.id === participation.id ? (
              <>
                <select 
                  value={editingParticipation.competitorId}
                  onChange={(e) => setEditingParticipation({...editingParticipation, competitorId: e.target.value})}
                  className="p-2 border border-mtg-secondary rounded mr-2"
                >
                  {competitors.map(competitor => (
                    <option key={competitor.id} value={competitor.id}>{competitor.name}</option>
                  ))}
                </select>
                <input 
                  type="number" 
                  value={editingParticipation.position}
                  onChange={(e) => setEditingParticipation({...editingParticipation, position: parseInt(e.target.value)})}
                  className="p-2 border border-mtg-secondary rounded mr-2"
                />
                <button onClick={handleEditParticipation} className="mtg-button mr-2">Save</button>
                <button onClick={() => setEditingParticipation(null)} className="mtg-button">Cancel</button>
              </>
            ) : (
              <>
                <span>Position {participation.position}: {competitors.find(c => c.id === participation.competitorId)?.name}</span>
                <div>
                  <button onClick={() => setEditingParticipation(participation)} className="mtg-button mr-2">Edit</button>
                  <button onClick={() => handleDeleteParticipation(participation.id)} className="mtg-button">Delete</button>
                </div>
              </>
            )}
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