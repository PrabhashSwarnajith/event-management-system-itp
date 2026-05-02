package com.eventmanagement.backend.controller;

import com.eventmanagement.backend.exception.ResourceNotFoundException;
import com.eventmanagement.backend.model.Review;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.ReviewRepository;
import com.eventmanagement.backend.repository.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

/**
 * ReviewController — Member 5 (Kasun) feature module.
 * Handles star ratings and user reviews for events.
 */
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    // GET all reviews for a specific event
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Map<String, Object>>> getReviewsByEvent(@PathVariable Long eventId) {
        List<Review> reviews = reviewRepository.findByEventId(eventId);
        List<Map<String, Object>> result = reviews.stream()
                .map(r -> toReviewResponse(r))
                .toList();
        return ResponseEntity.ok(result);
    }

    // GET review summary (avg rating + count) for an event
    @GetMapping("/event/{eventId}/summary")
    public ResponseEntity<Map<String, Object>> getReviewSummary(@PathVariable Long eventId) {
        List<Review> reviews = reviewRepository.findByEventId(eventId);
        Map<String, Object> summary = new HashMap<>();
        summary.put("count", reviews.size());
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        summary.put("averageRating", Math.round(avg * 10.0) / 10.0);

        // Distribution: how many 1-star, 2-star, etc.
        Map<Integer, Long> dist = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            final int star = i;
            dist.put(star, reviews.stream().filter(r -> r.getRating() == star).count());
        }
        summary.put("distribution", dist);
        return ResponseEntity.ok(summary);
    }

    // GET all reviews written by the current user
    @GetMapping("/my-reviews")
    public ResponseEntity<List<Map<String, Object>>> getMyReviews(@AuthenticationPrincipal User user) {
        List<Review> reviews = reviewRepository.findByUserId(user.getId());
        return ResponseEntity.ok(reviews.stream().map(this::toReviewResponse).toList());
    }

    // POST — submit a new review
    @PostMapping
    public ResponseEntity<Map<String, Object>> submitReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal User user) {

        // Prevent duplicate reviews from the same user for the same event
        List<Review> existing = reviewRepository.findByEventId(request.getEventId());
        boolean alreadyReviewed = existing.stream().anyMatch(r -> r.getUserId().equals(user.getId()));
        if (alreadyReviewed) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "You have already reviewed this event."));
        }

        Review review = Review.builder()
                .eventId(request.getEventId())
                .userId(user.getId())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review saved = reviewRepository.save(review);
        return ResponseEntity.status(HttpStatus.CREATED).body(toReviewResponse(saved));
    }

    // PUT — update an existing review (owner only)
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal User user) {

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + id));

        if (!review.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "You can only edit your own reviews."));
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        return ResponseEntity.ok(toReviewResponse(reviewRepository.save(review)));
    }

    // DELETE — remove a review (owner only)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + id));

        if (!review.getUserId().equals(user.getId()) && !user.getRole().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        reviewRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Map<String, Object> toReviewResponse(Review review) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", review.getId());
        map.put("eventId", review.getEventId());
        map.put("userId", review.getUserId());
        map.put("rating", review.getRating());
        map.put("comment", review.getComment());
        map.put("createdAt", review.getCreatedAt());
        map.put("updatedAt", review.getUpdatedAt());

        // Enrich with user name
        userRepository.findById(review.getUserId()).ifPresent(u -> {
            map.put("userName", u.getName());
            map.put("userInitial", u.getName() != null && !u.getName().isEmpty()
                    ? String.valueOf(u.getName().charAt(0)).toUpperCase() : "?");
        });

        return map;
    }

    // DTO
    @Data
    public static class ReviewRequest {
        @NotNull(message = "Event ID is required")
        private Long eventId;

        @NotNull(message = "Rating is required")
        @Min(value = 1, message = "Rating must be at least 1")
        @Max(value = 5, message = "Rating must be at most 5")
        private Integer rating;

        private String comment;
    }
}
