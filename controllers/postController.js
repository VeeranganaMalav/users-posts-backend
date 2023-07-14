const Post = require("../models/post");
const User = require("../models/user");

module.exports.createPost = async (req, res) => {
    try {
        const { title, content, userId } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            res.status(404).send({ message: 'User not found' });
            return;
        }

        const post = await Post.create({
            title,
            content,
            userId
        });

        user.posts.push(post._id);
        await user.save();

        res.status(201).send({ message: 'Post created successfully', post: post });
    }
    catch (err) {
        res.status(500).send({ error: 'Failed to create post' });
    }
}


module.exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).send(posts);
    }
    catch (err) {
        res.status(500).send({ error: 'Failed to fetch posts' });
    }
}

module.exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            res.status(404).send({ error: 'Post not found' });
            return;
        }

        res.status(200).send(post);
    }
    catch (err) {
        res.status(500).send({ error: 'Failed to fetch post' });
    }
}

module.exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true });

        if(!updatedPost){
            res.status(404).send({ error: 'Post not found' });
        }

        res.status(200).send({ message: 'Post updated successfully', post: updatedPost });
    }
    catch (err) {
        res.status(500).send({ error: 'Failed to update post' });
    }
}

module.exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            res.status(404).send({ error: 'Post not found' });
            return;
        }

        res.send({ message: 'Post deleted successfully', post: deletedPost });

    }
    catch (err) {
        res.status(500).send({ error: 'Failed to delete post' });
    }
}

module.exports.populateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id).populate('userId');

        res.status(200).send(post);
    }
    catch (err) {
        res.status(500).send({ error: 'Failed to populate the posts' });
    }
};
