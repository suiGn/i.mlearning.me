const express = require('express');
const { Server } = require('ws');
const http = require('http');
const path = require('path');
const app = express();
// Set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
// Set up routes
app.get('/', (req, res) => {
    res.render('index', { title: 'i.mLearning.me' });
});

const server = http.createServer(app);
const wss = new Server({ server });
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log(`Received message: ${data.channel} and ${data.hash}`);
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === ws.OPEN) {
                client.send(message);
            }
        });
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
