const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const tabletInfo = {
    "PARACETAMOL": { name: "Paracetamol", use: "Pain reliever and fever reducer", sideEffect: "Nausea, rash" },
    "IBUPROFEN": { name: "Ibuprofen", use: "Pain relief, anti-inflammatory", sideEffect: "Upset stomach, headache" },
    "LISINOPRIL": { name: "Lisinopril", use: "Blood pressure medication", sideEffect: "Dizziness, cough" },
    "CETIRIZINE": { name: "Cetirizine", use: "Allergy relief", sideEffect: "Drowsiness, dry mouth" },
    "LOSARTAN": { name: "Losartan", use: "Blood pressure medication", sideEffect: "Dizziness, back pain" },
    //"KOF":{name:"Himalaya koflet",use:"Coughing",sideEffect:"Drowsiness"}
    // Add more tablets here with their details
};



app.use(express.static('public'));

app.post('/upload', upload.single('tabletImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    Tesseract.recognize(req.file.buffer, 'eng', {
        logger: (m) => console.log(m),
    })
    .then(({ data: { text } }) => {
        const normalizedText = text
            .replace(/[^a-zA-Z0-9 ]/g, '')  // Remove non-alphanumeric characters
            .toUpperCase()                  // Convert to uppercase
            .trim();                        // Remove leading and trailing spaces

        const tabletNames = Object.keys(tabletInfo).map(name => name.toUpperCase());
        const matchedName = tabletNames.find(name => normalizedText.includes(name)) || "Unknown";

        const info = tabletInfo[matchedName] || { name: "Unknown", use: "Unknown" };
        res.json(info);
    })
    .catch((err) => {
        console.error('Error:', err.message);
        res.status(500).send(err.message);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
