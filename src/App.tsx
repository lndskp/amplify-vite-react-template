import { useState } from "react";

function App() {
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!image || !prompt.trim()) {
      alert("Please provide both an image and a description");
      return;
    }
    
    // TODO: Call Lambda function here
    console.log("Image:", image);
    console.log("Prompt:", prompt);
  }

  return (
    <main style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Home Renovation AI</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="image">Upload house photo:</label>
          <br />
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginTop: "8px" }}
          />
        </div>

        {imagePreview && (
          <div style={{ marginBottom: "20px" }}>
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px" }}
            />
          </div>
        )}

        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="prompt">Describe the work you want done:</label>
          <br />
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Add a new roof, paint the house white, add landscaping..."
            rows={4}
            style={{ 
              width: "100%", 
              marginTop: "8px", 
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}
          />
        </div>

        <button 
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Generate Edit
        </button>
      </form>
    </main>
  );
}

export default App;
