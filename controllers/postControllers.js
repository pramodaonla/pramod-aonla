export const createPost = (req, res) => {
  res.json({
    message: "Post created successfully",
    user: req.user || null
  });
};

export const getMyPosts = (req, res) => {
  res.json({
    message: "My posts fetched",
    posts: []
  });
};
