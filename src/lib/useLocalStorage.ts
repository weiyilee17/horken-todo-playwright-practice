import { ZodSchema } from 'zod';

// Not being used
export const useLocalStorage = <T>(key: string, validator: ZodSchema<T>) => {
  const setItem = (value: unknown) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(err);
    }
  };

  const getItem = ({ defaultValue }: { defaultValue: T }): T => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) {
        return defaultValue;
      }

      const parsedItem = JSON.parse(item);
      const { success, error, data } = validator.safeParse(parsedItem);

      if (!success) {
        console.error(error);
        return defaultValue;
      }

      return data;
    } catch (err) {
      console.error(err);
      return defaultValue;
    }
  };

  const removeItem = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      console.error(err);
    }
  };

  return { getItem, setItem, removeItem };
};
