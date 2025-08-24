// Event storage utilities with user scoping
export const eventStorage = {
  // Get current user email from auth
  getUserEmail() {
    try {
      const user = JSON.parse(localStorage.getItem('auth_user') || 'null');
      return user?.email || null;
    } catch {
      return null;
    }
  },

  // Event proposals (user-scoped)
  getProposals() {
    const email = this.getUserEmail();
    if (!email) return [];
    try {
      const key = `event_proposals__${email}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  },

  saveProposal(proposal) {
    const email = this.getUserEmail();
    if (!email) throw new Error('User not logged in');
    
    const key = `event_proposals__${email}`;
    const list = this.getProposals();
    const idx = list.findIndex(x => x.id === proposal.id);
    
    if (idx >= 0) {
      list[idx] = proposal;
    } else {
      list.push(proposal);
    }
    
    localStorage.setItem(key, JSON.stringify(list));
    return proposal;
  },

  // Published events (global)
  getPublishedEvents() {
    try {
      return JSON.parse(localStorage.getItem('events_published') || '[]');
    } catch {
      return [];
    }
  },

  publishProposal(proposal) {
    const published = this.getPublishedEvents();
    if (!published.find(x => x.id === proposal.id)) {
      published.push({...proposal, status: 'published'});
      localStorage.setItem('events_published', JSON.stringify(published));
    }
    
    // Update proposal status
    proposal.status = 'published';
    this.saveProposal(proposal);
    return proposal;
  },

  // RSVP management (user-scoped)
  getRSVPs() {
    const email = this.getUserEmail();
    if (!email) return [];
    try {
      const key = `events_rsvp__${email}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  },

  toggleRSVP(eventId) {
    const email = this.getUserEmail();
    if (!email) throw new Error('User not logged in');
    
    const key = `events_rsvp__${email}`;
    const rsvps = this.getRSVPs();
    const idx = rsvps.indexOf(eventId);
    
    if (idx >= 0) {
      rsvps.splice(idx, 1);
    } else {
      rsvps.push(eventId);
    }
    
    localStorage.setItem(key, JSON.stringify(rsvps));
    return idx < 0; // return true if now RSVP'd
  },

  isRSVPd(eventId) {
    return this.getRSVPs().includes(eventId);
  },

  // Generate UUID
  generateId() {
    return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  // Download .ics file
  downloadICS(event) {
    const dt = (s) => s.replace(/[-:]/g,'').replace('.000','');
    const start = `${event.dateISO}T${(event.startTime||'09:00')}:00`;
    const end   = `${event.dateISO}T${(event.endTime||'10:00')}:00`;
    const ics = [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//GreenApp//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}@greenapp`,
      `DTSTAMP:${dt(new Date().toISOString())}`,
      `DTSTART:${dt(start)}`, `DTEND:${dt(end)}`,
      `SUMMARY:${event.title}`,
      `LOCATION:${event.location?.address||''}`,
      `DESCRIPTION:${(event.description||'').replace(/\n/g,'\\n')}`,
      'END:VEVENT','END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); 
    a.download = `${event.title}.ics`; 
    a.click();
    URL.revokeObjectURL(a.href);
  }
};

// Toast utility
export function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  const bgColor = type === 'error' ? 'bg-red-600' : type === 'info' ? 'bg-blue-600' : 'bg-emerald-600';
  toast.className = `fixed top-20 right-4 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300`;
  toast.textContent = message;
  toast.setAttribute('aria-live', 'polite');
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
    }
  }, 3000);
}