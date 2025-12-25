export const createPost = (req, res) => {
  res.json({
    message: "Post created",
    user: req.user
  });
};

export const getMyPosts = (req, res) => {
  res.json({
    message: "My posts fetched",
    user: req.user
  });
};
