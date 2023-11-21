const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://www.iban.com/exchange-rates";

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

fetchData(url).then( (res) => {
    const html = res.data;
    const $ = cheerio.load(html);
    const statsTable = $('.table.table-bordered.table-hover.downloads > tbody > tr');     
    statsTable.each(function() {
        let title = $(this).find('td').text();
        let titleSplitted = title.split();

        console.log(title);
    }); 
} );

// fetchData(url);