// venueSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchVenues,
  fetchVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
  fetchVenueTimeSlots,
  createVenueTimeSlot,
  updateVenueTimeSlot,
  deleteVenueTimeSlot,
  bookVenueTimeSlot,
  createVenueSchedule,
  fetchVenueSchedules,
  deleteVenueSchedule,
  generateDailySlots
} from "./venueThunks";
import type { Venue, VenueTimeSlot, VenueSchedule } from "./venueTypes";

interface VenueState {
  venues: Venue[];
  selectedVenue: Venue | null;
  timeSlots: VenueTimeSlot[];
  schedules: VenueSchedule[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: VenueState = {
  venues: [],
  selectedVenue: null,
  timeSlots: [],
  schedules: [],
  status: "idle",
  error: null,
};

const venueSlice = createSlice({
  name: "venues",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Venues
    builder
      .addCase(fetchVenues.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVenues.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.venues = action.payload;
      })
      .addCase(fetchVenues.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

    // Fetch Venue By Id
    .addCase(fetchVenueById.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchVenueById.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.selectedVenue = action.payload;
    })
    .addCase(fetchVenueById.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    })

    // Create Venue
    .addCase(createVenue.pending, (state) => {
      state.status = "loading";
    })
    .addCase(createVenue.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.venues.push(action.payload);
      state.selectedVenue = action.payload;
    })
    .addCase(createVenue.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    })

    // Update Venue
    .addCase(updateVenue.pending, (state) => {
      state.status = "loading";
    })
    .addCase(updateVenue.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.venues.findIndex((venue) => venue.id === action.payload.id);
      if (index !== -1) {
        state.venues[index] = action.payload;
      }
      state.selectedVenue = action.payload;
    })
    .addCase(updateVenue.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    })

    // Delete Venue
    .addCase(deleteVenue.pending, (state) => {
      state.status = "loading";
    })
    .addCase(deleteVenue.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.venues = state.venues.filter((venue) => venue.id !== action.payload);
      state.selectedVenue = null;
    })
    .addCase(deleteVenue.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    })

    // Fetch Venue Time Slots
    .addCase(fetchVenueTimeSlots.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchVenueTimeSlots.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.timeSlots = action.payload;
    })
    .addCase(fetchVenueTimeSlots.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    })

    // Create Venue Time Slot
    .addCase(createVenueTimeSlot.pending, (state) => {
      state.status = "loading";
    })
    .addCase(createVenueTimeSlot.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.timeSlots.push(action.payload);
    })
    .addCase(createVenueTimeSlot.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    })

    // Update Venue Time Slot
    .addCase(updateVenueTimeSlot.pending, (state) => {
      state.status = "loading";
    })
    .addCase(updateVenueTimeSlot.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.timeSlots.findIndex((slot) => slot.id === action.payload.id);
      if (index !== -1) {
        state.timeSlots[index] = action.payload;
      }
    })
    .addCase(updateVenueTimeSlot.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    })

    // Delete Venue Time Slot
    .addCase(deleteVenueTimeSlot.pending, (state) => {
      state.status = "loading";
    })
    .addCase(deleteVenueTimeSlot.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.timeSlots = state.timeSlots.filter(
        (slot) => slot.id !== action.payload.slotId
      );
    })
    .addCase(deleteVenueTimeSlot.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    })

    // Book Venue Time Slot
    .addCase(bookVenueTimeSlot.pending, (state) => {
      state.status = "loading";
    })
    .addCase(bookVenueTimeSlot.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.timeSlots.findIndex((slot) => slot.id === action.payload.id);
      if (index !== -1) {
        state.timeSlots[index] = action.payload;
      }
    })
    .addCase(bookVenueTimeSlot.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    })

    // Create Venue Schedule
    .addCase(createVenueSchedule.pending, (state) => {
      state.status = "loading";
    })
    .addCase(createVenueSchedule.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.schedules.push(action.payload);
    })
    .addCase(createVenueSchedule.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    })

    // Fetch Venue Schedules
    .addCase(fetchVenueSchedules.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchVenueSchedules.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.schedules = action.payload;
    })
    .addCase(fetchVenueSchedules.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    })

    // Delete Venue Schedule
    .addCase(deleteVenueSchedule.pending, (state) => {
      state.status = "loading";
    })
    .addCase(deleteVenueSchedule.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.schedules = state.schedules.filter(
        (schedule) => schedule.id !== action.payload
      );
    })
    .addCase(deleteVenueSchedule.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    })

    // Generate Daily Slots
    .addCase(generateDailySlots.pending, (state) => {
      state.status = "loading";
    })
    .addCase(generateDailySlots.fulfilled, (state, action) => {
      state.status = "succeeded";
      // Optionally update timeSlots with generated slots
      state.timeSlots.push(...action.payload);
    })
    .addCase(generateDailySlots.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });
  },
});

export default venueSlice.reducer;