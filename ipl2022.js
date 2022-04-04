const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs=require("fs");
let xlsx = require('json-as-xlsx');
const { strictEqual } = require("assert");
let matchdetails=[];
const link="https://www.espncricinfo.com/series/indian-premier-league-2022-1298423/match-schedule-fixtures";
request(link,cb);


function cb(error,response,html){
    if(error){
        console.log(error);
    }
    else{
        const dom = new JSDOM(html);
        const document = dom.window.document;
        let matches=document.querySelectorAll(".col-md-8.col-16");
        //console.log(matches.length);
        let matchno=1;
        for(let i=0;i<matches.length;i++){
            let stadium=matches[i].querySelector(".match-info.match-info-FIXTURES.match-info-with-icon .description").textContent;            let team1=matches[i].querySelector(".teams .team .name").textContent;
            let team2=matches[i].querySelectorAll(".teams .team .name")[1].textContent;
            let date=matches[i].querySelector(".status.status-hindi").textContent;
           // console.log(stadium);
           let stadiumcity=stadium.split(" ")[3];
           if(stadiumcity[stadiumcity.length-1]==','){
            stadiumcity = stadiumcity.slice(0, -1);
           }
            let obj={
                MatchNo:matchno,
                Team1:team1,
                Team2:team2,
                Date:date,
                Stadium:stadiumcity
            }
            matchno++;
            matchdetails.push(obj);
        }
        var myJsonString = JSON.stringify(matchdetails);
        fs.writeFileSync("MatchDetails.json", myJsonString);
        let data = [
            {
                sheet: 'Matches',
                columns: [
                    { label: 'MatchNo', value:  'MatchNo' }, // Top level data
                    { label: 'Team1', value: 'Team1' }, // Run functions
                    { label: 'Team2', value: 'Team2' },
                    { label: 'Date', value: 'Date' },
                    {label:'Stadium',value:'Stadium'}
                    
                ],
                content: matchdetails
            }
        ]

        let settings = {
            fileName: 'MatchesDetails', // Name of the resulting spreadsheet
            extraLength: 3, // A bigger number means that columns will be wider
            writeOptions: {} // Style options from https://github.com/SheetJS/sheetjs#writing-options
        }

        xlsx(data, settings) // Will download the excel file

    }
}