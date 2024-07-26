import React from 'react';
import { useParams } from 'react-router-dom';
import EventPoster from './EventPoster';

const EventPage = () => {
  const { id } = useParams();
  
  // In a real application, you would fetch the event data based on the id
  // For this example, we'll use dummy data
  const event = {
    id: id,
    title: `Event ${id}`,
    date: "2024-08-01T19:00:00",
    description: "This is a sample event description.",
    location: "Sample Location"
  };

  return (
    <div className="mtg-page">
      <main className="container mx-auto p-4">
        <EventPoster {...event} />
        {/* Add more sections as needed */}
      </main>
    </div>
  );
};

export default EventPage;