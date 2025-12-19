import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMyEvents, getMyRSVPs } from '../../services/api';
import EventCard from '../Events/EventCard';
import './Dashboard.css';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('attending');
  const [myEvents, setMyEvents] = useState([]);
  const [myRSVPs, setMyRSVPs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, rsvpsRes] = await Promise.all([
        getMyEvents(),
        getMyRSVPs()
      ]);
      setMyEvents(eventsRes.data.data);
      setMyRSVPs(rsvpsRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>My Dashboard</h1>

      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'attending' ? 'active' : ''}`}
          onClick={() => setActiveTab('attending')}
        >
          Events I'm Attending ({myRSVPs.length})
        </button>
        <button
          className={`tab ${activeTab === 'created' ? 'active' : ''}`}
          onClick={() => setActiveTab('created')}
        >
          Events I Created ({myEvents.length})
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'attending' ? (
          <div className="events-section">
            {myRSVPs.length === 0 ? (
              <div className="empty-state">
                <p>You haven't RSVP'd to any events yet.</p>
                <Link to="/" className="btn btn-primary">Browse Events</Link>
              </div>
            ) : (
              <div className="events-grid">
                {myRSVPs.map(rsvp => (
                  <EventCard key={rsvp.event._id} event={rsvp.event} onUpdate={fetchData} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="events-section">
            {myEvents.length === 0 ? (
              <div className="empty-state">
                <p>You haven't created any events yet.</p>
                <Link to="/create-event" className="btn btn-primary">Create Event</Link>
              </div>
            ) : (
              <div className="events-grid">
                {myEvents.map(event => (
                  <EventCard key={event._id} event={event} onUpdate={fetchData} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;