import express from 'express'
import mongoose from 'mongoose';
import { User } from './views/model/user.js';

const PORT = 3000;

const url = 'mongodb://127.0.0.1:27017/study';

const app = express();

app.use(express.static('css'));

app.set('view engine', 'pug');

mongoose.connect(url)
        .then(()=> {
            console.log('Connected to DB');
            app.listen(PORT, ()=> {
                console.log(`Server started on http://localhost:${PORT}`);
            })
        })
        .catch((err) => { console.log(`DB connection error: ${err}`) });
        

app.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.render('index', { users });
    } catch (err) {
        res.status(500).send(`Error fetching users: ${err}`);
    }
});

app.use(express.urlencoded({ extended: true }));

app.post('/add', async (req, res) => {
    try {
        const { name, age, status, avatar } = req.body;
        
        if (!name || !age || !status || !avatar) {
            const users = await User.find({});
            return res.render('index', { users, errorMessage: '...' });
        }
        const newUser = new User({ name, age, status, avatar });
        await newUser.save();
        res.redirect('/');
    } catch (err) {
        res.status(500).send(`Error adding user: ${err}`);
    }
});

app.get('/edit-user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('edit-user', { user });
    } catch (err) {
        res.status(500).send(`Error fetching user: ${err}`);
    }
});

app.post('/edit-user/:id', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/');
    } catch (err) {
        res.status(500).send(`Error updating user: ${err}`);
    }
});

app.delete('/remove/:id', async (req, res)=> {
    try{
        await User.deleteOne({_id: req.params.id})
        res.status(200).json({ message: 'This course has deleted' });
    } catch(err){
        console.log(err);
    }
});
