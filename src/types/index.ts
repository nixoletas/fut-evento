
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Player {
  id: string;
  name: string;
  position: number;
  addedAt: Date;
}

export interface FootballEvent {
  id: string;
  title: string;
  date: Date;
  location: string;
  maxPlayers: number;
  description?: string;
  createdBy: string;
  createdAt: Date;
  players: Player[];
}
