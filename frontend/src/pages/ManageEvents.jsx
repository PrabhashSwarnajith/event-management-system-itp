import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { LinkIcon } from "lucide-react";

const ManageEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  
  // Very simple form mapping avoiding complex reducers for uni project
  const [formData, setFormData] = useState({
    title: "", description: "", location: "", category: "", eventDate: "", bannerUrl: "", documentUrl: "", capacity: ""
  });

  const fetchMyEvents = async () => {
      // In a complex project, we filter by organizerId on the backend. 
      // For this simple project, we'll fetch all and filter array or just show list depending on requirements.
      const res = await fetch("http://localhost:8080/api/events");
      const data = await res.json();
      setEvents(data);
  };

  useEffect(() => { fetchMyEvents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!user?.id) return alert("You must be logged in to create an event!");

    const payload = { ...formData, capacity: parseInt(formData.capacity), organizerId: user.id };
    
    await fetch("http://localhost:8080/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setFormData({ title: "", description: "", location: "", category: "", eventDate: "", bannerUrl: "", documentUrl: "", capacity: "" });
    fetchMyEvents();
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Manage Your Events</h1>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-10">
        <h2 className="text-xl font-bold mb-5 border-b pb-4">Create New Event</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-slate-700">Event Title</label>
            <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-100" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Category</label>
            <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-100" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Location</label>
            <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-100" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Date & Time</label>
            <input required type="datetime-local" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-100" value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Total Capacity</label>
            <input required type="number" min="1" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-100" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-slate-700">Description</label>
            <textarea required rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-100" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 flex items-center gap-2"><LinkIcon size={14}/> Banner Image URL</label>
            <input placeholder="https://..." type="url" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-100" value={formData.bannerUrl} onChange={e => setFormData({...formData, bannerUrl: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 flex items-center gap-2"><LinkIcon size={14}/> Document/Schedule URL (Optional)</label>
            <input placeholder="https://..." type="url" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-100" value={formData.documentUrl} onChange={e => setFormData({...formData, documentUrl: e.target.value})} />
          </div>
          <div className="col-span-1 md:col-span-2 pt-2">
            <button type="submit" className="bg-slate-900 text-white font-bold py-3 px-6 rounded-lg w-full hover:bg-indigo-600 transition">Publish Event</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageEvents;
