import React from 'react';
import EventPoster from './components/EventPoster';
import './styles/EventPoster.css';

function App() {
  const sampleEvent = {
    title: "BDC VI",
    date: "2024-08-01T19:00:00",
    description: "Praying for armageddon",
    location: "Svartalfheim"
  };

  return (
    <div className="App">
      <h1 className="text-3xl font-bold text-center my-8">Gaming Group Events</h1>
      <EventPoster {...sampleEvent} />
    </div>
  );
}

export default App;