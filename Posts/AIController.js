const axios = require("axios");

exports.getEmbeddings = (req, res) => {
  const inputText = req.body.text;

  axios.post("https://api-inference.huggingface.co/embeddings/sentence-transformers/all-MiniLM-L6-v2", {
    inputs: inputText
  }, {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_HF_TOKEN}`
    }
  })
  .then(response => {
    res.status(200).json({ embeddings: response.data });
  })
  .catch(error => {
    console.error("Embedding error:", error.message);
    res.status(500).json({ error: "Failed to generate embeddings" });
  });
};

// 👇 ADD THIS FUNCTION!
exports.getRelatedPosts = (req, res) => {
  const text = req.body.text;
  if (!text) return res.status(400).json({ error: "Missing text" });

  res.status(200).json({ message: "This is a placeholder for related posts" });
};
