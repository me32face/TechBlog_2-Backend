const axios = require("axios");
const PostModel = require("./PostSchema");


// In Backend/Posts/AIController.js
exports.getSummary = (req, res) => {
  const { content } = req.body;
  axios.post(
    'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
    { inputs: content },
    {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_HF_TOKEN}` // Use .env on server safely
      }
    }
  ).then(response => {
    res.json(response.data);
  }).catch(err => {
    console.error("Summary API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch summary" });
  });
};



exports.getRelatedPosts = (req, res) => {
  const { text, currentPostId } = req.body;

  axios
    .post("https://api-inference.huggingface.co/embeddings/sentence-transformers/all-MiniLM-L6-v2", {
      inputs: text
    }, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_HF_TOKEN}`
      }
    })
    .then(response => {
      const inputEmbedding = response.data[0];

      PostModel.find({ _id: { $ne: currentPostId } })
        .then(posts => {
          const scoredPosts = posts.map(post => {
            const score = cosineSimilarity(inputEmbedding, post.embedding || []);
            return { ...post.toObject(), score };
          });

          const sorted = scoredPosts.sort((a, b) => b.score - a.score).slice(0, 4);
          res.status(200).json({ data: sorted });
        });
    })
    .catch(err => {
      console.error("Related post error:", err.message);
      res.status(500).json({ error: "Related post embedding failed." });
    });
};

// Helper to compare embeddings
function cosineSimilarity(vec1, vec2) {
  if (!vec1 || !vec2 || vec1.length !== vec2.length) return 0;
  const dot = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0);
  const normA = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));
  return dot / (normA * normB || 1);
}
