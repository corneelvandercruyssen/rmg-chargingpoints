//Module Importeren

import express from 'express';
import fetch from 'node-fetch';

//Defineren van app
const app = express();
const PORT = process.env.PORT || 3000;  //De app is bereikbaar op x.x.x.x:3000

app.get('/', async (req, res) => {
    try {

        //RSL
        // Haal info af van Mobility Plus, betrouwbare source voor de laadpalen bij Roularta
        const roeselareResponse = await fetch('https://my.mobilityplus.be/sp/api/v25/user/charging/evses/?charging_location=42017');
        const roeselareData = await roeselareResponse.json();

        // Tel uit de JSON uit die API call alle vrije laadplaatsen bij Roularta
        const roeselareAvailableCount = roeselareData.results.filter(evse => evse.status === 'available').length;

        // Bereken hoe groot de groene balk moet zijn voor Roeselare
        const roeselareProgressBarWidth = (roeselareAvailableCount / 20) * 100;

        // Minder dan 3 is rood, minder dan 5 is oranje , anders groen
        let roeselareProgressBarColor;
        if (roeselareAvailableCount <= 3) {
            roeselareProgressBarColor = 'bg-danger';
        } else if (roeselareAvailableCount <= 5) {
            roeselareProgressBarColor = 'bg-warning';
        } else {
            roeselareProgressBarColor = 'bg-success';
        }

        //SDW
        // Haal info af van SDW charging location
        const sdwResponse = await fetch('https://my.mobilityplus.be/sp/api/v25/user/charging/evses/?charging_location=315665');
        const sdwData = await sdwResponse.json();

        // Tel uit de JSON uit die API call alle vrije laadplaatsen bij SDW
        const sdwAvailableCount = sdwData.results.filter(evse => evse.status === 'available').length;

        // Bereken hoe groot de groene balk moet zijn voor SDW
        const sdwProgressBarWidth = (sdwAvailableCount / 4) * 100;

        // Minder dan 3 is rood, minder dan 5 is oranje , anders groen
        let sdwProgressBarColor;
        if (sdwAvailableCount <= 1) {
            sdwProgressBarColor = 'bg-danger';
        } else if (sdwAvailableCount <= 2) {
            sdwProgressBarColor = 'bg-warning';
        } else {
            sdwProgressBarColor = 'bg-success';
        }

        //BMC
        // Haal info af van bmc charging location
        const bmcResponse = await fetch('https://my.mobilityplus.be/sp/api/v25/user/charging/evses/?charging_location=42016');
        const bmcData = await bmcResponse.json();

        // Tel uit de JSON uit die API call alle vrije laadplaatsen bij bmc
        const bmcAvailableCount = bmcData.results.filter(evse => evse.status === 'available').length;

        // Bereken hoe groot de groene balk moet zijn voor bmc
        const bmcProgressBarWidth = (bmcAvailableCount / 18) * 100;

        // Minder dan 3 is rood, minder dan 5 is oranje , anders groen
        let bmcProgressBarColor;
        if (bmcAvailableCount <= 3) {
            bmcProgressBarColor = 'bg-danger';
        } else if (bmcAvailableCount <= 5) {
            bmcProgressBarColor = 'bg-warning';
        } else {
            bmcProgressBarColor = 'bg-success';
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
                <nav class="navbar" style="background-color: #fdfdfd;">
                <div class="container-fluid">
                <h1 class="navbar-brand" style="color: rgb(24, 27, 29); font-size: 2.3em;">
                    <img src="https://www.roularta.be/sites/default/files/styles/sidebar/public/public/roularta/logos/corporate/Roularta-Visual-Rood-HIRES.png?itok=P2Ymelrm" alt="Logo" width="80" class="d-inline-block align-text-top">
                    Roularta vrije laadpunten 
                </h1>
                </div>
                </nav>
                <div class="container">
                    
                    <h2>Roeselare</h2>
                    <div class="progress" style="height: 30px;">
                        <div id="roeselareProgressBar" class="progress-bar ${roeselareProgressBarColor}" role="progressbar" style="width: ${roeselareProgressBarWidth}%; font-size: 20px;" aria-valuenow="${roeselareAvailableCount}" aria-valuemin="0" aria-valuemax="20">${roeselareAvailableCount}</div>
                    </div>
                    <div id="roeselareSensorValue" class="mt-3">Vrije laadpalen: ${roeselareAvailableCount}</div>

                    <h2>Sint-Denijs-Westrem</h2>
                    <div class="progress" style="height: 30px;">
                        <div id="sdwProgressBar" class="progress-bar ${sdwProgressBarColor}" role="progressbar" style="width: ${sdwProgressBarWidth}%; font-size: 20px;" aria-valuenow="${sdwAvailableCount}" aria-valuemin="0" aria-valuemax="20">${sdwAvailableCount}</div>
                    </div>
                    <div id="sdwSensorValue" class="mt-3">Vrije laadpalen: ${sdwAvailableCount}</div>


                    <h2>BMC - Evere</h2>
                    <div class="progress" style="height: 30px;">
                        <div id="bmcProgressBar" class="progress-bar ${bmcProgressBarColor}" role="progressbar" style="width: ${bmcProgressBarWidth}%; font-size: 20px;" aria-valuenow="${bmcAvailableCount}" aria-valuemin="0" aria-valuemax="20">${bmcAvailableCount}</div>
                    </div>
                    <div id="bmcSensorValue" class="mt-3">Vrije laadpalen: ${bmcAvailableCount}</div>


                </div>
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>


                <nav class="navbar fixed-bottom bg-body-tertiary">
                <div class="container-fluid">
                    <a class="navbar-brand" href="https://github.com/corneelvandercruyssen/rmg-chargingpoints">Corneel Van der Cruyssen - https://github.com/corneelvandercruyssen/rmg-chargingpoints</a>
                </div>
                </nav>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

// Start de server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
