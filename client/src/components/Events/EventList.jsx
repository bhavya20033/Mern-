import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllEvents } from '../../services/api';
import EventCard from './EventCard';
import './Events.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    sortBy: 'createdAt'
  });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category !== 'All') params.category = filters.category;
      if (filters.sortBy) params.sortBy = filters.sortBy;

      const response = await getAllEvents(params);
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="event-list-container">
      <div className="event-list-header">
        <h1>Upcoming Events</h1>
        <Link to="/create-event" className="create-event-btn">+ Create Event</Link>
      </div>

      <div className="filters">
        <input
          type="text"
          name="search"
          placeholder="Search events..."
          value={filters.search}
          onChange={handleFilterChange}
          className="search-input"
        />

        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="All">All Categories</option>
          <option value="Conference">Conference</option>
          <option value="Workshop">Workshop</option>
          <option value="Meetup">Meetup</option>
          <option value="Social">Social</option>
          <option value="Sports">Sports</option>
          <option value="Other">Other</option>
        </select>

        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
          <option value="createdAt">Latest</option>
          <option value="date">Event Date</option>
          <option value="capacity">Capacity</option>
        </select>
      </div>

      {events.length === 0 ? (
        <div className="no-events">
          <p>No events found. Be the first to create one!</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map(event => (
            <EventCard key={event._id} event={event} onUpdate={fetchEvents} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;