var ctx = document.getElementById('myChart').getContext('2d');
function getNewChart(type, dataValues){
    return new Chart(ctx, {
            type: type || "bar",
            responsive: true,
            data: {
                labels: ['1st', '2nd', '3rd', '4th', '5th', '6th'],
                datasets: [{
                    data: dataValues,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        }
                    });
}
var myChart = getNewChart("bar", [1,5,3,2,3,5])

var socket = new WebSocket('ws://localhost:8000/ws/graph/');

socket.onmessage = (e) => {
    var djangoData = JSON.parse(e.data);
    console.log(djangoData);
    if (djangoData.change === "data")
    {
        document.querySelector("#marcador").innerText = djangoData.value;
        nset = myChart.data.datasets[0].data;
        nset.shift();
        nset.push(djangoData.value);
        myChart.data.datasets[0].data = nset;
    }
    else if (djangoData.change === "type")
    {
        myChart.destroy();
        myChart = getNewChart(djangoData.value, [1,2,4,5,6]);
    }
    else if (djangoData.change === "nelements")
    {
        nset = myChart.data.datasets[0].data;
        colors = myChart.data.datasets[0].backgroundColor;
        labels = myChart.data.labels;
        length = nset.length;
        newLength = djangoData.value;

        if (length < newLength)
        {
            for (i = length; i < newLength; i++)
            {
                labels.push("New");
                nset.push(0)
                colors.push(getRandomColorString())
            }
        }
        else if (length > newLength)
        {
            for (i = length; i > newLength; i--) {
                labels.pop();
                nset.pop()
                colors.pop()
            }
        }
        myChart.data.datasets[0].data = nset;
        myChart.data.labels = labels;
        myChart.data.datasets[0].backgroundColor = colors;
    }
    myChart.update();
}

document.getElementById("sendn").onclick = function(){
    socket.send(JSON.stringify({change: "data", value: document.getElementById("number").value}));
};

document.getElementsByName("options").forEach(setOnClickType);

function setOnClickType(item, index) {
    item.onclick = () => {
        socket.send(JSON.stringify({change: "type", value: item.value}));
    }
};

document.getElementById("nelementsb").onclick = function(){
    socket.send(JSON.stringify({change: "nelements", value: document.getElementById("nelements").value}));
};

function getRandomColorString(){
     return 'rgba(' + Math.floor((Math.random() * 255) + 1) + ', ' + Math.floor((Math.random() * 255) + 1) + ', ' + Math.floor((Math.random() * 255) + 1) + ', 0.5)'
}
console.log(getRandomColorString())