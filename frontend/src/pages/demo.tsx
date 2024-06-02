import React from 'react';
import InfluencingFactorForm from '../components/demoInfluencingFacotor';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Influencing Factor Form</h1>
      <InfluencingFactorForm />
    </div>
  );
};

export default Home;
