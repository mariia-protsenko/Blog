import PostModel from '../models/Post.js';
import CommentModel from '../models/Comment.js';

export const getComments = async (req, res) => {
  try {
    const comments = await CommentModel.find()
      .limit(5)
      .populate({
        path: 'user',
        select: ['fullName', 'avatarUrl'],
      })
      .exec();

    res.json(comments);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Failed to get comments',
    });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await CommentModel.find({ post: postId })
      .populate({
        path: 'user',
        select: ['fullName', 'avatarUrl'],
      })
      .exec();

    res.json(comments);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Failed to get comments',
    });
  }
};

export const create = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = PostModel.findById(postId);

    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
      post: postId,
    });

    const comment = await doc.save();

    res.json(comment);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Failed to create a comment',
    });
  }
};
