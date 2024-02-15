import { errorHandler } from "../utils/error.js";
import Post from "../model/post.modal.js";


export const createPost = async (req, res, next) => {
  
  if (!req.user.isAdmin) {
    return next(errorHandler("You are not an admin", 401));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler("Title and content are required", 400));
  }
  const slug = req.body.title.toLowerCase().split(" ").join("-") + "-" + Date.now();
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    slug: slug,
    author: req.body.Id,
    category: req.body.category ? req.body.category : "uncategorized",
    image: req.body.image
  });
    try {
        const savedPost = await post.save();
        res.status(201).json({
            success: true,
            data: savedPost
        });

    } catch (error) {
        next(error);
    }
};

// get all posts

export const getAllPostofAdmin = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex || 0);
    const limit = parseInt(req.query.limit || 9);
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    const posts = await Post.find({
      ...(req.query.Id && { author: req.query.Id }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.PostId && { _id: req.query.PostId }),
      ...(req.query.searchTerm &&
        {
          $or: [
            { title: { $regex: req.query.searchTerm, $options: 'i' } },
            { content: { $regex: req.query.searchTerm, $options: 'i' } }
          ]
        })
    }).sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);
    const total = await Post.countDocuments();
    const now= new Date();
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

    const lastMonth = await Post.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    res.status(200).json({
      success: true,
      data: posts,
      total: total,
      lastMonth: lastMonth
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }
};
