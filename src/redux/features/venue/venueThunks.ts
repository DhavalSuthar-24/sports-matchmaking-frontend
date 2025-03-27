// venueThunks.ts
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import type { 
  Venue, 
  CreateVenuePayload, 
  UpdateVenuePayload,
  CreateVenueTimeSlotPayload,
  UpdateVenueTimeSlotPayload,
  CreateSchedulePayload,
  GenerateDailySlotsPayload,
  VenueTimeSlot,
  VenueSchedule
} from "./venueTypes";

const BASE_URL = "http://localhost:3000/api/venues";

// Venue CRUD Operations
export const fetchVenues = createAsyncThunk(
  "venues/fetchVenues",
  async (params: { location?: string; available?: boolean } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL, { params });
      return response.data.data.venues;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch venues");
    }
  }
);

export const fetchVenueById = createAsyncThunk(
  "venues/fetchVenueById",
  async (venueId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/${venueId}`);
      return response.data.data.venue;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch venue details");
    }
  }
);

export const createVenue = createAsyncThunk(
  "venues/createVenue",
  async (venueData: CreateVenuePayload, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(BASE_URL, venueData, config);
      return response.data.data.venue;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to create venue");
    }
  }
);

export const updateVenue = createAsyncThunk(
  "venues/updateVenue",
  async (
    { venueId, venueData }: { venueId: string; venueData: UpdateVenuePayload },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.patch(`${BASE_URL}/${venueId}`, venueData, config);
      return response.data.data.venue;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update venue");
    }
  }
);

export const deleteVenue = createAsyncThunk(
  "venues/deleteVenue",
  async (venueId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`${BASE_URL}/${venueId}`, config);
      return venueId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete venue");
    }
  }
);

// Time Slots Operations
export const fetchVenueTimeSlots = createAsyncThunk(
  "venues/fetchTimeSlots",
  async (venueId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/${venueId}/time-slots`);
      return response.data.data.timeSlots;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch venue time slots");
    }
  }
);

export const createVenueTimeSlot = createAsyncThunk(
  "venues/createTimeSlot",
  async (
    { venueId, timeSlotData }: { venueId: string; timeSlotData: CreateVenueTimeSlotPayload },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(`${BASE_URL}/${venueId}/time-slots`, timeSlotData, config);
      return response.data.data.timeSlot;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to create time slot");
    }
  }
);

export const updateVenueTimeSlot = createAsyncThunk(
  "venues/updateTimeSlot",
  async (
    { venueId, slotId, timeSlotData }: { 
      venueId: string; 
      slotId: string; 
      timeSlotData: UpdateVenueTimeSlotPayload 
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.patch(`${BASE_URL}/${venueId}/time-slots/${slotId}`, timeSlotData, config);
      return response.data.data.timeSlot;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update time slot");
    }
  }
);

export const deleteVenueTimeSlot = createAsyncThunk(
  "venues/deleteTimeSlot",
  async (
    { venueId, slotId }: { venueId: string; slotId: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`${BASE_URL}/${venueId}/time-slots/${slotId}`, config);
      return { venueId, slotId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete time slot");
    }
  }
);

export const bookVenueTimeSlot = createAsyncThunk(
  "venues/bookTimeSlot",
  async (slotId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.patch(`${BASE_URL}/time-slots/${slotId}/book`, {}, config);
      return response.data.data.timeSlot;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to book time slot");
    }
  }
);

// Schedule Operations
export const createVenueSchedule = createAsyncThunk(
  "venues/createSchedule",
  async (scheduleData: CreateSchedulePayload, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(`${BASE_URL}/${scheduleData.venueId}/schedules`, scheduleData, config);
      return response.data.data.schedule;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to create schedule");
    }
  }
);

export const fetchVenueSchedules = createAsyncThunk(
  "venues/fetchSchedules",
  async (venueId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/${venueId}/schedules`);
      return response.data.data.schedules;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch venue schedules");
    }
  }
);

export const deleteVenueSchedule = createAsyncThunk(
  "venues/deleteSchedule",
  async (scheduleId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`${BASE_URL}/schedules/${scheduleId}`, config);
      return scheduleId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete schedule");
    }
  }
);

export const generateDailySlots = createAsyncThunk(
  "venues/generateDailySlots",
  async (
    { scheduleId, date }: { scheduleId: string; date: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${BASE_URL}/schedules/generate`, 
        { scheduleId, date }, 
        config
      );
      return response.data.data.slots;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to generate daily slots");
    }
  }
);