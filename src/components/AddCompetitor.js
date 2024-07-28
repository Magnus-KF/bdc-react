import React, { useState } from 'react';
import { addCompetitor } from '../firebase';

const AddCompetitor = ({ onCompetitorAdded }) => {
  const [newCompetitorName, setNewCompetitorName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newCompetitorName.trim()) {
      try {
        await addCompetitor(newCompetitorName.trim());
        setNewCompetitorName('');
        if (onCompetitorAdded) {
          onCompetitorAdded();
        }
      } catch (error) {
        console.error("Error adding competitor:", error);
        alert("Failed to add competitor. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 mb-8">
      <h3 className="text-xl font-bold mb-2">Legg til deltakar</h3>
      <div className="flex">
        <input
          type="text"
          value={newCompetitorName}
          onChange={(e) => setNewCompetitorName(e.target.value)}
          placeholder="Kem e du?"
          className="flex-grow p-2 border border-mtg-secondary rounded-l"
        />
        <button type="submit" className="mtg-button rounded-l-none">Legg til</button>
      </div>
    </form>
  );
};

export default AddCompetitor;