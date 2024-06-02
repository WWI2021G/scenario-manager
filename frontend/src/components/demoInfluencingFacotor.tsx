import React, { useState } from 'react';
import axios from 'axios';

const InfluencingFactorForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [influencingArea, setInfluencingArea] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/scenario/influencingFactor', {
        name,
        description,
        influencingArea,
      });
      if (response.status === 201) {
        setResponseMessage('Data submitted successfully!');
      } else {
        setResponseMessage(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      setResponseMessage('Error submitting data.');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="influencingArea" className="block text-sm font-medium text-gray-700">Influencing Area</label>
          <input
            id="influencingArea"
            type="text"
            value={influencingArea}
            onChange={(e) => setInfluencingArea(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
        {responseMessage && <div className="mt-4 text-green-500">{responseMessage}</div>}
      </form>
    </div>
  );
};

export default InfluencingFactorForm;
