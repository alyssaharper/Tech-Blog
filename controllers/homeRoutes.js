const router = require('express').Router();
const { route } = require('../../01-Activities/28-Stu_Mini-Project/Main/controllers/homeRoutes');
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        const posts = postData.map((post) => post.get({ plain: true }));

        res.render('homepage', {
            posts,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        const post = postData.get({ plain: true });

        res.render('post', {
            ...post,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', async (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/dashboard');
    }
    res.render('login');
});

router.get('/dashboard', async (req, res) => {
    if (req.session.logged_in) {
        try {
            const postData = await Post.findAll({
                username: req.session.username
            });

            const posts = postData.get({ plain: true });

            res.render('dashboard', {
            posts,
            logged_in: req.session.logged_in
            });
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.redirect('/login');
    }
})

module.exports = router;

