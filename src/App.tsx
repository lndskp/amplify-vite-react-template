import { useState } from "react";
import { generateClient } from "aws-amplify/data";
import { uploadData } from "aws-amplify/storage";
import { post } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

function App() {
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string>("");

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!image || !prompt.trim()) {
      alert("Please provide both an image and a description");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate unique ID for this job
      const jobId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Upload image to S3
      const imageKey = `uploads/${jobId}-original.jpg`;
      await uploadData({
        key: imageKey,
        data: image,
        options: {
          contentType: image.type
        }
      });
      
      // Save job record to DynamoDB
      await client.models.RenovationJob.create({
        jobId,
        prompt,
        imageKey,
        status: "pending"
      });
      
      // Call Lambda function
      const response = await post({
        apiName: 'renovationAPI',
        path: '/process-job',
        options: {
          body: {
            jobId,
            imageKey,
            prompt
          }
        }
      });
      
      const result = await response.response;
      const resultData = await result.body.json();
      
      // Get the result image URL
      if (resultData.resultImageKey) {
        setResultImage(resultData.resultImageUrl);
      }
      
    } catch (error) {
      console.error("Error processing job:", error);
      alert("Error processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main>
      <h1>Home Renovation AI</h1>
      
      <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
        <div style={{ marginBottom: "24px" }}>
          <label htmlFor="image">Upload house photo</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ 
              marginTop: "8px",
              padding: "12px",
              border: "1px solid #d0dad0",
              borderRadius: "8px",
              background: "white"
            }}
          />
        </div>

        {imagePreview && (
          <div style={{ marginBottom: "24px" }}>
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ 
                maxWidth: "100%", 
                maxHeight: "300px", 
                borderRadius: "8px",
                border: "1px solid #d0dad0"
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: "24px" }}>
          <label htmlFor="prompt">Describe the work you want done</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Add a new roof, paint the house white, add landscaping..."
            rows={4}
            style={{ marginTop: "8px" }}
          />
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          style={{
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? "not-allowed" : "pointer"
          }}
        >
          {isLoading ? "Processing..." : "Generate Edit"}
        </button>
      </form>

      {resultImage && (
        <div style={{ marginTop: "40px" }}>
          <h2>Result</h2>
          <img 
            src={resultImage} 
            alt="Renovation result" 
            style={{ 
              maxWidth: "100%", 
              borderRadius: "8px",
              border: "1px solid #d0dad0"
            }}
          />
        </div>
      )}
    </main>
  );
}

export default App;
