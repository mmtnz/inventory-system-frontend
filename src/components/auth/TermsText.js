import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const TermsText = () => {
    const [text, setText] = useState("");

    useEffect(() => {
        fetch("/terms.txt") // Update with your actual filename
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load file");
                }
                return response.text();
            })
            .then((data) => setText(data))
            .catch((error) => console.error("Error loading the file:", error));
    }, []);


  return (
    <div className="terms-container">
    {/* <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}> */}
      {/* <h2>Terms and Conditions</h2> */}
      {/* <input type="file" accept=".txt" onChange={handleFileUpload} /> */}
      <div className="terms-text">
      {/* <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px", borderRadius: "5px", overflowY: "auto", height: "400px" }}> */}
        {text && (
            <ReactMarkdown>{text}</ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default TermsText;
