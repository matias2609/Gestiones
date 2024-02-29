const express = require ("express");
const router = express.Router();

const Post = require("../models/Post");
const { isAuthenticated } = require("../helpers/auth");

router.get("/posts/add", isAuthenticated, (req, res) => {
    res.render("posts/new-post");
});

router.post("/posts/new-post", isAuthenticated, async (req, res) => {
    const { title, description, sector } = req.body;
    const errors = [];

    if (!title) {
        errors.push({ text: "Por favor escriba un título" });
    }
    if (!description) {
        errors.push({ text: "Por favor escriba una descripción" });
    }
    if (!sector) {
        errors.push({ text: "Por favor seleccione un sector" });
    }

    if (errors.length > 0) {
        res.render("posts/new-post", {
            errors,
            title,
            description,
            sector
        });
    } else {
        const newPost = new Post({ title, description, sector });
        newPost.user = req.user.id;
        await newPost.save();
        res.redirect("/posts");
    }
});



router.get("/posts", isAuthenticated, async (req, res) => {
    const posts = await Post.find({user: req.user.id}).lean().sort({date: "desc"});
    res.render("posts/all-posts", { posts });
});

router.get("/posts/edit/:id", isAuthenticated, async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render("posts/edit-post", {post});
});

router.put("/posts/edit-post/:id", isAuthenticated, async (req, res) => {
    const {title, description} = req.body;
    await Post.findByIdAndUpdate(req.params.id, {title, description});
    res.redirect("/posts");
});

router.delete("/posts/delete/:id", isAuthenticated, async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/posts");
});

module.exports = router;