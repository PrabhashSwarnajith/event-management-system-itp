package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.VenueRequest;
import com.eventmanagement.backend.exception.ResourceNotFoundException;
import com.eventmanagement.backend.model.Venue;
import com.eventmanagement.backend.repository.VenueRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VenueServiceTest {

    @Mock
    private VenueRepository venueRepository;

    @InjectMocks
    private VenueService venueService;

    @Test
    void createVenueDefaultsAvailabilityToTrueWhenNotProvided() {
        VenueRequest request = venueRequest("Main Auditorium", "Colombo Campus", 250, "Projector, WiFi", null);

        when(venueRepository.save(any(Venue.class))).thenAnswer(invocation -> {
            Venue saved = invocation.getArgument(0);
            saved.setId(10L);
            return saved;
        });

        Venue createdVenue = venueService.createVenue(request);

        ArgumentCaptor<Venue> venueCaptor = ArgumentCaptor.forClass(Venue.class);
        verify(venueRepository).save(venueCaptor.capture());
        Venue savedVenue = venueCaptor.getValue();

        assertThat(createdVenue.getId()).isEqualTo(10L);
        assertThat(savedVenue.getName()).isEqualTo("Main Auditorium");
        assertThat(savedVenue.getLocation()).isEqualTo("Colombo Campus");
        assertThat(savedVenue.getCapacity()).isEqualTo(250);
        assertThat(savedVenue.getAvailable()).isTrue();
    }

    @Test
    void createVenueKeepsUnavailableStatusWhenProvided() {
        VenueRequest request = venueRequest("Seminar Hall", "Engineering Faculty", 80, "Sound System", false);

        when(venueRepository.save(any(Venue.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Venue createdVenue = venueService.createVenue(request);

        assertThat(createdVenue.getAvailable()).isFalse();
    }

    @Test
    void getVenuesFiltersBySearchLocationCapacityAmenityAndAvailability() {
        Venue matchingVenue = venue(1L, "Computer Lab A", "Colombo Campus", 60, "WiFi, Computers", true);
        Venue unavailableVenue = venue(2L, "Computer Lab B", "Colombo Campus", 60, "WiFi, Computers", false);
        Venue smallVenue = venue(3L, "Computer Lab C", "Colombo Campus", 30, "WiFi, Computers", true);
        Venue differentAmenity = venue(4L, "Computer Lab D", "Colombo Campus", 60, "Whiteboard", true);
        Venue differentLocation = venue(5L, "Computer Lab E", "Kandy Campus", 60, "WiFi, Computers", true);

        when(venueRepository.findAll()).thenReturn(List.of(
                matchingVenue,
                unavailableVenue,
                smallVenue,
                differentAmenity,
                differentLocation
        ));

        List<Venue> venues = venueService.getVenues("lab", "colombo", 50, "wifi", true);

        assertThat(venues).containsExactly(matchingVenue);
    }

    @Test
    void getVenueByIdThrowsWhenVenueDoesNotExist() {
        when(venueRepository.findById(404L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> venueService.getVenueById(404L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Venue not found with ID: 404");
    }

    @Test
    void isVenueAvailableReturnsTrueOnlyForAvailableVenue() {
        Venue venue = venue(6L, "Open Hall", "Main Campus", 100, "Stage", true);

        when(venueRepository.findById(6L)).thenReturn(Optional.of(venue));

        assertThat(venueService.isVenueAvailable(6L)).isTrue();
    }

    @Test
    void updateVenueOverwritesExistingFields() {
        Venue existingVenue = venue(7L, "Old Hall", "Old Location", 100, "Old Amenity", true);
        VenueRequest request = venueRequest("Updated Hall", "New Location", 150, "Projector, WiFi", false);

        when(venueRepository.findById(7L)).thenReturn(Optional.of(existingVenue));
        when(venueRepository.save(any(Venue.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Venue updatedVenue = venueService.updateVenue(7L, request);

        assertThat(updatedVenue.getName()).isEqualTo("Updated Hall");
        assertThat(updatedVenue.getLocation()).isEqualTo("New Location");
        assertThat(updatedVenue.getCapacity()).isEqualTo(150);
        assertThat(updatedVenue.getAmenities()).isEqualTo("Projector, WiFi");
        assertThat(updatedVenue.getAvailable()).isFalse();
    }

    @Test
    void deleteVenueRemovesVenueWhenItExists() {
        when(venueRepository.existsById(8L)).thenReturn(true);

        venueService.deleteVenue(8L);

        verify(venueRepository).deleteById(8L);
    }

    @Test
    void deleteVenueThrowsWhenVenueDoesNotExist() {
        when(venueRepository.existsById(404L)).thenReturn(false);

        assertThatThrownBy(() -> venueService.deleteVenue(404L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Venue not found with ID: 404");

        verify(venueRepository, never()).deleteById(404L);
    }

    private VenueRequest venueRequest(String name, String location, Integer capacity, String amenities, Boolean available) {
        VenueRequest request = new VenueRequest();
        request.setName(name);
        request.setLocation(location);
        request.setCapacity(capacity);
        request.setDescription("Venue description");
        request.setAmenities(amenities);
        request.setImageUrl("https://example.com/venue.jpg");
        request.setAvailable(available);
        return request;
    }

    private Venue venue(Long id, String name, String location, Integer capacity, String amenities, Boolean available) {
        Venue venue = new Venue();
        venue.setId(id);
        venue.setName(name);
        venue.setLocation(location);
        venue.setCapacity(capacity);
        venue.setDescription("Venue description");
        venue.setAmenities(amenities);
        venue.setImageUrl("https://example.com/venue.jpg");
        venue.setAvailable(available);
        return venue;
    }
}
