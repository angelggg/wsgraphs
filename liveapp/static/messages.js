var socket = new WebSocket('ws://localhost:8000/ws/messages/');

socket.onmessage = (e) => {
    if (e){
        document.getElementById("msgslist").innerHTML = "";
        messages = JSON.parse(e.data || "{}");
        messages.forEach(printMessage);
    }
}

function printMessage(item, index){
        document.getElementById("msgslist").innerHTML += "<li>" + item.text + "<li>";
}

document.getElementById("btn").onclick = () => {
    tagv = document.getElementById("tag").value;
    textv = document.getElementById("mes").value;

    console.log(JSON.stringify({tag: tagv, text: textv}));
    socket.send(JSON.stringify({tag: tagv, text: textv}));
}