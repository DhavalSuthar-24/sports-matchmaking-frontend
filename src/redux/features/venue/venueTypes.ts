// venueTypes.ts
export interface Coordinates {
    latitude: number;
    longitude: number;
  }
  
  export interface Media {
    id: string;
    url: string;
    type: 'IMAGE' | 'VIDEO';
    altText?: string;
  }
  
  export interface VenueTimeSlot {
    id: string;
    venueId: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    bookedBy?: string;
    price?: number;
    courtNumber?: number;
  }
  
  export interface VenueSchedule {
    id: string;
    venueId: string;
    startTime: string;
    endTime: string;
    interval: number;
    courtNumber: number;
    daysOfWeek: string[];
    price?: number;
    timeZone?: string;
  }
  
  export interface Venue {
    id: string;
    name: string;
    location: string;
    coordinates?: Coordinates;
    facilities?: string[];
    contactInfo?: string;
    description?: string;
    images?: string[];
    capacityPeople?: number;
    hourlyRate?: number;
    managerId: string;
    manager?: {
      id: string;
      name: string;
    };
    timeSlots?: VenueTimeSlot[];
    matches?: any[]; // Add proper type if matches have a specific structure
    socialHours?: any; // Add proper type if social hours have a specific structure
    isDeleted?: boolean;
  }
  
  export interface CreateVenuePayload {
    name: string;
    location: string;
    coordinates?: Coordinates;
    facilities?: string[];
    contactInfo?: string;
    description?: string;
    images?: string[];
    capacityPeople?: number;
    hourlyRate?: number;
    socialHours?: any;
  }
  
  export interface UpdateVenuePayload {
    name?: string;
    location?: string;
    coordinates?: Coordinates;
    facilities?: string[];
    contactInfo?: string;
    description?: string;
    images?: string[];
    capacityPeople?: number;
    hourlyRate?: number;
    socialHours?: any;
  }
  
  export interface CreateVenueTimeSlotPayload {
    startTime: string;
    endTime: string;
  }
  
  export interface UpdateVenueTimeSlotPayload {
    startTime?: string;
    endTime?: string;
    isBooked?: boolean;
    bookedBy?: string;
  }
  
  export interface CreateSchedulePayload {
    venueId: string;
    startTime: string;
    endTime: string;
    interval: number;
    courtNumber: number;
    daysOfWeek: string[];
    price?: number;
    equipment?: any;
    timeZone?: string;
  }
  
  export interface GenerateDailySlotsPayload {
    date: string;
  }