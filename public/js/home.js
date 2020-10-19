// count down deadlines in upcoming deadline section in home page
let left_times = document.querySelectorAll("span.left_time");
function updateDeadlines() {
    left_times.forEach(time => {
        let left_time_value = time.dataset.deadline,
            date = new Date(),
            currHs = date.getHours(), // get current time hours
            currMnts = date.getMinutes(), // get current time minutes
            hour = Number(left_time_value.split(":")[0]), // extract the hours from deadline format (ex: "9:30" >> 9)
            mnts = Number(left_time_value.split(":")[1]), // same extraction for minutes (ex: "9:30" >> 30)
            // calculate how much time left
            leftTime = `${(hour - currHs <= 0 ? (hour - currHs) + 24 : hour - currHs) - 1}:${mnts - currMnts <= 0? (mnts - currMnts) + 60 : mnts - currMnts}`;

        // but if no time left, print "[ NOW ]"
        if ((hour - currHs === 0) && (mnts - currMnts === 0)) {
            leftTime = "[ NOW ]"
        }

        // print the result
        time.innerHTML = leftTime
    })
}
updateDeadlines() // call the functino once loaded
setInterval(updateDeadlines, 60000); // repeat the function every minute

// join challenge
let joinBtn = document.getElementById("join-btn")
joinBtn.addEventListener("click", function() {
    axios({
        url: "/join/"+joinBtn.dataset.id,
        method: "PUT"
    }).then(res => {
        console.log(res.status, res.data, res);
        if (res.status === "200") {
            joinBtn.innerHTML = "JOINED"
        }
    }).catch(err => console.log(err))
})