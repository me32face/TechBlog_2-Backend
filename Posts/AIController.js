const axios = require("axios");
const PostModel = require("./PostModel"); // adjust if path is different

// Utility to calculate cosine similarity
function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

exports.getRelatedPosts = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Missing text" });

  try {
    // 1. Get embedding of current post
    const response = await axios.post(
      "https://api-inference.huggingface.co/embeddings/sentence-transformers/all-MiniLM-L6-v2",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_HF_TOKEN}`,
        },
      }
    );
    const currentEmbedding = response.data;

    // 2. Get all other posts
    const allPosts = await PostModel.find({}).populate("userDetails");

    // 3. Get embeddings for other posts
    const relatedData = await Promise.all(
      allPosts.map(async (post) => {
        try {
          const embedRes = await axios.post(
            "https://api-inference.huggingface.co/embeddings/sentence-transformers/all-MiniLM-L6-v2",
            { inputs: post.content },
            {
              headers: {
                Authorization: `Bearer ${process.env.REACT_APP_HF_TOKEN}`,
              },
            }
          );
          return {
            post,
            similarity: cosineSimilarity(currentEmbedding, embedRes.data),
          };
        } catch (e) {
          return null;
        }
      })
    );

    // 4. Filter and sort by similarity
    const topRelated = relatedData
      .filter(Boolean)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)
      .map((item) => item.post);

    res.status(200).json({ related: topRelated });
  } catch (err) {
    console.error("RelatedPosts error:", err.message);
    res.status(500).json({ error: "Failed to fetch related posts" });
  }
};
