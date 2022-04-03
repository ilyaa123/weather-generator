'use sctrict'
const API_KEY = '0c3e77ae355152ca9181a04b4b3042d6';
const weatherContainer = document.querySelector('.weather-content');
const searchSubmit = document.querySelector('.weather');

searchSubmit.addEventListener('submit', (event) => {
    event.preventDefault();
    const citySearch = searchSubmit.search.value;
    getCity(citySearch);
    searchSubmit.search.value = '';
});

const getData = async (lat, lon) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=ru&units=metric`);
    const data = await response.json();

    return data
};

const showError = () => {
    const div = document.createElement('div');
    div.className = 'errorSearch';
    div.innerText = 'Ошибка запроса, в поиск можно вписать название города, код штата код страны';
    weatherContainer.append(div);
}

const showElem = elem => {
    let opacity = 0;
    elem.opacity = opacity;

    elem.style.display = '';

    const animation = () => {
        opacity += 0.05;
        elem.style.opacity = opacity;

        if (opacity < 1){
            requestAnimationFrame(animation);        
        }
    };
    requestAnimationFrame(animation);
};

const renderCard = (data) => {
    const name = data.name;
    const temp = data.main.temp;
    const weather = data.weather[0].description;
    const wind = data.wind.speed;
    const clouds = data.clouds.all;
    const pressure = data.main.pressure;
    const humidity = data.main.humidity;
    const country = data.sys.country;

    const div = document.createElement('div');
    div.className = 'weather-item';
    div.innerHTML = `
        <h2>${name} ${country}</h2>
        <p>Температура: ${temp} по Цельсию, ${weather}</p>
        <p>Ветер: ${wind}м/с</p>
        <p>Облака: ${clouds}%</p>
        <p>Атмосферное давление: ${pressure} ГПа</p>
        <p>Влажность: ${humidity}%</p>
    `;
    weatherContainer.append(div);
    showElem(div);
};

const init = async (lat, lon) => {
    const data = await getData(lat, lon);
    
    renderCard(data);
    const weather = JSON.stringify(data);
    localStorage.setItem('weather', weather);
    
};

const getCity = async (cityValue) => {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityValue}&limit=5&appid=${API_KEY}`;
    const city = await (await fetch(url)).json();
    weatherContainer.textContent = '';
    if (city.length > 1) {
        city.forEach(element => {
            const lat = element.lat;
            const lon = element.lon;
            
            init(lat, lon);
        });
    } else if(city.length == 1) {
        init(city[0].lat, city[0].lon);
    } else {
        showError()
    }
};
const documentReady = () => {
    navigator.geolocation.getCurrentPosition(
        function(position){
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            init(lat, lon);
            weatherContainer.textContent = '';
        },
        function(error){
            console.log(error.message);
            if (localStorage.getItem('weather') !== null){
                const weather = localStorage.getItem('weather');
                const data = JSON.parse(weather);
                weatherContainer.textContent = '';
                renderCard(data);
            }
        }
    )
}
documentReady();