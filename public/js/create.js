let challenge_type = document.getElementById("challenge_type");
let days = document.getElementById("days");
let deadline = document.getElementById("deadline");
let d = new Date();

deadline.value = `${d.getHours() < 10? "0"+d.getHours() : d.getHours()}:${d.getMinutes() < 10? "0"+d.getMinutes() : d.getMinutes()}`

days.disabled = challenge_type.checked? true : false

challenge_type.onchange = function(e) {
    let checked = e.target.checked;
    days.disabled = checked? true : false
}