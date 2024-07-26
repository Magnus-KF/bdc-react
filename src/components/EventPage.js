import React from 'react';
import EventPoster from './EventPoster';
import '../styles/mtg-theme.css';

const EventPage = ({ event }) => {
  return (
    <div className="mtg-page">
      <header className="mtg-header">
        <h1 className="text-3xl font-bold">{event.title}</h1>
      </header>
      <main className="container mx-auto p-4">
        <EventPoster {...event} />
        {/* Add more sections as needed */}
      </main>
      <footer className="mtg-footer">
        <p>© 2024 Your Gaming Group</p>
      </footer>
    </div>
  );
};

export default EventPage;