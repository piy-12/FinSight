export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validators = {
  required: (message = 'This field is required') => ({
    required: message,
  }),
  email: {
    required: 'Email is required',
    pattern: {
      value: EMAIL_REGEX,
      message: 'Enter a valid email address',
    },
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters',
    },
  },
  name: {
    required: 'Name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters',
    },
  },
  positiveAmount: {
    required: 'Amount is required',
    validate: (value: string | number) =>
      Number(value) > 0 || 'Amount must be greater than zero',
  },
};
