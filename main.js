let doc = document
let body = doc.body



let temp_c = 0
let temp_f = 0
let feels_like_c = 0
let feels_like_f = 0

const celsius = () => {
    let temp = doc.getElementById("temp");
    doc.getElementById("temp").innerText = temp_c;
    doc.getElementById("feels-like").innerText = `Feels Like: ${feels_like_c} C`;
    doc.getElementById('far').classList.add('point');
    doc.getElementById('cel').classList.remove('point');
}

const farenheit = () => {
    doc.getElementById("temp").textContent = temp_f
    doc.getElementById("feels-like").innerText = `Feels Like: ${feels_like_f} F`
    doc.getElementById('far').classList.remove('point')
    doc.getElementById('cel').classList.add('point')
}

const getApi = async () => {
    let city = doc.getElementById('city').value
    console.log(city)
    let cityA = city.replace(" ", "-")
    let cityB = city.replace(" ", "+")
    console.log(cityB)
    let key = '5bdeef948f3f767f93e656a67bd74185'
    const endpoint = new URL(`https://api.openweathermap.org/data/2.5/weather?q=${cityB}&appid=${key}&units=metric`);
    const response = await fetch(endpoint);
    if (response.status === '404'){
        alert('City not found');
        return;
    }
    const endpoint2 = new URL(`https://api.teleport.org/api/urban_areas/slug:${cityA}/images/`)
    const response2 = await fetch(endpoint2)
    if (response2.status === '404'){
        alert("no picture for this city");
        return;
    }

    const data = await response.json()
    const data2 = await response2.json()
    doc.getElementById('city-image').src = data2.photos[0].image.web

    console.log(data)   
    let cityName = data.name
    temp_c = Math.round(data.main.temp)
    temp_f = Math.round(temp_c*(9/5)+32)

    // figuring out how to use GMT and timezone differential to calculate local time
    let timeOffset = (data.timezone/36)
    let GMTNow = new Date().toUTCString()
    // function to convert time (in date data) to local time
    let GMTTime = GMTNow.slice(17,19)+GMTNow.slice(20,22)
    console.log(GMTTime)
    GMTTime = Number(GMTTime)
    console.log(GMTTime)
    let localTimeN = GMTTime + timeOffset
    if (localTimeN < 0){
        localTimeN = 2400 + localTimeN
    } else if (localTimeN > 2400){
        localTimeN = localTimeN - 2400
    }
    let daytime = ""
    if (localTimeN < 1200){
        daytime = "AM"
    } else {
        daytime = "PM"
    }
    let localTime = String(localTimeN)
    let zeros = 4 - String(localTimeN).length
    console.log(zeros)
    for (let i = 0; i < zeros; i++){
        localTime = "0"+localTime
    }
    let hhmm = localTime.slice(0,2)+":"+localTime.slice(2)+" "+daytime
    
    
    
    let humidity = data.main.humidity
    feels_like_c = Math.round(data.main.feels_like)
    feels_like_f = Math.round(feels_like_c*(9/5)+32)
    let wind = data.wind.speed
    let weather = data.weather[0].main.toLowerCase()
    let tod = "day"
    if (localTimeN >= 1800 | localTimeN < 200){
        tod = "night"
    }
    console.log(cityName, temp_c, temp_f, humidity, feels_like_c, feels_like_f, wind, weather)
    
    let time_txt = doc.getElementById('time-txt')
    time_txt.innerText = hhmm

    farenheit()

    doc.getElementById('big-div').style.height = '800px'
    doc.getElementById("display").style.display = "";
    doc.getElementById("feels-like").innerText = `Feels Like: ${feels_like_f} F`;
    doc.getElementById("humidity").innerText = `Humidity: ${humidity}%`;
    doc.getElementById("wind").innerText = `Wind: ${wind}km/h`;
    doc.getElementById("temp").innerText = temp_f;
    doc.getElementById("placeholder").innerText = cityName;
    doc.getElementById("icon").src = `images/${weather}-${tod}.png`;
   
    
}



const searchBtn = doc.getElementById('search-button')
searchBtn.addEventListener('click', getApi)

const celBtn = doc.getElementById('cel');
celBtn.addEventListener('click', celsius);

const farBtn = doc.getElementById('far');
farBtn.addEventListener('click', farenheit);