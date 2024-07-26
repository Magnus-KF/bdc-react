import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const AdminPage = () => {
  const [competitors, setCompetitors] = useState([]);
  const [newCompetitor, setNewCompetitor] = useState('');

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const fetchCompetitors = async () => {
    const querySnapshot = await getDocs(collection(db, "competitors"));
    setCompetitors(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const addCompetitor = async () => {
    if (newCompetitor.trim()) {
      await addDoc(collection(db, "competitors"), { name: newCompetitor.trim() });
      setNewCompetitor('');
      fetchCompetitors();
    }
  };

  const updateCompetitor = async (id, name) => {
    await updateDoc(doc(db, "competitors", id), { name });
    fetchCompetitors();
  };

  const deleteCompetitor = async (id) => {
    await deleteDoc(doc(db, "competitors", id));
    fetchCompetitors();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Page</h1>
      
      <div className="mb-4">
        <input 
          type="text" 
          value={newCompetitor} 
          onChange={(e) => setNewCompetitor(e.target.value)}
          placeholder="New competitor name"
          className="p-2 border border-mtg-secondary rounded mr-2"
        />
        <button onClick={addCompetitor} className="mtg-button">Add Competitor</button>
      </div>

      <ul>
        {competitors.map(competitor => (
          <li key={competitor.id} className="mb-2 flex items-center">
            <input 
              type="text" 
              value={competitor.name} 
              onChange={(e) => updateCompetitor(competitor.id, e.target.value)}
              className="p-2 border border-mtg-secondary rounded mr-2"
            />
            <button onClick={() => deleteCompetitor(competitor.id)} className="mtg-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;