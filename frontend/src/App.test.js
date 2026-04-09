import { render, screen } from '@testing-library/react';
import App from './App';

test('renders QR Attendance System title', () => {
  render(<App />);
  const titleElement = screen.getByText(/QR Attendance System/i);
  expect(titleElement).toBeInTheDocument();
});
