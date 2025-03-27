export interface VehicleInfo {
  year: string;
  make: string;
  model: string;
  vin: string;
  stock: string;
  trim?: string;
  transmission?: string;
}

export interface Salesperson {
  id: string;
  name: string;
}

export interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  vehicle?: VehicleInfo;
  comment: string;
  destination: string;
  sentBy: string;
} 