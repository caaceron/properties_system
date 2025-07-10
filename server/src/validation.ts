import { Request, Response, NextFunction } from 'express';
import { z, AnyZodObject, ZodError } from 'zod';

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
        return res.status(400).json({ 
          errors: error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message,
          }))
        });
      }
      return res.status(500).json({ message: 'Internal Server Error!' });
    }
  };

const phoneRegex = new RegExp(/^\+[\d\s]{10,20}$/);

export const propertyAgentCreateSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("A valid email is required"),
    mobileNumber: z.string().optional().transform(val => val || "").refine(val => val === "" || phoneRegex.test(val), {
      message: "Invalid phone number format."
    }),
  }),
});

export const propertyAgentUpdateSchema = z.object({
  body: propertyAgentCreateSchema.shape.body.partial(),
});