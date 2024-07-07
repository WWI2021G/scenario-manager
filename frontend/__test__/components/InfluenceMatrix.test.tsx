import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InfluencMatrixComponent from '@/components/main/InfluencingMatrix';
import '@testing-library/jest-dom';

jest.mock('next/router', () => jest.requireActual('next-router-mock'))

test('renders Influence Matrix', () => {
  render(<InfluencMatrixComponent />);
  expect(screen.getByText('Einflussmatrix')).toBeInTheDocument();
});
