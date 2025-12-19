// Mock Data for Initial Load
const INITIAL_EVENTS = [
    {
        id: '1',
        title: 'Tech Conference 2025',
        description: 'Join us for the biggest tech conference of the year featuring speakers from Google, Microsoft, and more.',
        date: '2025-06-15',
        time: '09:00',
        location: 'San Francisco, CA',
        category: 'Conference',
        capacity: 500,
        attendees: [],
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
    },
    {
        id: '2',
        title: 'Web Development Workshop',
        description: 'Learn modern web development with React and Node.js in this hands-on workshop.',
        date: '2025-07-20',
        time: '10:00',
        location: 'Online',
        category: 'Workshop',
        capacity: 50,
        attendees: [],
        imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
    },
    {
        id: '3',
        title: 'Startup Networking Mixer',
        description: 'Meet fellow entrepreneurs and investors in a casual setting.',
        date: '2025-08-10',
        time: '18:00',
        location: 'New York, NY',
        category: 'Social',
        capacity: 100,
        attendees: [],
        imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
    }
];

class App {
    constructor() {
        this.events = JSON.parse(localStorage.getItem('events')) || INITIAL_EVENTS;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.init();
    }

    init() {
        this.renderNavbar();
        this.navigateTo('home');
    }

    saveEvents() {
        localStorage.setItem('events', JSON.stringify(this.events));
    }

    saveUser() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    showToast(message, type = 'success') {
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: type === 'success' ? "#10b981" : "#ef4444",
        }).showToast();
    }

    navigateTo(sectionId) {
        // Hide all sections
        document.querySelectorAll('section').forEach(el => el.classList.add('hidden'));
        
        // Show target section
        const target = document.getElementById(`${sectionId}-section`);
        if (target) {
            target.classList.remove('hidden');
        }

        // Special handling
        if (sectionId === 'home') {
            this.renderEvents();
        }
    }

    renderNavbar() {
        const menu = document.getElementById('nav-menu');
        if (this.currentUser) {
            menu.innerHTML = `
                <li><span class="nav-username">Hello, ${this.currentUser.name}</span></li>
                <li><button class="nav-btn" onclick="app.navigateTo('create-event')">+ Create Event</button></li>
                <li><button class="logout-btn" onclick="app.handleLogout()">Logout</button></li>
            `;
            document.getElementById('create-event-btn-main').classList.remove('hidden');
        } else {
            menu.innerHTML = `
                <li><button class="nav-btn" onclick="app.navigateTo('login')">Login</button></li>
                <li><button class="nav-btn signup-btn" onclick="app.navigateTo('signup')">Sign Up</button></li>
            `;
            document.getElementById('create-event-btn-main').classList.add('hidden');
        }
    }

    renderEvents(filterCategory = 'All', filterSearch = '') {
        const grid = document.getElementById('events-grid');
        grid.innerHTML = '';

        let filteredEvents = this.events;

        // Apply filters
        const searchInput = document.getElementById('search-input').value.toLowerCase();
        const categoryFilter = document.getElementById('category-filter').value;

        filteredEvents = filteredEvents.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchInput) || 
                                event.description.toLowerCase().includes(searchInput);
            const matchesCategory = categoryFilter === 'All' || event.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });

        if (filteredEvents.length === 0) {
            grid.innerHTML = '<div class="no-events">No events found.</div>';
            return;
        }

        filteredEvents.forEach(event => {
            const card = document.createElement('div');
            card.className = 'event-card';
            card.onclick = () => this.showEventDetails(event.id);

            const spotsLeft = event.capacity - event.attendees.length;
            const isAlmostFull = spotsLeft <= event.capacity * 0.2;

            card.innerHTML = `
                <div class="event-image">
                    <img src="${event.imageUrl}" alt="${event.title}">
                    <span class="category-badge">${event.category}</span>
                </div>
                <div class="event-content">
                    <h3>${event.title}</h3>
                    <p style="color: var(--gray); margin-bottom: 1rem; flex: 1;">${event.description.substring(0, 100)}...</p>
                    <div class="event-details">
                        <div class="detail-item"><span>📅</span> ${new Date(event.date).toLocaleDateString()}</div>
                        <div class="detail-item"><span>📍</span> ${event.location}</div>
                    </div>
                    <div class="event-footer">
                        <span class="capacity-info ${isAlmostFull ? 'text-danger' : ''}">👥 ${spotsLeft} spots left</span>
                        <span class="view-details">View Details →</span>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    filterEvents() {
        this.renderEvents();
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Mock Login - accept any valid email
        if (email && password) {
            this.currentUser = {
                name: email.split('@')[0],
                email: email,
                id: Date.now().toString()
            };
            this.saveUser();
            this.renderNavbar();
            this.showToast('Login successful!');
            this.navigateTo('home');
        }
    }

    handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        if (name && email && password) {
            this.currentUser = {
                name: name,
                email: email,
                id: Date.now().toString()
            };
            this.saveUser();
            this.renderNavbar();
            this.showToast('Account created successfully!');
            this.navigateTo('home');
        }
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.renderNavbar();
        this.showToast('Logged out successfully');
        this.navigateTo('home');
    }

    handleCreateEvent(e) {
        e.preventDefault();
        if (!this.currentUser) return;

        const newEvent = {
            id: Date.now().toString(),
            title: document.getElementById('event-title').value,
            description: document.getElementById('event-description').value,
            date: document.getElementById('event-date').value,
            time: document.getElementById('event-time').value,
            location: document.getElementById('event-location').value,
            category: document.getElementById('event-category').value,
            capacity: parseInt(document.getElementById('event-capacity').value),
            imageUrl: document.getElementById('event-image').value || 'https://via.placeholder.com/800x400?text=Event',
            attendees: [],
            creatorId: this.currentUser.id
        };

        this.events.unshift(newEvent);
        this.saveEvents();
        this.showToast('Event created successfully!');
        this.navigateTo('home');
    }

    showEventDetails(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        const container = document.getElementById('event-details-content');
        const spotsLeft = event.capacity - event.attendees.length;
        const isAttending = this.currentUser && event.attendees.includes(this.currentUser.id);

        container.innerHTML = `
            <div class="event-hero">
                <img src="${event.imageUrl}" alt="${event.title}">
                <button class="auth-btn" style="width: auto; position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.5);" onclick="app.navigateTo('home')">← Back</button>
            </div>
            <h1>${event.title}</h1>
            <div style="display: flex; gap: 1rem; margin: 1rem 0;">
                <span class="category-badge" style="position: static;">${event.category}</span>
                <span class="capacity-info">👥 ${spotsLeft} spots remaining</span>
            </div>
            
            <div style="background: white; padding: 2rem; border-radius: 12px; margin-top: 2rem;">
                <h3>Event Details</h3>
                <p class="mb-2">${event.description}</p>
                <div class="event-details">
                    <div class="detail-item"><span>📅</span> ${new Date(event.date).toLocaleDateString()} at ${event.time}</div>
                    <div class="detail-item"><span>📍</span> ${event.location}</div>
                </div>

                ${this.currentUser ? `
                    <button class="auth-btn" 
                        onclick="app.handleRSVP('${event.id}')"
                        ${isAttending || spotsLeft === 0 ? 'disabled' : ''}
                        style="${isAttending ? 'background-color: var(--success-color);' : ''}"
                    >
                        ${isAttending ? '✓ You are attending' : (spotsLeft === 0 ? 'Event Full' : 'RSVP for Event')}
                    </button>
                ` : `
                    <div style="text-align: center; margin-top: 2rem; padding: 1rem; background: var(--light-gray); border-radius: 8px;">
                        <p>Please <a href="#" onclick="app.navigateTo('login')" style="color: var(--primary-color);">login</a> to RSVP</p>
                    </div>
                `}
            </div>
        `;

        this.navigateTo('event-details');
    }

    handleRSVP(eventId) {
        if (!this.currentUser) return;

        const eventIndex = this.events.findIndex(e => e.id === eventId);
        if (eventIndex === -1) return;

        const event = this.events[eventIndex];
        
        if (event.attendees.includes(this.currentUser.id)) {
            // Un-RSVP (Optional)
            return;
        }

        if (event.attendees.length >= event.capacity) {
            this.showToast('Event is full!', 'error');
            return;
        }

        event.attendees.push(this.currentUser.id);
        this.events[eventIndex] = event;
        this.saveEvents();
        this.showToast('RSVP successful! See you there.');
        this.showEventDetails(eventId); // Re-render to show updated status
    }
}

const app = new App();