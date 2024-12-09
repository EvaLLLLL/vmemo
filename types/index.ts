export interface Message {
  id: string
  content: string
  userId: string
  userName: string
  roomId: string
  createdAt: string
  updatedAt: string
  user: {
    name: string | null
    image: string | null
  }
}

export interface Room {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
  _count?: {
    messages: number
    members: number
  }
}
