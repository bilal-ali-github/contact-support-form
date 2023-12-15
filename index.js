const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 8080; // You can choose any available port

// CORS
app.use(cors('*'));

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Simple in-memory storage for demo purposes
const messages = [];

// Nodemailer configuration (replace with your email provider's settings)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shafaq.alraha@gmail.com',
        pass: 'xvuu nnla wsmx ceez',
    },
});

// Endpoint to handle contact form submissions
app.post('/contact', (req, res) => {
    const authKey = req.headers.authorization;
    if (!authKey || authKey !== '15e49a6fe7msh67cb8c745e9f342p101d2bjsn71bf0be9f42f') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Save the message (for demo purposes, you may want to store it in a database)
    messages.push({ name, email, message });

    // Send the message to the specified email address
    const mailOptions = {
        from: 'shafaq.alraha@gmail.com',
        to: 'shafaq.alraha@gmail.com',
        subject: `via Contact Form - Shafaq Alraha Cargo Transport LLC`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        console.log('Email sent:', info.response);
        // Send a success response
        res.json({ success: true, message: 'Message received successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});