import express from 'express';
import { protectedRoute } from '../middlewares/authMiddleware.js';
import multer from 'multer';
import User from '../models/userModel.js';
import Post from '../models/postModel.js';

const router = express.Router();

// File filter to allow only JPEG
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only JPEG files are allowed!'), false); // Reject the file
  }
};

// Initialize upload variable with the storage engine
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 }, // Limit file size to 1MB
});

// Route for home page with pagination
router.get('/', async (req, res) => {
  try {
    // Get page from query params or default to 1
    const page = parseInt(req.query.page) || 1;
    const limit = 6; // Show 6 posts per page
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const total = await Post.countDocuments();
    const totalPages = Math.ceil(total / limit);
    
    // Get posts for current page
    const posts = await Post.find()
      .populate('user')
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);
    
    // Get search query if any
    const searchQuery = req.query.search || '';
    
    res.render('index.ejs', {
      title: 'Home Page',
      active: 'home',
      posts,
      pagination: {
        page,
        limit,
        totalPages,
        totalItems: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      searchQuery
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    req.flash('error', 'Unable to fetch posts at this time.');
    res.redirect('/');
  }
});

// Route for my posts page
router.get('/my-posts', protectedRoute, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate('posts');

    if (!user) {
      req.flash('error', 'User not found!');
      return res.redirect('/');
    }
    res.render('posts/my-posts', {
      title: 'My Posts',
      active: 'my_posts',
      posts: user.posts,
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'An error occurred while fetching your posts!');
    res.redirect('/my-posts');
  }
});

// Route for create new post page
router.get('/create-post', protectedRoute, (req, res) => {
  res.render('posts/create-post', {
    title: 'Create Post',
    active: 'create_post',
  });
});

// Route for edit post page
router.get('/edit-post/:id', protectedRoute, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      req.flash('error', 'Post not found!');
      return res.redirect('/my-posts');
    }
    res.render('posts/edit-post', {
      title: 'Edit Post',
      active: 'edit_post',
      post,
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Something went wrong!');
    res.redirect('/my-posts');
  }
});

// Handle update a post request
router.post(
  '/update-post/:id',
  protectedRoute,
  upload.single('image'),
  async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findById(postId);

      if (req.file) {
        post.image = req.file.buffer.toString('base64');
      }
      post.title = req.body.title;
      post.content = req.body.content;

      // Save the updated post
      await post.save();
      req.flash('success', 'Post updated successfully!');
      res.redirect('/my-posts');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Something went wrong!');
      res.redirect('/my-posts');
    }
  }
);

// Route for view post in detail
router.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user');
    if (!post) {
      req.flash('error', 'Post not found!');
      return res.redirect('/');
    }
    res.render('posts/view-post', {
      title: 'View Post',
      active: 'view_post',
      post,
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Something went wrong!');
    res.redirect('/');
  }
});

// Handle create new post request
router.post(
  '/create-post',
  protectedRoute,
  upload.single('image'),
  async (req, res) => {
    try {
      const { title, content } = req.body;
      
      // Validate required fields
      if (!title || !content) {
        req.flash('error', 'Title and content are required!');
        return res.redirect('/create-post');
      }
      
      const slug = title.replace(/\s+/g, '-').toLowerCase();
      const user = await User.findById(req.session.user._id);
      
      // Check if file was uploaded
      if (!req.file) {
        req.flash('error', 'Image is required!');
        return res.redirect('/create-post');
      }
      
      const image = req.file.buffer.toString('base64');

      // Create new post
      const post = new Post({ title, slug, content, image, user });

      // Save post in user posts array
      await User.updateOne(
        { _id: req.session.user._id },
        { $push: { posts: post._id } }
      );
      await post.save();
      req.flash('success', 'Post created successfully!');
      res.redirect('/my-posts');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Something went wrong!');
      res.redirect('/create-post');
    }
  }
);

// Delete post
router.route('/delete-post/:id').delete(protectedRoute, async function (req, res) {
  try {
    // Find the post
    const post = await Post.findById(req.params.id);
    
    // Check if post exists
    if (!post) {
      req.flash('error', 'Post not found!');
      return res.redirect('/my-posts');
    }
    
    // Check if the user is the owner of the post
    if (post.user.toString() !== req.session.user._id.toString()) {
      req.flash('error', 'You are not authorized to delete this post!');
      return res.redirect('/my-posts');
    }
    
    // Delete the post
    await Post.findByIdAndDelete(req.params.id);
    
    // Remove post reference from user's posts array
    await User.updateOne(
      { _id: req.session.user._id },
      { $pull: { posts: req.params.id } }
    );
    
    req.flash('success', 'Post deleted successfully!');
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong!' });
  }
});

// Search route
router.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.q || '';
    
    if (!searchQuery) {
      return res.redirect('/');
    }
    
    // Get page from query params or default to 1
    const page = parseInt(req.query.page) || 1;
    const limit = 6; // Show 6 posts per page
    const skip = (page - 1) * limit;
    
    // Create search query for MongoDB
    const searchRegex = new RegExp(searchQuery, 'i');
    const searchFilter = {
      $or: [
        { title: searchRegex },
        { content: searchRegex }
      ]
    };
    
    // Get total count for pagination
    const total = await Post.countDocuments(searchFilter);
    const totalPages = Math.ceil(total / limit);
    
    // Get posts for current page that match search query
    const posts = await Post.find(searchFilter)
      .populate('user')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.render('search-results', {
      title: `Search Results for "${searchQuery}"`,
      active: 'search',
      posts,
      searchQuery,
      pagination: {
        page,
        limit,
        totalPages,
        totalItems: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      resultsCount: total
    });
  } catch (error) {
    console.error('Error searching posts:', error);
    req.flash('error', 'Unable to search posts at this time.');
    res.redirect('/');
  }
});

export default router;
