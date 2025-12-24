export const createPost = (req, res) => {
  res.json({ message: "Post created" });
};

export const getMyPosts = (req, res) => {
  res.json({ posts: [] });
};
