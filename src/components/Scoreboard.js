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
              if (event.isBonus) {
                competitors[competitorIndex].score += 1;  // Bonus events award 1 point
              } else {
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

  if (loading) return <div className="mtg-text">Lastar resultattavle...</div>;
  if (error) return <div className="text-red-500 mtg-text">{error}</div>;

  return (
    <div className="mtg-card mt-8">
      <h2 className="mtg-title mb-4">Turneringsresultat</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="mtg-table-header">
            <th className="mtg-table-cell text-left">Rang</th>
            <th className="mtg-table-cell text-left">Deltakar</th>
            <th className="mtg-table-cell text-right">Totalpoeng</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((competitor, index) => (
            <tr key={competitor.id} className={index % 2 === 0 ? "mtg-table-row-even" : "mtg-table-row-odd"}>
              <td className="mtg-table-cell">{index + 1}</td>
              <td className="mtg-table-cell">{competitor.name}</td>
              <td className="mtg-table-cell text-right">{competitor.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Scoreboard;