const axios = require('axios');
const cheerio = require('cheerio');
const url = "http://www.cucei.udg.mx/servicios/bolsa-de-trabajo/licenciatura-en-ingenieria-informatica";

const fetchData = async (url) => {
    console.log('Crawling data...');
    try {
        
        let response = await axios(url);

        if (response.status != 200) {
            console.log('Error in status while fetching data, status: ' + response.status);
            return;
        }

        // console.log(response.data);
        return response;

    } catch (error) {
        console.error('Error en la funcion fetchData: ' + error);
    }
};

// fetchData(url).then( (res) => {
//     const html = res.data;
//     const $ = cheerio.load(html);
//     const statsTable = $('.table.table-bordered.table-hover.downloads > tbody > tr');     
//     statsTable.each(function() {
//         let title = $(this).find('td').text();
//         let titleSplitted = title.split();

//         console.log(title);
//     }); 
// } );

const crawlScpecificDomSctions = async (url) => {
    try {

        const res = await fetchData(url);
        const html = await res.data;
        // console.log(html);
        
        const $ = cheerio.load(html);
        // console.log($);
        const jobsTable = $('#block-system-main > div > div > div > div.view-content > div > ul > li');
        // console.log(jobsTable);

        let jobsArray = [];

        jobsTable.each(function() {
            let title = $(this).find('div').text();
            jobsArray.push(title);
            // console.log(title);
        });

        console.log(jobsArray);
        
    } catch (error) {
        console.log('Error en funcion crawlScpecificDomSctions, error: ' + error);
    }
};

// fetchData(url);
crawlScpecificDomSctions(url);