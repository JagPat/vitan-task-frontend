import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginDialog from '../../src/components/LoginDialog';

// Mock the API client
jest.mock('../../src/api/whatsTaskClient', () => ({
  whatsTaskClient: {
    loginWithOAuth: jest.fn(),
    sendVerificationCode: jest.fn(),
    verifyCode: jest.fn(),
  }
}));

describe('LoginDialog Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  test('renders all authentication tabs', () => {
    render(<LoginDialog open={true} onOpenChange={jest.fn()} />);
    
    expect(screen.getByText('WhatsApp')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('OAuth')).toBeInTheDocument();
  });

  test('OAuth tab renders correctly with form fields', async () => {
    const user = userEvent.setup();
    render(<LoginDialog open={true} onOpenChange={jest.fn()} />);
    
    await user.click(screen.getByText('OAuth'));
    
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login with OAuth')).toBeInTheDocument();
  });

  test('validates email format in OAuth form', async () => {
    const user = userEvent.setup();
    const { whatsTaskClient } = require('../../src/api/whatsTaskClient');
    
    whatsTaskClient.loginWithOAuth.mockResolvedValue({
      success: false,
      error: 'Please enter a valid email address'
    });

    render(<LoginDialog open={true} onOpenChange={jest.fn()} />);
    
    await user.click(screen.getByText('OAuth'));
    await user.type(screen.getByLabelText('Email Address'), 'invalid-email');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByText('Login with OAuth'));
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  test('validates password length in OAuth form', async () => {
    const user = userEvent.setup();
    const { whatsTaskClient } = require('../../src/api/whatsTaskClient');
    
    whatsTaskClient.loginWithOAuth.mockResolvedValue({
      success: false,
      error: 'Password must be at least 6 characters long'
    });

    render(<LoginDialog open={true} onOpenChange={jest.fn()} />);
    
    await user.click(screen.getByText('OAuth'));
    await user.type(screen.getByLabelText('Email Address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), '123');
    await user.click(screen.getByText('Login with OAuth'));
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters long')).toBeInTheDocument();
    });
  });

  test('clears localStorage on invalid credentials', async () => {
    const user = userEvent.setup();
    const { whatsTaskClient } = require('../../src/api/whatsTaskClient');
    
    whatsTaskClient.loginWithOAuth.mockResolvedValue({
      success: false,
      error: 'Invalid credentials'
    });

    render(<LoginDialog open={true} onOpenChange={jest.fn()} />);
    
    await user.click(screen.getByText('OAuth'));
    await user.type(screen.getByLabelText('Email Address'), 'test@invalid.com');
    await user.type(screen.getByLabelText('Password'), 'wrongpass');
    await user.click(screen.getByText('Login with OAuth'));
    
    await waitFor(() => {
      expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('currentUser');
    });
  });

  test('prevents modal closure with onPointerDownOutside', () => {
    const onOpenChange = jest.fn();
    render(<LoginDialog open={true} onOpenChange={onOpenChange} />);
    
    // Try to click outside the modal
    const backdrop = screen.getByRole('dialog').parentElement;
    fireEvent.pointerDown(backdrop);
    
    // Modal should not close
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test('prevents modal closure with Escape key', () => {
    const onOpenChange = jest.fn();
    render(<LoginDialog open={true} onOpenChange={onOpenChange} />);
    
    // Try to press Escape
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    
    // Modal should not close
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  test('WhatsApp verification flow works correctly', async () => {
    const user = userEvent.setup();
    const { whatsTaskClient } = require('../../src/api/whatsTaskClient');
    
    whatsTaskClient.sendVerificationCode.mockResolvedValue({
      success: true,
      message: 'Verification code sent'
    });

    render(<LoginDialog open={true} onOpenChange={jest.fn()} />);
    
    // Should be on WhatsApp tab by default
    const phoneInput = screen.getByPlaceholderText(/phone/i);
    expect(phoneInput).toBeInTheDocument();
    
    await user.type(phoneInput, '8320303515');
    await user.click(screen.getByText('Verify Account'));
    
    await waitFor(() => {
      expect(whatsTaskClient.sendVerificationCode).toHaveBeenCalledWith('8320303515');
    });
  });

  test('successful OAuth login stores auth data', async () => {
    const user = userEvent.setup();
    const { whatsTaskClient } = require('../../src/api/whatsTaskClient');
    
    const mockResponse = {
      success: true,
      data: {
        token: 'mock-jwt-token',
        user: { id: 1, email: 'test@example.com', name: 'Test User' }
      }
    };
    
    whatsTaskClient.loginWithOAuth.mockResolvedValue(mockResponse);

    render(<LoginDialog open={true} onOpenChange={jest.fn()} />);
    
    await user.click(screen.getByText('OAuth'));
    await user.type(screen.getByLabelText('Email Address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByText('Login with OAuth'));
    
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('authToken', 'mock-jwt-token');
      expect(sessionStorage.setItem).toHaveBeenCalledWith('currentUser', JSON.stringify(mockResponse.data.user));
    });
  });
});