const arrow = document.getElementById("arrow");
const hammer = document.getElementById("hammer");
function getdeg(element){
    const style = getComputedStyle(element)
    const transform = style.getPropertyValue("transform");;
    if (transform == "none"){
        return 0
    }
    const valuesString = transform.replace("matrix(", "").replace(")", ""); // now the transform matrix looks like "a, b, val 3, val 4, val 5"
    const valuesArray = valuesString.split(","); // arrow of stringified no.s 
    const numbers = valuesArray.map(number => parseFloat(number.trim()));
    const a = numbers[0];
    const b = numbers[1];
    const radians = Math.atan2(b,a);
    let deg = (radians/Math.PI)*180;
    return deg;
}

function showdeg(element){
    let deg = getdeg(element);
    if (deg == 180 || deg == 0) return 0;
    else if (deg<0 && deg >= -90) return -deg;
    else if (deg < -90 && deg > -179.9999999) return 180+deg;
    else console.log("error")
}
function animateHammer(hammer,deg){
    return hammer.animate([
        {transform: `rotate(${deg}deg)`},
        {transform: `rotate(0deg)`}
    ],
    {
        duration: 1000,
        fill: "forwards"
    }
)
}
function movedot(dot,score){
    return dot.animate([
        {top: "370px"},
        {top: `${Math.round(370-(score/100)*276)}px`} // found that 276px difference is there.
    ],
    {
        duration: 2000,
        fill: "forwards"
    }
)
}
window.addEventListener("keydown", async function(event){ // made the function "async" so that we can wait for the hammer animation to finish before starting the dot animation
    if (event.code == "Space"){
        event.preventDefault();
        const transform_deg = getdeg(arrow);
        const show_deg = showdeg(arrow);
        console.log(transform_deg);
        arrow.style.transition = "none";
        arrow.style.animation = "none";
        /* always remember to not have a space between rotate and '(', or have any other miscellaneous white space or characters*/
        arrow.style.transform = `rotate(${transform_deg}deg)`;
        this.document.getElementById("degree_txt").textContent = `Degree stopped at: ${Math.round(show_deg)}°`;
        const score = (show_deg/90)*100;
        if (score>9) this.document.getElementById("score").textContent = `${Math.round(score)}`;
        else this.document.getElementById("score").textContent = `0${Math.round(score)}`;
        const hammerAnimation = animateHammer(hammer,show_deg);
        await hammerAnimation.finished;
        hammer.remove();
        const dot = this.document.getElementById("dot");
        movedot(dot,score);
    }
    if (event.key === "Enter") {
    location.reload();
}
})
window.document.getElementById("restart").addEventListener("click",() => {
    location.reload();
});