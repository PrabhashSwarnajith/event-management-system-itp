import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarIcon, MapPinIcon, UsersIcon, ArrowLeftIcon, TagIcon, ExternalLinkIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const EventDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/events/${id}`);
        if (!response.ok) {
          throw new Error("Event not found");
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 flex justify-center">
        <div className="h-10 w-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Event Not Found</h2>
        <p className="text-slate-500 mb-8">{error}</p>
        <Link to="/events" className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800">
          <ArrowLeftIcon size={16} /> Back to Events
        </Link>
      </div>
    );
  }

  const bannerImg = event.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80";

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link to="/events" className="inline-flex items-center gap-2 text-slate-500 font-medium hover:text-slate-800 mb-6 transition">
        <ArrowLeftIcon size={16} /> Back to Events
      </Link>
      
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-10">
        <div className="w-full h-64 md:h-96 overflow-hidden relative">
          <img 
            src={bannerImg} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold text-indigo-700 uppercase tracking-wide">
            {event.category}
          </div>
        </div>
        
        <div className="p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">{event.title}</h1>
          
          <div className="flex flex-wrap gap-6 mb-8 text-slate-600 font-medium border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
              <CalendarIcon className="text-indigo-500 w-5 h-5" />
              <span>
                {new Date(event.eventDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br/>
                <span className="text-sm font-bold text-slate-800">{new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
              <MapPinIcon className="text-indigo-500 w-5 h-5" />
              <span className="max-w-xs">{event.location}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
              <UsersIcon className="text-indigo-500 w-5 h-5" />
              <span>Capacity: {event.capacity} seats</span>
            </div>
          </div>
          
          <div className="prose max-w-none mb-10 text-slate-600 text-lg leading-relaxed">
            <h3 className="text-xl font-bold text-slate-900 mb-4">About this Event</h3>
            <p className="whitespace-pre-line">{event.description}</p>
          </div>

          {event.documentUrl && (
            <div className="mb-10">
               <a href={event.documentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-lg">
                 <ExternalLinkIcon size={18} /> View Event Document / Schedule
               </a>
            </div>
          )}
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Ready to join?</h3>
              <p className="text-slate-500">Secure your spot before tickets run out.</p>
            </div>
            <button className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 whitespace-nowrap">
              Book Ticket Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
