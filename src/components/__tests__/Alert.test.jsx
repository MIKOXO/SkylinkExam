import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Alert from '../Alert';

describe('Alert Component', () => {
  it('renders with default info type', () => {
    render(<Alert>Test message</Alert>);
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-blue-50');
  });

  it('renders different alert types with correct styling', () => {
    const { rerender } = render(<Alert type="error">Error message</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('bg-red-50');

    rerender(<Alert type="success">Success message</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('bg-green-50');

    rerender(<Alert type="warning">Warning message</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('bg-yellow-50');

    rerender(<Alert type="info">Info message</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('bg-blue-50');
  });

  it('renders title when provided', () => {
    render(<Alert title="Alert Title">Alert content</Alert>);
    
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByText('Alert content')).toBeInTheDocument();
  });

  it('renders close button when onClose is provided', () => {
    const handleClose = vi.fn();
    render(<Alert onClose={handleClose}>Closable alert</Alert>);
    
    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
    
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not render close button when onClose is not provided', () => {
    render(<Alert>Non-closable alert</Alert>);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Alert className="custom-alert">Custom alert</Alert>);
    
    expect(screen.getByRole('alert')).toHaveClass('custom-alert');
  });

  it('renders appropriate icons for each type', () => {
    const { rerender } = render(<Alert type="error">Error</Alert>);
    expect(screen.getByRole('alert')).toContainHTML('svg');

    rerender(<Alert type="success">Success</Alert>);
    expect(screen.getByRole('alert')).toContainHTML('svg');

    rerender(<Alert type="warning">Warning</Alert>);
    expect(screen.getByRole('alert')).toContainHTML('svg');

    rerender(<Alert type="info">Info</Alert>);
    expect(screen.getByRole('alert')).toContainHTML('svg');
  });

  it('has correct text colors for each type', () => {
    const { rerender } = render(<Alert type="error">Error</Alert>);
    expect(screen.getByText('Error')).toHaveClass('text-red-700');

    rerender(<Alert type="success">Success</Alert>);
    expect(screen.getByText('Success')).toHaveClass('text-green-700');

    rerender(<Alert type="warning">Warning</Alert>);
    expect(screen.getByText('Warning')).toHaveClass('text-yellow-700');

    rerender(<Alert type="info">Info</Alert>);
    expect(screen.getByText('Info')).toHaveClass('text-blue-700');
  });
});
