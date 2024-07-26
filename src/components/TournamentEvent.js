import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';

const TournamentEvent = ({ title, description, requiredEquipment }) => {
  const [competitors, setCompetitors] = useState([]);
  const [newCompetitor, setNewCompetitor] = useState('');
  const [allCompetitors, setAllCompetitors] = useState([]);

  useEffect(() => {
    const fetchCompetitors = async () => {
      const querySnapshot = await getDocs(collection(db, "competitors"));
      setAllCompetitors(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCompetitors();
  }, []);

  const addCompetitor = async () => {
    if (newCompetitor.trim()) {
      const competitorRef = await addDoc(collection(db, "competitors"), { name: newCompetitor.trim() });
      setCompetitors([...competitors, { id: competitorRef.id, name: newCompetitor.trim(), score: 0 }]);
      setNewCompetitor('');
    }
  };

  const selectCompetitor = (competitorId) => {
    const selectedCompetitor = allCompetitors.find(c => c.id === competitorId);
    if (selectedCompetitor && !competitors.some(c => c.id === competitorId)) {
      setCompetitors([...competitors, { ...selectedCompetitor, score: 0 }]);
    }
  };

  const updateScore = async (index, change) => {
    const updatedCompetitors = competitors.map((competitor, i) => 
      i === index ? { ...competitor, score: Math.max(0, competitor.score + change) } : competitor
    );
    setCompetitors(updatedCompetitors);
    
    const competitorToUpdate = updatedCompetitors[index];
    await updateDoc(doc(db, "competitors", competitorToUpdate.id), { 
      score: competitorToUpdate.score 
    });
  };

  return (
    <div className="mtg-card mb-8">
      <h2 className="mtg-title">{title}</h2>
      <p className="mtg-description">{description}</p>
      
      <h3 className="text-lg font-bold mt-4 mb-2">Required Equipment:</h3>
      <ul className="list-disc list-inside mb-4">
        {requiredEquipment.map((item, index) => (
          <li key={index} className="mtg-text">{item}</li>
        ))}
      </ul>
      
      <h3 className="text-lg font-bold mt-4 mb-2">Competitors:</h3>
      <ul className="mb-4">
        {competitors.map((competitor, index) => (
          <li key={index} className="flex items-center justify-between mb-2">
            <span className="mtg-text">{competitor.name}</span>
            <div>
              <span className="mtg-text mr-2">Score: {competitor.score}</span>
              <button onClick={() => updateScore(index, -1)} className="mtg-button mr-1">-</button>
              <button onClick={() => updateScore(index, 1)} className="mtg-button">+</button>
            </div>
          </li>
        ))}
      </ul>
      
      <div className="flex mt-4">
        <input 
          type="text" 
          value={newCompetitor} 
          onChange={(e) => setNewCompetitor(e.target.value)}
          placeholder="New competitor name"
          className="flex-grow p-2 border border-mtg-secondary rounded-l"
        />
        <button onClick={addCompetitor} className="mtg-button rounded-l-none">Add Competitor</button>
      </div>

      <div className="mt-4">
        <select 
          onChange={(e) => selectCompetitor(e.target.value)} 
          className="p-2 border border-mtg-secondary rounded"
        >
          <option value="">Select existing competitor</option>
          {allCompetitors.map(competitor => (
            <option key={competitor.id} value={competitor.id}>{competitor.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TournamentEvent;