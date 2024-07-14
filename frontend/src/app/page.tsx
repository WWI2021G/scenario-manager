'use client';
// pages/index.tsx
import React from 'react';
import LoginForm from '@/components/sub/LoginForm';
import "./globals.css";

const Home: React.FC = () => {
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default Home;
