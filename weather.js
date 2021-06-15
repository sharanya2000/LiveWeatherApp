const express = require("express");
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");
const homeFile = fs.readFileSync("index.html","utf-8");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
  temperature =temperature.replace("{%location%}",orgVal.name);
  temperature = temperature.replace("{%country%}",orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);

  return temperature;
};

app.get("/",function(req,res){
  res.sendFile(__dirname + "/home.html");

});
app.post("/",function(req,res){
  const query = req.body.cityName;
  const url ="https://api.openweathermap.org/data/2.5/weather?q="+ query + "&appid=04bae18ad532e78df4ed616aadc05cc3&units=metric";
  https.get(url,function(response){
    console.log(response.statusCode);

    response.on("data",function(data){
    const weatherData =  JSON.parse(data);
    const arrData = [weatherData];
    const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");

    res.write(realTimeData);
    res.send();
    });

});
});




app.listen(8000,function(){
  console.log("Server is running on port 8000.");
})
