import express, { Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { db, PropertyAgent } from './db';
import { validate, propertyAgentCreateSchema, propertyAgentUpdateSchema } from './validation';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

interface CreateAgentBody {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
}
interface IdParam {
  id: string;
}

// GET Agents
app.get('/agents', (req: Request, res: Response) => {
  res.json(Array.from(db.agents.values()));
});

// GET Agent by ID
app.get('/agents/:id', (req: Request<IdParam>, res: Response) => {
  const agent = db.agents.get(req.params.id);
  if (!agent) {
    return res.status(404).json({ message: 'Agent not found' });
  }
  res.json(agent);
});

// CREATE Agent
app.post(
  '/agents', 
  validate(propertyAgentCreateSchema),
  (req: Request<{}, {}, CreateAgentBody>, res: Response) => {
    const { firstName, lastName, email, mobileNumber } = req.body;

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
  }
);

// UPDATE existing Agent
app.put('/agents/:id', 
  validate(propertyAgentUpdateSchema), 
  (req: Request<IdParam, {}, Partial<CreateAgentBody>>, res: Response) => {

    const agent = db.agents.get(req.params.id);

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found!' });
    }

    const updatedAgent = { ...agent, ...req.body, updatedAt: new Date() };
    
    db.agents.set(req.params.id, updatedAgent);
    
    res.status(200).json({
      message: `Agent "${updatedAgent.firstName} ${updatedAgent.lastName}" was successfully updated.`,
      data: updatedAgent
    });
  }
);

// DELETE Agent
app.delete('/agents/:id', (req: Request<IdParam>, res: Response) => {
  const agentToDelete = db.agents.get(req.params.id);

  if (!agentToDelete) {
    return res.status(404).json({ message: 'Agent not found' });
  }
  
  db.agents.delete(req.params.id);

  res.status(200).json({ 
    message: `Agent "${agentToDelete.firstName} ${agentToDelete.lastName}" was successfully deleted.`
  });
});


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});