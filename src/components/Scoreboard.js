import React, { useState, useEffect } from 'react';
import { db, getTournamentEvents, getEventParticipations } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Scoreboard = ({ tournamentId }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true);
        // Fetch all events for this tournament
        const events = await getTournamentEvents(tournamentId);
        
        // Fetch all competitors
        const competitorsSnapshot = await getDocs(collection(db, "competitors"));
        const competitors = competitorsSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name, score: 0 }));
        
        // Fetch participations for each event and calculate scores
        for (const event of events) {
          const participations = await getEventParticipations(event.id);
          participations.forEach((participation) => {
            const competitorIndex = competitors.findIndex(c => c.id === participation.competitorId);
            if (competitorIndex !== -1) {
              switch(participation.position) {
                case 1:
                  competitors[competitorIndex].score += 5;
                  break;
                case 2:
                  competitors[competitorIndex].score += 3;
                  break;
                case 3:
                  competitors[competitorIndex].score += 2;
                  break;
                default:
                  competitors[competitorIndex].score += 1;
              }
            }
          });
        }
        
        // Sort competitors by score
        competitors.sort((a, b) => b.score - a.score);
        setScores(competitors);
      } catch (err) {
        console.error("Error fetching scores:", err);
        setError("Failed to load scoreboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [tournamentId]);

  if (loading) return <div>Loading scoreboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Tournament Scoreboard</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-mtg-secondary text-mtg-primary">
            <th className="p-2 text-left">Rank</th>
            <th className="p-2 text-left">Competitor</th>
            <th className="p-2 text-right">Total Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((competitor, index) => (
            <tr key={competitor.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{competitor.name}</td>
              <td className="p-2 text-right">{competitor.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Scoreboard;