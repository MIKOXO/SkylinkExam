import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FormField from '../FormField';

describe('FormField Component', () => {
  const defaultProps = {
    label: 'Test Field',
    id: 'test-field',
    name: 'testField',
    value: '',
    onChange: vi.fn(),
  };

  it('renders text input by default', () => {
    render(<FormField {...defaultProps} />);
    
    expect(screen.getByLabelText(/test field/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  });

  it('renders password input when type is password', () => {
    render(<FormField {...defaultProps} type="password" />);
    
    expect(screen.getByLabelText(/test field/i)).toBeInTheDocument();
    // Password input should be rendered by PasswordInput component
  });

  it('renders textarea when type is textarea', () => {
    render(<FormField {...defaultProps} type="textarea" />);
    
    expect(screen.getByLabelText(/test field/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('shows required indicator when required is true', () => {
    render(<FormField {...defaultProps} required />);
    
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('*')).toHaveClass('text-red-500');
  });

  it('displays error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    render(<FormField {...defaultProps} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toHaveClass('text-red-600');
  });

  it('applies error styling when error is present', () => {
    render(<FormField {...defaultProps} error="Error message" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-300');
  });

  it('handles input changes', () => {
    const handleChange = vi.fn();
    render(<FormField {...defaultProps} onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<FormField {...defaultProps} className="custom-class" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('sets placeholder text', () => {
    const placeholder = 'Enter your text here';
    render(<FormField {...defaultProps} placeholder={placeholder} />);
    
    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  it('sets autoComplete attribute', () => {
    render(<FormField {...defaultProps} autoComplete="email" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('autocomplete', 'email');
  });

  it('renders email input type correctly', () => {
    render(<FormField {...defaultProps} type="email" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });
});
