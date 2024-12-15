import PostModel from '../models/Post.js';
import CommentModel from '../models/Comment.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((post) => post.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Failed to get posts',
    });
  }
};

export const getPostsWithTag = async (req, res) => {
  try {
    const postTag = req.params.tag;
    const posts = await PostModel.find()
      .populate({
        path: 'user',
        select: ['fullName', 'avatarUrl'],
      })
      .exec();

    const filteredPosts = posts.filter((post) => post.tags.includes(postTag));

    res.json(filteredPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      messgae: 'Failed to get posts with needed tag',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const { sortValue } = req.params;
    let sortQuery = {};
    sortQuery[sortValue] = -1;

    const posts = await PostModel.find()
      .populate({
        path: 'user',
        select: ['fullName', 'avatarUrl'],
      })
      .sort(sortQuery)
      .exec();

    res.json(posts);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Failed to get posts',
    });
  }
};

export const getOne = (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: {
          viewsCount: 1,
        },
      },
      {
        returnDocument: 'after',
      },
    )
      .populate({
        path: 'user',
        select: ['fullName', 'avatarUrl'],
      })
      .then((post) => {
        if (!post) {
          return res.status(404).json({
            message: 'Post not found',
          });
        }

        res.json(post);
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      messgae: 'Failed to get post',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    CommentModel.deleteMany({ post: postId })
      .then(() => {
        console.log('success');
      })
      .catch((error) => {
        console.log('error while deleting comment', error);
      });

    PostModel.findOneAndDelete({
      _id: postId,
    }).then((post) => {
      if (!post) {
        return res.status(404).json({
          message: 'Post not found',
        });
      }

      res.json({
        succcess: true,
      });
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Failed to get posts',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags.split(', '),
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Failed to create a post',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(', '),
      },
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Failed to update post',
    });
  }
};
