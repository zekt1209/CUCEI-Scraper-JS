const axios = require('axios');
const cheerio = require("cheerio")


const $ = cheerio.load('<h3 class="heading">lorem ipsum</h3>');
$('h3.heading').text(); // "lorem ipsum"
$('h3.heading').find('.subtitle').text();

console.log($('h3.heading').text()); // "lorem ipsum"
console.log($('h3.heading').find('.subtitle').text()); // "lorem ipsum"

// const fetchData = async () => {
//     const response = await axios(); 
//     console.log(response);
// };

// fetchData();
