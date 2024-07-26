import React, { useState, useEffect } from 'react';
import TournamentEvent from '../components/TournamentEvent';
import Scoreboard from '../components/Scoreboard';
import { db, getTournamentEvents } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import AddCompetitor from '../components/AddCompetitor';

const BDCVI = () => {
    const [tournamentEvents, setTournamentEvents] = useState([]);
    const [tournamentInfo, setTournamentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // You should replace this with the actual tournament ID for BDCVI
    const tournamentId = 'tXFOXSozrrd47jFzWjOI';

    useEffect(() => {
        const fetchTournamentData = async () => {
            setLoading(true);
            try {
                // Fetch tournament info
                const tournamentDoc = await getDoc(doc(db, "tournaments", tournamentId));
                if (tournamentDoc.exists()) {
                    setTournamentInfo(tournamentDoc.data());
                } else {
                    throw new Error("Tournament not found");
                }

                // Fetch tournament events
                const events = await getTournamentEvents(tournamentId);
                setTournamentEvents(events);
            } catch (err) {
                console.error("Error fetching tournament data:", err);
                setError("Failed to load tournament data. Something fucked up.");
            } finally {
                setLoading(false);
            }
        };

        fetchTournamentData();
    }, [tournamentId]);

    if (loading) return <div className="container mx-auto p-4">Loading...</div>;
    if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{tournamentInfo?.name || 'BDCVI Tournament'}</h1>
            <p className="mb-8">{tournamentInfo?.description || 'Welcome to our tournament! Below you\'ll find the list of events and their details.'}</p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Tournament Events</h2>
            {tournamentEvents.map((event) => (
                <TournamentEvent 
                key={event.id}
                eventId={event.id}
                name={event.name}
                description={event.description || ""}
                requiredEquipment={event.requiredEquipment || []}
                />
            ))}

            <Scoreboard tournamentId={tournamentId} />
            
        </div>
    );
};

export default BDCVI;