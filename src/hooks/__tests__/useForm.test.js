import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm } from '../useForm';
import { validators } from '../../utils/validation';

describe('useForm Hook', () => {
  const mockValidationSchema = (values) => {
    const errors = {};
    if (!values.email) errors.email = 'Email is required';
    if (!values.password) errors.password = 'Password is required';
    return errors;
  };

  it('initializes with default values', () => {
    const { result } = renderHook(() => useForm({ email: '', password: '' }));

    expect(result.current.values).toEqual({ email: '', password: '' });
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it('updates values correctly', () => {
    const { result } = renderHook(() => useForm({ email: '' }));

    act(() => {
      result.current.setValue('email', 'test@example.com');
    });

    expect(result.current.values.email).toBe('test@example.com');
  });

  it('handles input changes', () => {
    const { result } = renderHook(() => useForm({ email: '' }));

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com' }
      });
    });

    expect(result.current.values.email).toBe('test@example.com');
  });

  it('clears errors when input changes', () => {
    const { result } = renderHook(() => useForm({ email: '' }, mockValidationSchema));

    // Set an error first
    act(() => {
      result.current.setError('email', 'Email is required');
    });

    expect(result.current.errors.email).toBe('Email is required');

    // Change input should clear the error
    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@example.com' }
      });
    });

    expect(result.current.errors.email).toBeUndefined();
  });

  it('validates form correctly', () => {
    const { result } = renderHook(() => useForm({ email: '', password: '' }, mockValidationSchema));

    let errors;
    act(() => {
      errors = result.current.validate();
    });

    expect(errors).toEqual({
      email: 'Email is required',
      password: 'Password is required'
    });
  });

  it('validates individual fields', () => {
    const { result } = renderHook(() => useForm({ email: '' }, mockValidationSchema));

    let error;
    act(() => {
      error = result.current.validateField('email', '');
    });

    expect(error).toBe('Email is required');
  });

  it('checks if form is valid', () => {
    const { result } = renderHook(() => useForm({ email: '', password: '' }, mockValidationSchema));

    expect(result.current.isValid()).toBe(false);

    act(() => {
      result.current.setValue('email', 'test@example.com');
      result.current.setValue('password', 'password123');
    });

    expect(result.current.isValid()).toBe(true);
  });

  it('handles form submission', async () => {
    const mockSubmit = vi.fn();
    const { result } = renderHook(() => useForm({ email: 'test@example.com', password: 'password123' }, mockValidationSchema));

    const handleSubmit = result.current.handleSubmit(mockSubmit);

    await act(async () => {
      await handleSubmit({ preventDefault: vi.fn() });
    });

    expect(mockSubmit).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
  });

  it('prevents submission with validation errors', async () => {
    const mockSubmit = vi.fn();
    const { result } = renderHook(() => useForm({ email: '', password: '' }, mockValidationSchema));

    const handleSubmit = result.current.handleSubmit(mockSubmit);

    await act(async () => {
      await handleSubmit({ preventDefault: vi.fn() });
    });

    expect(mockSubmit).not.toHaveBeenCalled();
    expect(result.current.errors).toEqual({
      email: 'Email is required',
      password: 'Password is required'
    });
  });

  it('resets form correctly', () => {
    const initialValues = { email: '', password: '' };
    const { result } = renderHook(() => useForm(initialValues));

    // Change values and add errors
    act(() => {
      result.current.setValue('email', 'test@example.com');
      result.current.setError('email', 'Some error');
    });

    expect(result.current.values.email).toBe('test@example.com');
    expect(result.current.errors.email).toBe('Some error');

    // Reset form
    act(() => {
      result.current.reset();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it('handles password confirmation validation', () => {
    const schemaWithPasswordMatch = (values) => {
      const errors = {};
      if (values.password && values.confirmPassword) {
        const matchError = validators.passwordMatch(values.password, values.confirmPassword);
        if (matchError) errors.confirmPassword = matchError;
      }
      return errors;
    };

    const { result } = renderHook(() => useForm(
      { password: 'password123', confirmPassword: 'different' },
      schemaWithPasswordMatch
    ));

    let errors;
    act(() => {
      errors = result.current.validate();
    });

    expect(errors.confirmPassword).toBe('Passwords do not match');
  });
});
