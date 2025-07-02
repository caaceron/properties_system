import { v4 as uuidv4 } from 'uuid';

export interface PropertyAgent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

// lookups by ID
const agents = new Map<string, PropertyAgent>();

const initialAgentId = uuidv4();
agents.set(initialAgentId, {
    id: initialAgentId,
    firstName: 'Angel',
    lastName: 'Aceron',
    email: 'claireangelaceron@gmail.com',
    mobileNumber: '09194563613',
    createdAt: new Date(),
    updatedAt: new Date(),
});

export const db = {
  agents,
};