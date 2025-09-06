const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.get('/api/publications', (req, res) => {
    const publications = [
        {
            id: 1,
            title: "Trust-based Reputation Systems in Distributed Computing Environments",
            authors: ["S.I. Singh", "A. Kumar", "R. Sharma"],
            venue: "IEEE Transactions on Parallel and Distributed Systems",
            year: 2024,
            abstract: "This paper presents a novel approach to building trust-based reputation systems for distributed computing environments...",
            links: {
                pdf: "/assets/papers/paper1.pdf",
                doi: "10.1109/TPDS.2024.001",
                bibtex: "/api/citations/1"
            }
        }
    ];
    res.json(publications);
});

app.get('/api/news', (req, res) => {
    const news = [
        {
            id: 1,
            title: "Paper Accepted at IEEE TPDS",
            date: "2025-01-15",
            excerpt: "Our latest research on trust-based reputation systems has been accepted...",
            tags: ["Research", "Publication", "Trust Systems"],
            image: "/assets/images/news1.jpg"
        }
    ];
    res.json(news);
});

app.get('/api/students', (req, res) => {
    const students = [
        {
            id: 1,
            name: "Rajesh Kumar",
            program: "Ph.D. Computer Science",
            research: "Advanced Trust Metrics for Distributed Systems",
            year: "2022-Present",
            avatar: "/assets/images/students/rajesh.jpg"
        }
    ];
    res.json(students);
});

// Catch all handler: send back index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 Nothing OS inspired design loaded`);
});