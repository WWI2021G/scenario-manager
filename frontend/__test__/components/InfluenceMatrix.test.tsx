import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InfluencMatrixComponent from '@/components/main/InfluencingMatrix';
import '@testing-library/jest-dom';

test('renders Influence Matrix', () => {
  render(<InfluencMatrixComponent />);
  expect(screen.getByText('Einflussmatrix')).toBeInTheDocument();
});

test('renders key factors in the table headers', () => {
  render(<InfluencMatrixComponent />);
  const keyFactors = ['Factor1', 'Factor2', 'Factor3', 'Factor4', 'Factor5'];
  keyFactors.forEach(factor => {
    expect(screen.getAllByText(factor).length).toBeGreaterThan(0);
  });
});

test('does not allow input for same factor row and column', () => {
  render(<InfluencMatrixComponent />);
  const sameFactorCells = screen.getAllByText('-');
  expect(sameFactorCells.length).toBe(5);
});

test('allows entering values between 0 and 3', () => {
  render(<InfluencMatrixComponent />);
  const selectElements = screen.getAllByRole('combobox');
  fireEvent.mouseDown(selectElements[0]); // Open the dropdown
  const options = screen.getAllByRole('option');
  options.forEach((option) => {
    expect([0, 1, 2, 3]).toContain(Number(option.textContent));
  });
});

test('updates the matrix value on change', () => {
  render(<InfluencMatrixComponent />);
  const selectElements = screen.getAllByRole('combobox');

  // Simulate changing a value in the matrix
  fireEvent.mouseDown(selectElements[0]); // Open the dropdown
  const option = screen.getByRole('option', { name: '2' });
  fireEvent.click(option);

  // Verify the value has changed
  expect(selectElements[0]).toHaveTextContent('2');
});
