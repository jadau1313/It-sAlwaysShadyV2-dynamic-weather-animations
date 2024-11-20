
const maxFavs = 5;
let favs = [];

//adds event listener to search bar
document.getElementById("search-button").addEventListener('click', ()=>{
    const city = document.getElementById('city-search').value; //city from input
    console.log("city entered", city);
    if(city){
        fetchWeatherData(city);
        //console.log("pas city point");
    }

});

//event listener for add to favorites
document.getElementById("add-favorite").addEventListener('click', async ()=>{
    const city = document.getElementById("city-search").value; //city from input
    const apiKey = 'Your API key';
    const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;
    try{
        const response = await fetch(url);
        const data = await response.json();
        if(data && data.location && data.current){
            const cityName = data.location.name;
            const regionName = data.location.region;
            const isDuplicate = favs.some(fav => fav.city === cityName && fav.region === regionName);
            //favs.push({city, region});
            if(cityName && regionName && !isDuplicate && favs.length<maxFavs){
                favs.push({city: cityName, region: regionName});
                updateFavoritesDisplay();
            }else if(isDuplicate){
                alert(`${cityName}, ${regionName} is already in your favorites!`);
            }else if(favs.length>=maxFavs){
                alert(`You can have up to ${maxFavs} favorite cities!`);
            }

        }
    }catch(error){
        alert('Error adding to favorites!');
    }
    
    /*if(city && !favs.includes(city) && favs.length<maxFavs){
        favs.push(city);
        updateFavoritesDisplay();
    }else if(favs.includes(city)){
        alert(`${city} is already in your favorites!`);
    }else if(favs.length>=maxFavs){
        alert(`You can have up to ${maxFavs} favorite cities!`);
    }*/

});
/*
//fetch and check weather data before it can be displayed from weatherstack using api key
async function fetchWeatherData(city) {
    const apiKey = '6444e41eb1b209fb5ef2bab9e042dbf7';
    const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;

    try{
        const response = await fetch(url); //fetch data from api
        const data = await response.json();//parse response as json

        if(data.error){
            alert("Error: "+data.error.info);
        }else{
            displayWeatherData(data);
        }
    }catch(error){
        console.error('Error fetching weather data:', error); // Log any network errors
        alert('An error occurred while fetching weather data.');
    }
    
}*/

async function fetchWeatherData(city){
    const apiKey = 'Your API key';
    const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;
    try{
        const response = await fetch(url);
        const data = await response.json();
        if(data && data.location && data.current){
            const tempC = data.current.temperature;
            const tempF = (tempC * 9/5) + 32;
            //const weather = weather_descriptions[0];
            const isNight = new Date(data.location.localtime).getHours() >= 18 || 
                new Date(data.location.localtime).getHours() < 6;
            const{ name, region } = data.location;
            const{ temperature, weather_descriptions} = data.current;
            document.getElementById('weather-info').innerHTML = 
                `<h2>${name}, ${region}</h2>
                <p>Temperature: ${temperature}°C / ${tempF.toFixed(1)}°F</p>
                <p>Conditions: ${weather_descriptions[0]}</p>
            `;
            updateWeatherDisplay(weather_descriptions[0], isNight);
            //document.getElementById("weather-city").textContent = `${name}, ${region}`;
        }
    }catch(error){
        alert('Error fetching weather data!');
        console.error('error fetching', error);
    }
    
}

function createRain() {
    const rainContainer = document.getElementById('rain');
    rainContainer.innerHTML = ''; // Clear previous rain
    
    const numRaindrops = 100; // Number of raindrops, adjust as needed
    for (let i = 0; i < numRaindrops; i++) {
      const raindrop = document.createElement('div');
      raindrop.classList.add('raindrop');
      raindrop.style.display = 'block';
      raindrop.style.left = `${Math.random() * 100}vw`; // Random horizontal position
      raindrop.style.animationDuration = `${Math.random() * 1 + 0.5}s`; // Random fall speed
      rainContainer.appendChild(raindrop);
    }
  
    rainContainer.style.display = 'block'; // Show the rain container
  }

function getRand(min, max){
    return Math.random() * (max-min) + min;

}

function createSnow() {
    const rainContainer = document.getElementById('rain');
    rainContainer.innerHTML = ''; // Clear previous rain
    
    const numRaindrops = 100; // Number of raindrops, adjust as needed
    for (let i = 0; i < numRaindrops; i++) {
      const rand = getRand(3.2, 5.4)
      const raindrop = document.createElement('div');
      raindrop.classList.add('raindrop');
      raindrop.style.display = 'block';
      raindrop.style.left = `${Math.random() * 100}vw`; // Random horizontal position
      raindrop.style.animationDuration = `${rand}s`; // Random fall speed
      rainContainer.appendChild(raindrop);
    }
  
    rainContainer.style.display = 'block'; // Show the rain container
  }
  
  function clearRain() {
    const rainContainer = document.getElementById('rain');
    rainContainer.style.display = 'none'; // Hide the rain
  }
  

function updateWeatherDisplay(weather, isNight){
    const body = document.getElementById('weather-app');
    const sun = document.querySelector('.sun');
    const moon = document.getElementById('moon');
    const clouds = document.querySelectorAll('.cloud');
    const rain = document.getElementById('rain');
    const raindrop = document.querySelector('.raindrop');
    const snow = document.getElementById('snow');
    const stars = document.getElementById('stars');
    
    clearRain();
    //reset styles
    body.style.background = 'linear-gradient(to bottom, #87CEFA, #1E90FF)';
    rain.style.display = 'none';
    raindrop.style.display = 'none';
    snow.style.display = 'none';
    stars.style.display = 'none';
    moon.style.display = 'none';
    //raindrop.children.style.display = 'block';
    sun.style.display = 'block';
    clouds.forEach(cloud => cloud.classList.remove('dark'));
    //clouds.forEach(cloud => cloud.style.background = "#fff")


    //night
    if (isNight) {
        body.style.background = 'linear-gradient(to bottom, #2c3e50, #1c1c1c)';
        sun.style.display = 'none';
        moon.style.display = 'block';
        stars.style.display = 'block';
        //createSnow();
        renderStars(); // Generate stars
    }
    const weatherLower = weather.toLowerCase();
    if (weatherLower.includes('rain') || weatherLower.includes('light rain') || weatherLower.includes('storm') || weatherLower.includes('drizzle')) {
        //raindrop.style.display = 'block';
        createRain();
        //raindrop.children.style.display = 'block';
        clouds.forEach(cloud => cloud.classList.add('dark'));
    } else if (weatherLower.includes('snow')) {
        snow.style.display = 'block';
        clouds.forEach(cloud => cloud.classList.add('dark'));
    } else if (weatherLower.includes('cloudy') || weatherLower.includes('overcast')) {
        clouds.forEach(cloud => cloud.classList.add('dark'));
    }
    // Add more conditions as needed
        // Weather-specific adjustments
    /*switch (weather.toLowerCase()) {
        case 'sunny':
            break; // Default sunny visuals
        case 'cloudy':
            clouds.forEach(cloud => cloud.classList.add('dark'));
            break;
        case 'rain':
        case 'storm':
        case 'drizzle':
            rain.style.display = 'block';
            clouds.forEach(cloud => cloud.classList.add('dark'));
            break;
        case 'snow':
            snow.style.display = 'block';
            clouds.forEach(cloud => cloud.classList.add('dark'));
            break;
        default:
            break; // Leave default visuals
    }*/
}

// Function to render stars for nighttime
function renderStars() {
    const canvas = document.getElementById('stars');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Draw random stars
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}


function displayWeatherData(data) {
    const tempC = data.current.temperature;
    const tempF = (tempC * 9/5) + 32;
    document.getElementById('weather-city').textContent = `Weather in ${data.location.name}`; // City name
    document.getElementById('weather-description').textContent = `Condition: ${data.current.weather_descriptions[0]}`; // Weather condition
    document.getElementById('weather-temperature').textContent = 
    `Temperature: ${data.current.temperature}°C / (${tempF.toFixed(1)}°F)`; // Temperature in Celsius --not showing up yet
}


function updateFavoritesDisplay(){
    const favsList = document.getElementById('favorites-list');
    favsList.innerHTML = ''; //clear current list

    favs.forEach(fav=>{

        const listItem = document.createElement('li');
        listItem.textContent = `${fav.city}, ${fav.region}`;
        favsList.appendChild(listItem);
    });
}
