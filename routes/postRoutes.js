import express from 'express';
import { protectedRoute } from '../middlewares/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import fsPromises from 'fs/promises';

const dbPath = path.resolve(__dirname, '../db.js');

const router = express.Router();

// set up storage engine using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
// File filter to allow only JPEG
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only JPEG files are allowed!'), false); // Reject the file
  }
};
// initilize upload variale with the storage engine
const upload = multer({ storage: storage, fileFilter: fileFilter });

// route for home page
router.get('/', (req, res) => {
  res.render('index.ejs', { title: 'Home Page', active: 'home' });
});

// route for my posts page
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
    req.flash('error', 'An error occured while fetching your posts!');
    res.redirect('/my-posts');
  }
});

// route for create new post page
router.get('/create-post', protectedRoute, (req, res) => {
  res.render('posts/create-post', {
    title: 'Create Post',
    active: 'create_post',
  });
});

// route edit post page
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
// handle update a postrequest
router.post(
  '/update-post/:id',
  protectedRoute,
  upload.single('image'),
  async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findById(postId);

      if (req.file) {
        // Delete the old image if it exists
        if (post.image) {
          try {
            await fsPromises.unlink(
              path.join(process.cwd(), 'uploads', post.image)
            );
          } catch (err) {
            console.error(`Error deleting file: ${err.message}`);
          }
        }

        // Assign the new image
        post.image = req.file.filename;
      }

      // Save the updated post
      await post.save();
      req.flash('success', 'Post updated successfully!');
      res.redirect('/my-posts');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Something wnt wrong!');
      res.redirect('/my-posts');
    }
  }
);
// route for view post in detail
router.get('/post/:id', (req, res) => {
  res.render('posts/view-post', { title: 'View Post', active: 'view_post' });
});

// handle create new post request
router.post(
  '/create-post',
  protectedRoute,
  upload.single('image'),
  async (req, res) => {
    try {
      const { title, content } = req.body;
      const image = req.file.filename;
      const slug = title.replace(/\s+/g, '-').toLowerCase();
      const user = await User.findById(req.session.user._id);

      // create new post
      const post = new Post({ title, slug, content, image, user });
      // save post in suer posts array
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
export default router;
