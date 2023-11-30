const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const url = "http://www.cucei.udg.mx/servicios/bolsa-de-trabajo/licenciatura-en-ingenieria-informatica";
const BASE_URL = 'http://www.cucei.udg.mx/'; 

console.clear();
// console.log('Hello World');

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
            let obj = {};

            // Sacamos la info que necesitamos
            let title = $(this).find('div > div').text();
            let description = $(this).find('div.views-field-title > span').text();
            let createdAt = $(this).find('div.views-field-created > span.field-content').text();
            let anchorElement = $(this).find('div.views-field-title > span > a');
            let pathOfContent = anchorElement.attr('href');
            let completeLink = BASE_URL + pathOfContent;

            // Le asignamos las propiedades al objeto
            obj.title = title;
            obj.description = description;
            obj.createdAt = createdAt;
            obj.link = completeLink;

            // Insertamos el objeto al array
            jobsArray.push(obj);
        });
        console.log(jobsArray);
        // console.log('Numero de posiciones de trabajo: ' + jobsArray.length);
        const myJsonString = JSON.stringify(jobsArray);
        // console.log(myJsonString);

        // fs.writeFile('informaticJobs.csv', myJsonString, (error) => {
        //     if (error) {
        //         console.log(`Error en la funcion writeFile: ${error}`);
        //     }
        // });

        return myJsonString;
        
    } catch (error) {
        console.log('Error en funcion crawlScpecificDomSctions, error: ' + error);
    }
};

crawlScpecificDomSctions(url);


// *******************************

/*
Esto no funciona porque nunca se resuelve la promesa que devuelve nuestra funcion async / await 

 const dataForFile = crawlScpecificDomSctions(url);
 console.log(dataForFile);
 
 Se puede resolver con:

 */

// *******************************


// Promesas
// crawlScpecificDomSctions(url).then(val => console.log(val));



// Closures
// (
//     async () => {
//         console.log(await crawlScpecificDomSctions(url));
//     }
// )();


// Otra funcion async / await
// const otraFuncion = async () => {
//     console.log(await crawlScpecificDomSctions(url));
// };

