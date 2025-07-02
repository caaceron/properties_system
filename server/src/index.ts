import express, { Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { db, PropertyAgent } from './db';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Property System API!');
});

// GET ALL Agents
app.get('/agents', (req: Request, res: Response) => {
  res.json(Array.from(db.agents.values()));
});

// GET Agent by ID
app.get('/agents/:id', (req: Request, res: Response) => {
  const agent = db.agents.get(req.params.id);
  if (!agent) {
    return res.status(404).json({ message: 'Agent not found!' });
  }
  res.json(agent);
});

// CREATE new Agent
app.post('/agents', (req: Request, res: Response) => {
  const { firstName, lastName, email, mobileNumber } = req.body;
  
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newAgent: PropertyAgent = {
    id: uuidv4(),
    firstName,
    lastName,
    email,
    mobileNumber,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  db.agents.set(newAgent.id, newAgent);
  res.status(201).json(newAgent);
});

// UPDATE existing Agent
app.put('/agents/:id', (req: Request, res: Response) => {
  const agent = db.agents.get(req.params.id);

  if (!agent) {
    return res.status(404).json({ message: 'Agent not found!' });
  }

  const updatedAgent = { ...agent, ...req.body, updatedAt: new Date() };
  db.agents.set(req.params.id, updatedAgent);
  
  res.json(updatedAgent);
});

// DELETE Agent
app.delete('/agents/:id', (req: Request, res: Response) => {
  if (!db.agents.has(req.params.id)) {
    return res.status(404).json({ message: 'Agent not found!' });
  }
  
  db.agents.delete(req.params.id);
  res.status(204).send();
});


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});