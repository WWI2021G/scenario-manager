import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TableHover from '@/components/sub/ProjectTable';
import { ScenarioProject } from '@/types';

describe('TableHover', () => {
  const projects: ScenarioProject[] = [
    { name: 'Projekt Shell', description: '', influencingFactors: [], keyFactors: [], futureProjections: [], projectionBundles: [], scenarioType: 'type1' },
    { name: 'Projekt BMW', description: '', influencingFactors: [], keyFactors: [], futureProjections: [], projectionBundles: [], scenarioType: 'type2' },
    { name: 'Projekt Festool', description: '', influencingFactors: [], keyFactors: [], futureProjections: [], projectionBundles: [], scenarioType: 'type3' },
  ];

  test('renders the table with header', () => {
    render(<TableHover projects={projects} />);

    expect(screen.getByText('PID')).toBeInTheDocument();
    expect(screen.getByText('Projekttitel')).toBeInTheDocument();
    expect(screen.getByText('Datum')).toBeInTheDocument();
  });

  test('displays project data correctly', () => {
    render(<TableHover projects={projects} />);

    projects.forEach((project, index) => {
      expect(screen.getByText(project.name)).toBeInTheDocument();
      expect(screen.getByText((index + 1).toString())).toBeInTheDocument();
    });

    // Check if each date is displayed correctly
    const dateElements = screen.getAllByText(new RegExp('\\d{1,2}/\\d{1,2}/\\d{4}'));
    expect(dateElements.length).toBe(projects.length);
  });

  test('renders links and icons correctly', () => {
    render(<TableHover projects={projects} />);

    projects.forEach((project) => {
      expect(screen.getByText(project.name).closest('a')).toHaveAttribute('href', '');
    });

    expect(screen.getAllByTestId('MoreHorizIcon').length).toBe(projects.length);
  });
});
