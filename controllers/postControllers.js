export const createPost = async (req, res) => {
  res.json({
    message: "Post created successfully",
    user: req.user
  });
};

export const getMyPosts = async (req, res) => {
  res.json({
    message: "My posts fetched",
    posts: []
  });
};
