import React from 'react';
import EditInfluencingFactorForm from '@/components/main/EditInfluencingFactor';
import { useRouter } from 'next/router';

const EditInfluencingFactorPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <EditInfluencingFactorForm id={id} />;
};

export default EditInfluencingFactorPage;

