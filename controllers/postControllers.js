export const createPost = (req, res) => {
  res.json({
    success: true,
    message: "Post created",
    user: req.user || null
  });
};

export const getMyPosts = (req, res) => {
  res.json({
    success: true,
    posts: []
  });
};
