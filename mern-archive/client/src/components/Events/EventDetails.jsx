import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { getEvent, deleteEvent, rsvpToEvent, cancelRSVP, checkRSVP } from '../../services/api';
import './Events.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasRSVP, setHasRSVP] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchEventDetails();
    if (user) {
      checkUserRSVP();
    }
  }, [id, user]);

  const fetchEventDetails = async () => {
    try {
      const response = await getEvent(id);
      setEvent(response.data);
    } catch (error) {
      toast.error('Failed to fetch event details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const checkUserRSVP = async () => {
    try {
      const response = await checkRSVP(id);
      setHasRSVP(response.data.hasRSVP);
    } catch (error) {
      console.error('Error checking RSVP:', error);
    }
  };

  const handleRSVP = async () => {
    if (!user) {
      toast.info('Please login to RSVP');
      navigate('/login');
      return;
    }

    setActionLoading(true);
    try {
      await rsvpToEvent(id);
      toast.success('Successfully RSVP\'d to event!');
      setHasRSVP(true);
      fetchEventDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to RSVP');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRSVP = async () => {
    setActionLoading(true);
    try {
      await cancelRSVP(id);
      toast.success('RSVP cancelled');
      setHasRSVP(false);
      fetchEventDetails();
    } catch (error) {
      toast.error('Failed to cancel RSVP');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        toast.success('Event deleted successfully');
        navigate('/');
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading event...</div>;
  }

  if (!event) {
    return <div className="error">Event not found</div>;
  }

  const isCreator = user && event.creator._id === user.id;
  const isFull = event.currentAttendees >= event.capacity;
  const spotsLeft = event.capacity - event.currentAttendees;

  return (
    <div className="event-details-container">
      <div className="event-details-header">
        <img src={event.imageUrl} alt={event.title} className="event-hero-image" />
        <div className="event-overlay">
          <span className="category-badge-large">{event.category}</span>
          <h1>{event.title}</h1>
        </div>
      </div>

      <div className="event-details-content">
        <div className="event-main-info">
          <div className="info-section">
            <h2>About This Event</h2>
            <p>{event.description}</p>
          </div>

          <div className="info-section">
            <h3>Event Details</h3>
            <div className="detail-grid">
              <div className="detail-row">
                <span className="icon">📅</span>
                <div>
                  <strong>Date</strong>
                  <p>{new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>

              <div className="detail-row">
                <span className="icon">🕐</span>
                <div>
                  <strong>Time</strong>
                  <p>{event.time}</p>
                </div>
              </div>

              <div className="detail-row">
                <span className="icon">📍</span>
                <div>
                  <strong>Location</strong>
                  <p>{event.location}</p>
                </div>
              </div>

              <div className="detail-row">
                <span className="icon">👥</span>
                <div>
                  <strong>Capacity</strong>
                  <p>{event.currentAttendees} / {event.capacity} attendees</p>
                </div>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Organized By</h3>
            <p>{event.creator.name}</p>
            <p className="organizer-email">{event.creator.email}</p>
          </div>
        </div>

        <div className="event-sidebar">
          <div className="capacity-card">
            <h3>Availability</h3>
            <div className="capacity-bar">
              <div 
                className="capacity-fill" 
                style={{ width: `${(event.currentAttendees / event.capacity) * 100}%` }}
              />
            </div>
            <p className="capacity-text">
              {isFull ? (
                <span className="full-text">Event is Full</span>
              ) : (
                <span>{spotsLeft} spots remaining</span>
              )}
            </p>
          </div>

          <div className="action-buttons">
            {isCreator ? (
              <>
                <Link to={`/edit-event/${event._id}`} className="btn btn-edit">
                  Edit Event
                </Link>
                <button onClick={handleDelete} className="btn btn-delete">
                  Delete Event
                </button>
              </>
            ) : (
              <>
                {hasRSVP ? (
                  <button 
                    onClick={handleCancelRSVP} 
                    className="btn btn-cancel"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Processing...' : 'Cancel RSVP'}
                  </button>
                ) : (
                  <button 
                    onClick={handleRSVP} 
                    className="btn btn-primary"
                    disabled={isFull || actionLoading}
                  >
                    {actionLoading ? 'Processing...' : isFull ? 'Event Full' : 'RSVP Now'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;