// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "big-dick-clan.firebaseapp.com",
  projectId: "big-dick-clan",
  storageBucket: "big-dick-clan.appspot.com",
  messagingSenderId: "533767144360",
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const addTournament = (name, description) => 
    addDoc(collection(db, "tournaments"), { name, description });
  
export const addTournamentEvent = (tournamentId, name, description, requiredEquipment, isBonus) => 
  addDoc(collection(db, "tournamentEvents"), { 
    tournamentId, 
    name, 
    description, 
    requiredEquipment,
    isBonus
  });
  

export const addCompetitor = (name) => addDoc(collection(db, "competitors"), { name });

export const addParticipation = (eventId, competitorId, position) => 
  addDoc(collection(db, "participations"), { eventId, competitorId, position });

export const updateParticipation = async (eventId, competitorId, position) => {
  const participationsRef = collection(db, "participations");
  const q = query(participationsRef, where("eventId", "==", eventId), where("competitorId", "==", competitorId));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    // If no participation exists, create a new one
    await addDoc(participationsRef, { eventId, competitorId, position });
  } else {
    // If participation exists, update it
    const participationDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, "participations", participationDoc.id), { position });
  }
};

export const deleteParticipation = async (participationId) => {
  await deleteDoc(doc(db, "participations", participationId));
};

export const getEventParticipations = async (eventId) => {
    if (!eventId) {
      console.error("No eventId provided to getEventParticipations");
      return [];
    }
    const q = query(collection(db, "participations"), where("eventId", "==", eventId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };
  
  export const getTournamentEvents = async (tournamentId) => {
    if (!tournamentId) {
      console.error("No tournamentId provided to getTournamentEvents");
      return [];
    }
    const q = query(collection(db, "tournamentEvents"), where("tournamentId", "==", tournamentId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  
