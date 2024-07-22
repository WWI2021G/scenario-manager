import React from "react";
import EditInfluencingFactorForm from "@/components/main/EditInfluencingFactor";
import { useRouter } from "next/router";

const EditInfluencingFactorPage = () => {
  const router = useRouter();
  const { name } = router.query; // Extract 'name' from the query

  // Ensure 'name' is a string before passing it to the form
  if (typeof name !== "string") {
    return <div>Invalid influencing factor name.</div>;
  }

  return <EditInfluencingFactorForm ifName={name} />;
};

export default EditInfluencingFactorPage;
