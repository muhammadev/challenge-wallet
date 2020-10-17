let challenge_type = document.getElementById("challenge_type");
let days = document.getElementById("days");
let time_deadline = document.getElementById("deadline");

let d = new Date();

time_deadline? time_deadline.value = `${d.getHours()}:${d.getMinutes()}`: null;

if (challenge_type && challenge_type.checked) {
    days.disabled = true
}

challenge_type? challenge_type.onchange = function(e) {
    let checked = e.target.checked;

    console.log(checked, days);

    if (checked) {
        days.disabled = true
    } else {
        days.disabled = false
    }
} : null;

let left_times = document.querySelectorAll("span.left_time");
function updateDeadlines() {
    left_times.forEach(time => {
        console.log(time, time.dataset.deadline);
        let left_time_value = time.dataset.deadline,
            date = new Date(),
            currHs = date.getHours(),
            currMnts = date.getMinutes(),
            hour = Number(left_time_value.split(":")[0]),
            mnts = Number(left_time_value.split(":")[1]),
            leftTime = `${hour - currHs < 0 ? (hour - currHs) + 24 : hour - currHs}:${mnts - currMnts < 0? (mnts - currMnts) + 60 : mnts - currMnts}`;

        time.innerHTML = leftTime
    })
}
updateDeadlines()
setInterval(updateDeadlines, 60000);
