export interface SupabaseEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  location_lat?: number;
  location_lng?: number;
  max_players: number;
  description?: string;
  created_by: string;
  created_at: string;
  duration_min: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

export interface Player {
  id: string;
  name: string;
  position: number;
  event_id: string;
  added_at: Date;
}

export interface FootballEvent {
  id: string;
  title: string;
  date: Date;
  location: string;
  location_lat?: number;
  location_lng?: number;
  max_players: number;
  description?: string;
  created_by: string;
  created_at: Date;
  players: Player[];
  duration_min: number;
}
