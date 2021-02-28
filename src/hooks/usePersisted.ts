import { useState } from "react";

export const usePersisted = function <T>(
  key: string,
  initialValue?: T,
): [T, (newValue: T) => void] {
  const storedValue = localStorage.getItem(key);
  const [value, setValue] = useState<T>();
  let effectiveValue: T = value as T;
  if (value === undefined) {
    if (storedValue === null) {
      effectiveValue = initialValue as T;
    } else {
      try {
        effectiveValue = JSON.parse(storedValue);
      } catch (err) {
        // In this case, T should be string
        effectiveValue = (storedValue as unknown) as T;
      }
    }
  }

  return [
    effectiveValue,
    (newValue: T) => {
      localStorage.setItem(key, JSON.stringify(newValue));
      setValue(newValue);
    },
  ];
};
