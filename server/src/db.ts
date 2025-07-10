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

const agents = new Map<string, PropertyAgent>();

const agentsData = [
  { 
    firstName: 'Angel',
    lastName: 'Aceron',
    email: 'claireangelaceron@gmail.com',
    mobileNumber: '+63 912 345 671',
  },
  { 
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    mobileNumber: '+63 912 345 672',
  },
  { 
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    mobileNumber: '+63 912 345 673',
  }
];

agentsData.forEach(data => {
  const id = uuidv4();

  const newAgent: PropertyAgent = {
    id,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  agents.set(id, newAgent);
});


export const db = {
  agents,
};