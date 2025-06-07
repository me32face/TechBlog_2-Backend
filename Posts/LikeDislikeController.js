const LikeDislike = require("./LikeDislikeSchema");

const likeOrDislikePost = (req, res) => {
  const { postId, userId, browserId, action: userAction } = req.body;

  if (!["like", "dislike", "remove"].includes(userAction)) {
    return res.json({
      msg: "Invalid action",
      status: 400,
    });
  }

  const identifier = userId || browserId;
  if (!identifier) {
    return res.json({
      msg: "User or browser ID required",
      status: 400,
    });
  }

  const query = {
    postId,
    ...(userId ? { userId } : { browserId }),
  };

  LikeDislike.findOne(query)
    .then((existing) => {
      if (userAction === "remove") {
        if (existing) {
          return LikeDislike.findByIdAndDelete(existing._id).then(() => {
            return res.json({
              msg: "Reaction removed",
              status: 200,
            });
          });
        } else {
          return res.json({
            msg: "No reaction to remove",
            status: 200,
          });
        }
      }

      if (existing) {
        if (existing.action === userAction) {
          return LikeDislike.findByIdAndDelete(existing._id).then(() => {
            return res.json({
              msg: `Removed ${userAction}`,
              status: 200,
            });
          });
        } else {
          existing.action = userAction;
          return existing.save().then((updated) => {
            return res.json({
              msg: `Changed to ${userAction}`,
              status: 200,
              data: updated,
            });
          });
        }
      } else {
        const newEntry = new LikeDislike({
          postId,
          action: userAction,
          ...(userId ? { userId } : { browserId }),
        });

        return newEntry.save().then((saved) => {
          return res.json({
            msg: `${userAction} added`,
            status: 200,
            data: saved,
          });
        });
      }
    })
    .catch((err) => {
      console.error("Like/Dislike Error:", err);
      res.json({
        msg: "Server error",
        status: 500,
        err,
      });
    });
};

const getLikesDislikes = (req, res) => {
  const { postId } = req.params;

  Promise.all([
    LikeDislike.countDocuments({ postId, action: "like" }),
    LikeDislike.countDocuments({ postId, action: "dislike" }),
  ])
    .then(([likes, dislikes]) => {
      res.json({
        msg: "Counts fetched",
        status: 200,
        data: { likes, dislikes },
      });
    })
    .catch((err) => {
      console.error("Fetch Like/Dislike Error:", err);
      res.json({
        msg: "Error fetching counts",
        status: 500,
        err,
      });
    });
};

module.exports = {
  likeOrDislikePost,
  getLikesDislikes,
};
