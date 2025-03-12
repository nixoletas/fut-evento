
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Player {
  id: string;
  name: string;
  position: number;
  added_at: Date;
  event_id: string;
}

export interface FootballEvent {
  id: string;
  title: string;
  date: Date;
  location: string;
  max_players: number;
  description?: string;
  created_by: string;
  created_at: Date;
  players?: Player[];
}
