//Module Importeren

import express from 'express';
import fetch from 'node-fetch';

//Defineren van app
const app = express();
const PORT = process.env.PORT || 3000;  //De app is bereikbaar op x.x.x.x:3000

app.get('/', async (req, res) => {
    try {
        // Haal info af van Mobility Plus, betrouwbare source voor de laadpalen bij Roularta
        const response = await fetch('https://my.mobilityplus.be/sp/api/v25/user/charging/evses/?charging_location=42017');
        const data = await response.json();

        // Tel uit de JSON uit die API call alle vrije laadplaen bij de Meiboomlaan
        const availableCount = data.results.filter(evse => evse.status === 'available').length;

        // Bereken hoe groot de groene balk moet zijn
        const progressBarWidth = (availableCount / 20) * 100;

        // Minder dan 3 is rood, minder dan 5 is oranje , anders groen
        let progressBarColor;
        if (availableCount <= 3) {
            progressBarColor = 'bg-danger';
        } else if (availableCount <= 5) {
            progressBarColor = 'bg-warning';
        } else {
            progressBarColor = 'bg-success';
        }

        // Beantwoord met frontend html respons
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Roularta LaadPaal Aantal Vrije Palen</title>
                <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="container">
                    <h1>Roularta vrije laadpunten</h1>
                    <div class="progress" style="height: 30px;">
                        <div id="progressBar" class="progress-bar ${progressBarColor}" role="progressbar" style="width: ${progressBarWidth}%; font-size: 20px;" aria-valuenow="${availableCount}" aria-valuemin="0" aria-valuemax="20"></div>
                    </div>
                    <div id="sensorValue" class="mt-3">Available Charging Points: ${availableCount}</div>
                </div>
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


