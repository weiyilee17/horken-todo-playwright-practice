import { z } from 'zod';

const todoSchema = z.object({
  id: z.number().min(1),
  description: z.string().min(2).max(255),
  completed: z.boolean(),
});

export const todosSchema = z.array(todoSchema);

export const todoFormSchema = todoSchema.pick({
  description: true,
});

export type TTodoForm = z.infer<typeof todoFormSchema>;

export type TTodos = z.infer<typeof todosSchema>;
export type TTodo = z.infer<typeof todoSchema>;

// login

// Just an example of special logic validation.
// Should use regex for real application

const numbers = new Set('1234567890'.split(''));
const lowerCases = new Set('abcdefghijklmnopqrstuvwxyz'.split(''));
const upperCases = new Set('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
const specialChars = new Set('!@#$%^&*()_+'.split(''));

function stringMissingFromSet(str: string, set: Set<string>) {
  if (str.split('').some((char) => set.has(char))) {
    return false;
  }
  return true;
}

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Please enter at least 8 characters')
    .refine(
      (val) => {
        if (stringMissingFromSet(val, numbers)) {
          return false;
        }
        if (stringMissingFromSet(val, lowerCases)) {
          return false;
        }
        if (stringMissingFromSet(val, upperCases)) {
          return false;
        }
        if (stringMissingFromSet(val, specialChars)) {
          return false;
        }
        return true;
      },
      (val) => {
        if (stringMissingFromSet(val, numbers)) {
          return {
            message: 'At least 1 number is required',
          };
        }
        if (stringMissingFromSet(val, lowerCases)) {
          return {
            message: 'At least 1 lower case is required',
          };
        }
        if (stringMissingFromSet(val, upperCases)) {
          return {
            message: 'At least 1 upper case is required',
          };
        }
        if (stringMissingFromSet(val, specialChars)) {
          return {
            message: 'At least 1 special character is required',
          };
        }
        return {
          message: '',
        };
      }
    ),
});

export type TLogin = z.infer<typeof loginSchema>;

export const loginResponseSchema = z.object({
  token: z.string(),
});
