const { Worker, isMainThread, parentPort }  = require('worker_threads');
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

let workDir = __dirname+"/dbWorker.js";

const mainFunc = async () => {
  const url = "https://www.iban.com/exchange-rates";
  // fetch html data from iban website
  let res = await fetchData(url);
  if(!res.data){
    console.log("Invalid data Obj");
    return;
  }
  const html = res.data;
  let dataObj = new Object();
  // mount html page to the root element
  const $ = cheerio.load(html);

//   let dataObj = new Object();
  const statsTable = $('.table.table-bordered.table-hover.downloads > tbody > tr');
  //loop through all table rows and get table data
  statsTable.each(function() {
    let title = $(this).find('td').text(); // get the text in all the td elements
    let newStr = title.split("\t"); // convert text (string) into an array
    newStr.shift(); // strip off empty array element at index 0
    formatStr(newStr, dataObj); // format array string and store in an object
  });

  return dataObj;
}

mainFunc().then((res) => {
    // start worker
    const worker = new Worker(workDir); 
    console.log("Sending crawled data to dbWorker...");
    // send formatted data to worker thread 
    worker.postMessage(res);
    // listen to message from worker thread
    worker.on("message", (message) => {
        console.log(message)
    });
});


function formatStr(arr, dataObj){
    // regex to match all the words before the first digit
    let regExp = /[^A-Z]*(^\D+)/ 
    let newArr = arr[0].split(regExp); // split array element 0 using the regExp rule
    dataObj[newArr[1]] = newArr[2]; // store object 
}