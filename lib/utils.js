import { clsx } from "clsx"
import { create } from 'twrnc'

export const tw = create({
  theme: {
    extend: {
      colors: {
        primary: 'blue',
        secondary: 'gray',
        background: 'white',
        foreground: 'black',
        muted: 'lightgray',
        accent: 'purple'
      }
    }
  }
})

export function cn(...inputs) {
  // Flatten and filter out falsy values
  const classes = inputs.reduce((acc, input) => {
    if (typeof input === 'string') {
      acc.push(input);
    } else if (typeof input === 'object' && input !== null) {
      Object.entries(input).forEach(([key, value]) => {
        if (value) acc.push(key);
      });
    }
    return acc;
  }, []);

  return tw.style(classes.join(' '));
}
