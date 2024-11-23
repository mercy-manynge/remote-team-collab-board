import express from 'express';
import users from './user.js';

const app = express();

app.get('/remote-team-collab-board', (req, res) => {
    res.send('Hello from remote-team-collab-board 💪🏼')

});

app.get('/users', (req, res) => {
    res.send(users);
});

const port = process.env.PORT || 8080;
 app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`);
 })