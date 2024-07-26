import React, { useState, useEffect } from 'react';
import { db, addTournament, addTournamentEvent, addCompetitor } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

const AdminPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [events, setEvents] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [newTournament, setNewTournament] = useState({ name: '', description: '' });
  const [newEvent, setNewEvent] = useState({ tournamentId: '', name: '', description: '', requiredEquipment: '' });
  const [newCompetitor, setNewCompetitor] = useState('');
  const [editingTournament, setEditingTournament] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetchData();
    // getBDCVITournament();
  }, []);

  const fetchData = async () => {
    const tournamentsSnapshot = await getDocs(collection(db, "tournaments"));
    setTournaments(tournamentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    const eventsSnapshot = await getDocs(collection(db, "tournamentEvents"));
    setEvents(eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    const competitorsSnapshot = await getDocs(collection(db, "competitors"));
    setCompetitors(competitorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };
  // Putt i utils?
  const getBDCVITournament = async () => {
    const q = query(collection(db, "tournaments"), where("name", "==", "BDC666"));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const bdcviDoc = querySnapshot.docs[0];
      console.log(bdcviDoc.id, bdcviDoc.data());
      return { id: bdcviDoc.id, ...bdcviDoc.data() };
    }
    return null; // or handle the case where the tournament isn't found
  };
  
  const handleAddTournament = async () => {
    if (newTournament.name.trim()) {
      await addTournament(newTournament.name.trim(), newTournament.description.trim());
      setNewTournament({ name: '', description: '' });
      fetchData();
    }
  };

  const handleEditTournament = async () => {
    if (editingTournament) {
      await updateDoc(doc(db, "tournaments", editingTournament.id), {
        name: editingTournament.name,
        description: editingTournament.description
      });
      setEditingTournament(null);
      fetchData();
    }
  };

  const handleDeleteTournament = async (id) => {
    await deleteDoc(doc(db, "tournaments", id));
    fetchData();
  };

  const handleAddEvent = async () => {
    if (newEvent.tournamentId && newEvent.name.trim()) {
      await addTournamentEvent(
        newEvent.tournamentId,
        newEvent.name.trim(),
        newEvent.description.trim(),
        newEvent.requiredEquipment.split(',').map(item => item.trim())
      );
      setNewEvent({ tournamentId: '', name: '', description: '', requiredEquipment: '' });
      fetchData();
    }
  };

  const handleEditEvent = async () => {
    if (editingEvent) {
      const updatedEvent = {
        name: editingEvent.name,
        description: editingEvent.description,
        requiredEquipment: typeof editingEvent.requiredEquipment === 'string' ?
          editingEvent.requiredEquipment.split(',').map(item => item.trim()) :
          (Array.isArray(editingEvent.requiredEquipment) ? editingEvent.requiredEquipment : [])
      };
      await updateDoc(doc(db, "tournamentEvents", editingEvent.id), updatedEvent);
      setEditingEvent(null);
      fetchData();
    }
  };

  const handleDeleteEvent = async (id) => {
    await deleteDoc(doc(db, "tournamentEvents", id));
    fetchData();
  };

  const handleAddCompetitor = async () => {
    if (newCompetitor.trim()) {
      await addCompetitor(newCompetitor.trim());
      setNewCompetitor('');
      fetchData();
    }
  };

  const handleDeleteCompetitor = async (id) => {
    await deleteDoc(doc(db, "competitors", id));
    fetchData();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Page</h1>
      
      {/* Tournaments Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Tournaments</h2>
        <div className="mb-4">
          <input 
            type="text" 
            value={newTournament.name} 
            onChange={(e) => setNewTournament({...newTournament, name: e.target.value})}
            placeholder="Tournament name"
            className="p-2 border border-mtg-secondary rounded mr-2"
          />
          <input 
            type="text" 
            value={newTournament.description} 
            onChange={(e) => setNewTournament({...newTournament, description: e.target.value})}
            placeholder="Tournament description"
            className="p-2 border border-mtg-secondary rounded mr-2"
          />
          <button onClick={handleAddTournament} className="mtg-button">Add Tournament</button>
        </div>
        <ul>
          {tournaments.map(tournament => (
            <li key={tournament.id} className="mb-2">
              {editingTournament && editingTournament.id === tournament.id ? (
                <>
                  <input 
                    type="text" 
                    value={editingTournament.name} 
                    onChange={(e) => setEditingTournament({...editingTournament, name: e.target.value})}
                    className="p-2 border border-mtg-secondary rounded mr-2"
                  />
                  <input 
                    type="text" 
                    value={editingTournament.description} 
                    onChange={(e) => setEditingTournament({...editingTournament, description: e.target.value})}
                    className="p-2 border border-mtg-secondary rounded mr-2"
                  />
                  <button onClick={handleEditTournament} className="mtg-button mr-2">Save</button>
                  <button onClick={() => setEditingTournament(null)} className="mtg-button">Cancel</button>
                </>
              ) : (
                <>
                  <span className="mr-2">{tournament.name} - {tournament.description}</span>
                  <button onClick={() => setEditingTournament(tournament)} className="mtg-button mr-2">Edit</button>
                  <button onClick={() => handleDeleteTournament(tournament.id)} className="mtg-button">Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

{/* Events Section */}
<div className="mb-8">
  <h2 className="text-2xl font-bold mb-2">Events</h2>
  <div className="mb-4">
    <select 
      value={newEvent.tournamentId}
      onChange={(e) => setNewEvent({...newEvent, tournamentId: e.target.value})}
      className="p-2 border border-mtg-secondary rounded mr-2"
    >
      <option value="">Select Tournament</option>
      {tournaments.map(tournament => (
        <option key={tournament.id} value={tournament.id}>{tournament.name}</option>
      ))}
    </select>
    <input 
      type="text" 
      value={newEvent.name} 
      onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
      placeholder="Event name"
      className="p-2 border border-mtg-secondary rounded mr-2"
    />
    <input 
      type="text" 
      value={newEvent.description} 
      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
      placeholder="Event description"
      className="p-2 border border-mtg-secondary rounded mr-2"
    />
    <input 
      type="text" 
      value={newEvent.requiredEquipment} 
      onChange={(e) => setNewEvent({...newEvent, requiredEquipment: e.target.value})}
      placeholder="Required equipment (comma-separated)"
      className="p-2 border border-mtg-secondary rounded mr-2"
    />
    <button onClick={handleAddEvent} className="mtg-button">Add Event</button>
  </div>
  <ul>
    {events.map(event => (
      <li key={event.id} className="mb-2">
        {editingEvent && editingEvent.id === event.id ? (
          <>
            <input 
              type="text" 
              value={editingEvent.name} 
              onChange={(e) => setEditingEvent({...editingEvent, name: e.target.value})}
              className="p-2 border border-mtg-secondary rounded mr-2"
            />
            <input 
              type="text" 
              value={editingEvent.description} 
              onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
              className="p-2 border border-mtg-secondary rounded mr-2"
            />
            <input 
              type="text" 
              value={editingEvent.requiredEquipment ? 
                (Array.isArray(editingEvent.requiredEquipment) ? 
                  editingEvent.requiredEquipment.join(', ') : 
                  editingEvent.requiredEquipment
                ) : ''
              } 
              onChange={(e) => setEditingEvent({...editingEvent, requiredEquipment: e.target.value.split(',').map(item => item.trim())})}
              className="p-2 border border-mtg-secondary rounded mr-2"
              placeholder="Required equipment (comma-separated)"
            />
            <button onClick={handleEditEvent} className="mtg-button mr-2">Save</button>
            <button onClick={() => setEditingEvent(null)} className="mtg-button">Cancel</button>
          </>
        ) : (
          <>
            <span className="mr-2">
              {event.name} - {event.description}
              {event.requiredEquipment && Array.isArray(event.requiredEquipment) && event.requiredEquipment.length > 0 && 
                ` - ${event.requiredEquipment.join(', ')}`
              }
            </span>
            <button onClick={() => setEditingEvent(event)} className="mtg-button mr-2">Edit</button>
            <button onClick={() => handleDeleteEvent(event.id)} className="mtg-button">Delete</button>
          </>
        )}
      </li>
    ))}
  </ul>
</div>

      {/* Competitors Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Competitors</h2>
        <div className="mb-4">
          <input 
            type="text" 
            value={newCompetitor} 
            onChange={(e) => setNewCompetitor(e.target.value)}
            placeholder="Competitor name"
            className="p-2 border border-mtg-secondary rounded mr-2"
          />
          <button onClick={handleAddCompetitor} className="mtg-button">Add Competitor</button>
        </div>
        <ul>
          {competitors.map(competitor => (
            <li key={competitor.id} className="mb-2">
              <span className="mr-2">{competitor.name}</span>
              <button onClick={() => handleDeleteCompetitor(competitor.id)} className="mtg-button">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;