const cityInput=document.querySelector('.city-input')
const searchBtn=document.querySelector('.search-btn')
const apiKey='c21f6142eef40e6580ffaf1aef9ada96'

const notFoundsection=document.querySelector('.not-found')
const searchCitysection=document.querySelector('.search-city')
const weatherInfosection=document.querySelector('.weather-info')

const countryTxt=document.querySelector('.country-txt')
const tempTxt=document.querySelector('.temp-txt')
const conditionTxt=document.querySelector('.condition-txt')
const humadityvaluetxt=document.querySelector('.humadity-value-txt')
const windvaluetxt=document.querySelector('.wind-value-txt')
const weathersummaryimg=document.querySelector('.weather-summary-img')
const currentdatatxt=document.querySelector('.current-data-txt')

const forecastitemContanet=document.querySelector('.forcast-item-contanier')


searchBtn.addEventListener('click',()=>{
    if (cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()

    }
    
})

cityInput.addEventListener('keydown', (event) => {
    if(event.key=='Enter'&&cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()

    }
    
});


async function getFetchData(endPoint,city){
    const apiUrl=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const respsone=await fetch(apiUrl)
    return respsone.json()


}

function getweathericon(id){
    if(id<=232)return 'thunderstorm.svg'
    if(id<=321)return 'drizzle.svg'
    if(id<=531)return 'rain.svg'
    if(id<=622)return 'snow.svg'
    if(id<=781)return 'atmosphere.svg'
    if(id<=800)return 'clear.svg'
    else return 'clouds.svg'


}

function getcurrentData(){
    const currentData=new Date()
    const options={
        weekday:'short',
        day:'2-digit',
        month:'short'
    }
    return currentData.toLocaleDateString('en-GB',options)
}




async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);
    console.log("data = ",weatherData.cod)
    if (weatherData.cod != 200) {
        showDisplaySection(notFoundsection);
        return;
    }

    //console.log(weatherData)
    const{
        name:country,
        main:{temp,humidity},
        weather:[{id,main}],
        wind:{speed}
    }=weatherData

    countryTxt.textContent=country
    tempTxt.textContent= Math.round(temp)+ '°C'
    conditionTxt.textContent=main
    humadityvaluetxt.textContent=humidity + '%'
    windvaluetxt.textContent=speed + 'M/s'
    currentdatatxt.textContent=getcurrentData()
    weathersummaryimg.src=`assets/weather/${getweathericon(id)}`

    await updateForecastsInfo(city)
    showDisplaySection(weatherInfosection);
}

async function updateForecastsInfo(city) {
    const forecastData = await getFetchData('forecast', city);
    const timetaken='12:00:00'
    const todaydata=new Date().toISOString().split('T')[0]

   // forecastitemContanet.innerHTML = ''
    
    forecastData.list.forEach(forecastweather =>{
        
        if(forecastweather.dt_txt.includes(timetaken)&&
    
        !forecastweather.dt_txt.includes(todaydata)){
            console.log("day = " , forecastweather)

            updateForecastsItem(forecastweather)

        }

        //console.log(forecastweather);
    })
    //console.log(todaydata)
    //console.log(forecastData);
}

function updateForecastsItem(weatherData){
    console.log(weatherData)
    const{
        dt_txt:data,
        weather:[{id}],
        main:{temp}

    }=weatherData

    const datataken=new Date(data)
    const dataoption={
        day:'2-digit',
        month:'short'
    }
    const dataResult=datataken.toLocaleString('en-US',dataoption)

    const forecastitem=`
    
    <div class="forcast-item">
                 <h5 class="forcast-item-data regular-txt">${dataResult}</h5>
                 <img src="assets/weather/${getweathericon(id)}" alt="" class="forcast-item-img">
                    <h5 class="forcast-item-temp">${Math.round(temp)} °C</h5>
                    
    </div>
    `
    forecastitemContanet.insertAdjacentHTML('beforeend',forecastitem)

}


function showDisplaySection(section) {
    [weatherInfosection, searchCitysection, notFoundsection]
        .forEach(sec => sec.style.display = 'none');  // Corrected to 'style' (lowercase s)

    section.style.display = 'flex';  // Corrected to 'style'
}






