"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function AddEmbeddingsButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const calculateAndStore = api.embedding.calculateAndStore.useMutation();

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await calculateAndStore.mutateAsync({
        embedding1: [0.1, 0.2, 0.3, 0.4],
        embedding2: [0.5, 0.6, 0.7, 0.8],
      });
      setResult(response);
      alert("Embeddings added successfully!");
    } catch (error) {
      console.error("Error adding embeddings:", error);
      alert("Failed to add embeddings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleClick}
        disabled={loading}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        {loading ? "Adding..." : "Add Sample Embeddings"}
      </button>
      {result && (
        <pre className="mt-4 rounded bg-gray-100 p-2">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
