export interface SavedCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  savedAt: string;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
