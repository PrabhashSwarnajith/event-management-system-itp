import { useState, useEffect } from "react";
import { Star, Send, ThumbsUp, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const API = "http://localhost:8080/api";

/**
 * EventReviews — Star ratings + comment reviews for events.
 * Member 5 unique feature.
 */
const EventReviews = ({ eventId }) => {
  const { user, authFetch } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      const [revRes, sumRes] = await Promise.all([
        fetch(`${API}/reviews/event/${eventId}`),
        fetch(`${API}/reviews/event/${eventId}/summary`),
      ]);
      if (revRes.ok) setReviews(await revRes.json());
      if (sumRes.ok) setSummary(await sumRes.json());
    } catch (e) {
      console.error("Failed to load reviews", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [eventId]);

  const alreadyReviewed = user && reviews.some((r) => r.userId === user.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!myRating) { setError("Please select a star rating."); return; }
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const res = await authFetch(`${API}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: Number(eventId), rating: myRating, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to submit review.");
        return;
      }
      setMessage("✅ Your review was submitted successfully!");
      setMyRating(0);
      setComment("");
      fetchReviews();
    } catch {
      setError("Could not submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Delete your review?")) return;
    try {
      await authFetch(`${API}/reviews/${reviewId}`, { method: "DELETE" });
      setMessage("Review deleted.");
      fetchReviews();
    } catch {
      setError("Failed to delete review.");
    }
  };

  const renderStars = (rating, interactive = false, size = "w-5 h-5") => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => setMyRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
            className={interactive ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}
            disabled={!interactive}
          >
            <Star
              className={`${size} transition-colors ${
                star <= (interactive ? (hoverRating || myRating) : rating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-200 fill-slate-200"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getRatingLabel = (r) => ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][r] || "";

  return (
    <div className="mt-8 border-t border-slate-200 pt-8">
      <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
        Reviews & Ratings
      </h2>

      {/* Summary */}
      {summary && (
        <div className="bg-slate-50 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row gap-6 items-center border border-slate-200">
          <div className="text-center">
            <p className="text-5xl font-black text-slate-900">{summary.averageRating || "—"}</p>
            <div className="flex justify-center mt-1">
              {renderStars(Math.round(summary.averageRating || 0), false, "w-4 h-4")}
            </div>
            <p className="text-xs text-slate-500 mt-1">{summary.count} review{summary.count !== 1 ? "s" : ""}</p>
          </div>

          {/* Distribution bars */}
          <div className="flex-1 w-full space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = summary.distribution?.[star] || 0;
              const pct = summary.count > 0 ? Math.round((count / summary.count) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 w-4">{star}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Submit form */}
      {user && !alreadyReviewed && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Write Your Review</h3>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-600 mb-2">Your Rating</label>
            <div className="flex items-center gap-3">
              {renderStars(0, true, "w-7 h-7")}
              {myRating > 0 && (
                <span className="text-sm font-bold text-amber-600">{getRatingLabel(myRating)}</span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-600 mb-2">Comment (optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Share your experience at this event..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none resize-none transition"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg border border-red-200 mb-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          {message && (
            <div className="bg-emerald-50 text-emerald-700 text-sm px-3 py-2 rounded-lg border border-emerald-200 mb-3">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !myRating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm transition cursor-pointer disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            id="review-submit-btn"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit Review
          </button>
        </form>
      )}

      {alreadyReviewed && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 mb-6 text-sm text-indigo-700 font-semibold">
          ✅ You've already reviewed this event. Thank you for your feedback!
        </div>
      )}

      {!user && (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 mb-6 text-center">
          <Star className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-600 font-semibold mb-3">Sign in to write a review</p>
          <a href="/auth" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold"
             style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            Sign In
          </a>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          <ThumbsUp className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-sm">
                    {review.userInitial || "?"}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{review.userName || "Student"}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {renderStars(review.rating, false, "w-3.5 h-3.5")}
                      <span className="text-xs font-bold text-amber-600 ml-1">
                        {getRatingLabel(review.rating)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric"
                    }) : ""}
                  </span>
                  {user && (user.id === review.userId || user.role === "ADMIN") && (
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                      aria-label="Delete review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              {review.comment && (
                <p className="text-slate-600 text-sm mt-3 leading-relaxed pl-12">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventReviews;
