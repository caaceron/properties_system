import { Request, Response, NextFunction } from 'express';
import { z, AnyZodObject, ZodError } from 'zod';

export const propertyAgentCreateSchema = z.object({
  body: z.object({
    firstName: z.string({
      required_error: 'First name is required',
    }).min(1, { message: "First name cannot be empty" }),
    
    lastName: z.string({
      required_error: 'Last name is required',
    }).min(1, { message: "Last name cannot be empty" }),
    
    email: z.string({
      required_error: 'Email is required',
    }).email({ message: "A valid email is required" }),
    
    mobileNumber: z.string().optional(),
  })
});


export const propertyAgentUpdateSchema = propertyAgentCreateSchema.deepPartial();



export const validate = (schema: AnyZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));
        return res.status(400).json({ errors: errorMessages });
      }
      return res.status(500).json({ message: 'Internal Server Error!' });
    }
  };