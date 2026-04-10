export interface Guest {
  firstName: string;
  lastName: string;
  middleName?: string;
  phone: string;
  email: string;
  country: string;
  idNumber?: string;
  idType?: string;
}

export interface RoomDetail {
  roomType: string;
  roomNumber: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export interface AccompanyingGuest {
  firstName: string;
  lastName: string;
  middleName?: string;
  validIdPresented: boolean;
  idType?: string;
  idNumber?: string;
  signature?: string;
}

export interface PolicyAcknowledgment {
  makeUpRoom: boolean;
  housekeepingStaff: boolean;
  smoking: boolean;
  corkage: boolean;
  noPets: boolean;
  damageDeductible: boolean;
  minorsCare: boolean;
  digitalSafe: boolean;
  dataPrivacy: boolean;
  guestSignature: string;
}

export interface RegisterReservationRequest {
  checkInDate: Date | string;
  checkOutDate: Date | string;
  rooms: RoomDetail[];
  vehiclePlateNumber?: string;
  guest: Guest;
  accompanyingGuests?: AccompanyingGuest[];
  policies: PolicyAcknowledgment;
}

export interface Reservation {
  id: string;
  reservationNumber: string;
  guest: Guest;
  rooms: RoomDetail[];
  accompanyingGuests?: AccompanyingGuest[];
  policies: PolicyAcknowledgment;
  checkInDate: Date;
  checkOutDate: Date;
  vehiclePlateNumber?: string;
  status: 'completed' | 'ongoing' | 'upcoming';
  createdAt: Date;
  updatedAt?: Date;
}

export interface ReservationResponse {
  id: string;
  reservationNumber: string;
  guest: Guest;
  message: string;
}

export interface ReservationStats {
  today: number;
  week: number;
  month: number;
  total?: number;
}
