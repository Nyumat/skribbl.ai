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

export function ComputeClipEmbeddingsButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const computeClipEmbeddings = api.judge.getScore.useMutation();

  const handleComputeEmbeddings = async () => {
    setLoading(true);
    try {
      // Hardcoded image path (relative to the public folder)
      const imagePath = "preview.png"; // Update this path to your image

      // Hardcoded text
      const text = "skribble.io is okay";

      // Fetch the image from the path
      const response = await fetch(imagePath);
      if (!response.ok) {
        throw new Error("Failed to fetch the image.");
      }

      // Read the image as a Blob
      const blob = await response.blob();

      // Convert the Blob to a base64-encoded string
      const base64Image = await blobToBase64(blob);

      // Call the computeClipEmbeddings mutation
      const responseData = await computeClipEmbeddings.mutateAsync({
        image: base64Image,
        text: text,
      });

      setResult(responseData);
      //   alert("CLIP embeddings computed successfully!");
      console.log(responseData);
      alert(responseData);
    } catch (error) {
      console.error("Error computing CLIP embeddings:", error);
      alert("Failed to compute embeddings.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert Blob to base64-encoded string
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Remove the data URL prefix to get only the base64 string
        const base64String = result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleComputeEmbeddings}
        disabled={loading}
        className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
      >
        {loading ? "Computing..." : "Compute CLIP Embeddings"}
      </button>
      {result && (
        <pre className="mt-4 overflow-x-auto rounded bg-gray-100 p-2">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
