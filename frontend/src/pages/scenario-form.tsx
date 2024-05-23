import React, { useState } from 'react';
import axios from 'axios';

interface ScenarioResult {
    outcome: string;
}

const ScenarioForm: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [result, setResult] = useState<ScenarioResult | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const response = await axios.post('/api/scenario', { input });
        setResult(response.data);
    };

    return (
        <div className="container mx-auto p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                    Submit
                </button>
            </form>
            {result && <div className="mt-4 p-4 bg-green-100">{result.outcome}</div>}
        </div>
    );
};

export default ScenarioForm;

