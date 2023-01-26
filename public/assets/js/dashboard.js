const robots = info.robots;
const site = info.site;
const historicalWeather = info.historicalWeather;

// Graph ==============================================================

var ctx2 = document.getElementById("chart-line").getContext("2d");

// Sort weather data by time
historicalWeather.sort(function(a,b){return a.weather.daily.data[0].time - b.weather.daily.data[0].time})

// let time = historicalWeather.map(weather => weather.weather.daily.data[0].time)

// Initialize variables
let label = []
let temperature = []
let percipitation = []
let rainCountMonthly = [0,0,0,0,0,0,0,0,0,0,0,0]
let percipMonthly = [0,0,0,0,0,0,0,0,0,0,0,0]

historicalWeather.forEach((weather,index) => {

    let dailyWeather = weather.weather.daily.data[0];
    let hourlyWeather = weather.weather.hourly.data;

    // Initialize variables
    let dailyPercip = 0;
    let itRained = false;

    // Filter through hourly weather
    hourlyWeather.forEach(hour => {
        dailyPercip = dailyPercip + hour.precipIntensity;
        if (hour.precipIntensity >= 1) {
            itRained = true;
        }
    });

    // Get data time
    let date = new Date()
    date.setTime(dailyWeather.time*1000)

    // Filter last year only
    let lastYear = new Date()
    lastYear.setFullYear(lastYear.getFullYear() - 1)
    let month = date.getMonth()
    
    // Data for last year
    if (date.getFullYear() == lastYear.getFullYear()) {

        // Rain count
        if (itRained) {
            rainCountMonthly[month]++
        }

        percipMonthly[month] = percipMonthly[month] + dailyPercip

        // Graph data
        label.push(date.toDateString())     
        temperature.push(dailyWeather.temperatureHigh)   
        percipitation.push(dailyWeather.precipIntensity*24)
       
    }

})

var Results = [
    ["Col1", "Col2", "Col3", "Col4"],
    ["Data", 50, 100, 500],
    ["Data", -100, 20, 100],
    ];

exportToCsv = function(array) {
    var CsvString = "";
    array.forEach(function(RowItem, RowIndex) {
        if (Array.isArray(RowItem)) {
            RowItem.forEach(function(ColItem, ColIndex) {
                CsvString += ColItem + ',';
            });
        } else {
            CsvString += RowItem + ',';
        }
        CsvString += "\r\n";
    });
    CsvString = "data:application/csv," + encodeURIComponent(CsvString);
    var x = document.createElement("A");
    x.setAttribute("href", CsvString );
    x.setAttribute("download","download.csv");
    document.body.appendChild(x);
    x.click();
}

new Chart(ctx2, {
    type: "line",
    data: {
        labels: label,
        datasets: [
            {
                label: "Percipitation Intensity",
                tension: 0.4,
                borderWidth: 0,
                pointRadius: 0,
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1,
                data: percipitation,
                maxBarThickness: 6,
                yAxisID:'y'
            },
            {
                label: "Temperature",
                tension: 0.4,
                borderWidth: 0,
                pointRadius: 0,
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1,
                data: temperature,
                maxBarThickness: 6,
                yAxisID:'y1'
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
            display: false,
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
        scales: {
            y: {
                grid: {
                    drawBorder: false,
                    display: true,
                    drawOnChartArea: true,
                    drawTicks: false,
                    borderDash: [5, 5]
                },
                ticks: {
                    display: true,
                    padding: 10,
                    color: '#b2b9bf',
                    font: {
                    size: 11,
                    family: "Open Sans",
                    style: 'normal',
                    lineHeight: 2
                    },
                },
                type: 'linear',
                display: true,
                position: 'left'
            },
            y1: {
                grid: {
                    drawBorder: false,
                    display: false,
                    drawOnChartArea: false,
                    drawTicks: false,
                    borderDash: [5, 5]
                },
                ticks: {
                    display: true,
                    color: '#b2b9bf',
                    padding: 20,
                    font: {
                    size: 11,
                    family: "Open Sans",
                    style: 'normal',
                    lineHeight: 2
                    },
                },
                type: 'linear',
                display: true,
                position: 'right'
            },
        },
    },
});

// MQTT ===============================================================
const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);

const host = 'wss://mqtt.spcrms.online:1885'

console.log('Connecting mqtt client')
const client = mqtt.connect(host, {
    username: "admin",
    password: "SPCRMS123A",
    keepalive: 0,
    clientId: clientId,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
        topic: 'WillMsg',
        payload: 'Connection Closed abnormally..!',
        qos: 0,
        retain: false
    },
})

client.on('error', (err) => {
  console.log('Connection error: ', err)
  client.end()
})

client.on('reconnect', () => {
  console.log('Reconnecting...')
})

// Received
client.on('message', (topic, message, packet) => {

    // console.log('Received Message: ' + message.toString() + '\nOn topic: ' + topic)

    // Robot status
    if (topic.includes('/status')) {
        document.getElementById(topic).innerHTML = message
    }
    else if (topic.includes('/temperature')) {
        document.getElementById(topic).innerHTML = message + '°'
    }
    else if (topic.includes('/battery')) {
        document.getElementById(topic).innerHTML = JSON.parse(message).capacity.toFixed(2) + '%'
    }
    else if (topic.includes('/fan_speed')) {
        if (message == '1') {
            return document.getElementById('fanSpeed').innerHTML = 'Fan speed: High'
        }
        document.getElementById('fanSpeed').innerHTML = 'Fan speed: Low'
    }
    else if (topic.includes('/edge')) {
        if (message == '1') {
            return document.getElementById('edge').innerHTML = 'Edge Detected: false'
        }
        document.getElementById('edge').innerHTML = 'Edge Detected: true'
    }
    else if (topic.includes('/led')) {
        if (message == '1') {
            return document.getElementById('led').innerHTML = 'LED: On'
        }
        document.getElementById('led').innerHTML = 'LED: Off'
    }
    else if (topic.includes('/charging')) {
        if (message == '1') {
            return document.getElementById('charging').innerHTML = 'Charging: false'
        }
        document.getElementById('charging').innerHTML = 'Charging: true'
    }
    else if (topic.includes('/left_sensor')) {
        document.getElementById('leftSensor').innerHTML = 'Left sensor distance: ' + message + ' cm' 
    }
    else if (topic.includes('/middle_sensor')) {
        document.getElementById('middleSensor').innerHTML = 'Middle sensor distance: ' + message + ' cm' 
    }
    else if (topic.includes('/right_sensor')) {
        document.getElementById('rightSensor').innerHTML = 'Right sensor distance: ' + message + ' cm' 
    }

})

function subscribe() {
    // Subscribe
    // Robot battery
    if (robots.length > 0) {
        robots.forEach(robot => {
            client.subscribe(robot._id+'/status', { qos: 0 })
            client.subscribe(robot._id+'/temperature', { qos: 0 })
            client.subscribe(robot._id+'/battery', { qos: 0 })
            client.subscribe(robot._id+'/led', { qos: 0 })
            client.subscribe(robot._id+'/fan_speed', { qos: 0 })
            client.subscribe(robot._id+'/edge', { qos: 0 })
            client.subscribe(robot._id+'/charging', { qos: 0 })
            client.subscribe(robot._id+'/left_sensor', { qos: 0 })
            client.subscribe(robot._id+'/middle_sensor', { qos: 0 })
            client.subscribe(robot._id+'/right_sensor', { qos: 0 })
        });
        console.log('Subscribed to robots');
    }
    
}

client.on('connect', () => {
    console.log('Client connected:' + clientId)
    subscribe();
})

function unsubscribe() {
    // Unsubscribe
    client.unsubscribe('testtopic', () => {
        console.log('Unsubscribed')
    })
}

function publish() {
    // Publish
    client.publish('testtopic', 'ws connection demo...!', { qos: 0, retain: false })
}

// Mode Button ========================================================

let mode1 = document.querySelector("#mode1");
mode1.onclick = () => {
    if (robots.length > 0) {
        robots.forEach(robot => {
            if (document.getElementById('led').innerHTML == 'LED: Off') {
                client.publish(robot._id+'/led',"1",{ qos: 0, retain: true })
                return;
            }
            client.publish(robot._id+'/led',"0",{ qos: 0, retain: true })
        });
    }
}

let mode2 = document.querySelector("#mode2");
mode2.onclick = async () => {
    if (robots.length > 0) {
        robots.forEach(robot => {
            if (document.getElementById('fanSpeed').innerHTML == 'Fan speed: Low') {
                client.publish(robot._id+'/fan_speed',"1",{ qos: 0, retain: true })
                return;
            }
            client.publish(robot._id+'/fan_speed',"0",{ qos: 0, retain: true })
        });
    }
}

// let mode3 = document.querySelector("#mode3");
// mode3.onclick = () => {
//     console.log("Mode 3 clicked");
// let response = await fetch('/api/get_test',{
//     method:'GET',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data)
// })

// let res = await response.json()

// console.log(res);
// }