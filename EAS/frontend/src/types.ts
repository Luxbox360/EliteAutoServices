export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
}

export interface AuthState {
  access_token: string;
  user: User;
}

export interface Vehicle {
  id: number;
  vin: string;
  year: number;
  make: string;
  model: string;
  type: string;
  color: string;
  mileage: number;
  price: number;
  image_main: string | null;
  status: string;
  featured: boolean;
  description?: string;
  title_status?: string;
  transmission?: string;
  engine?: string;
  images?: string[];
  specs?: Record<string, any>;
}
