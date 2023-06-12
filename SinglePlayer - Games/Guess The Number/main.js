let counter = document.getElementById('count');
count = 10;
let i = 1;
let inpbox = document.getElementById('inp');
let message = document.getElementById('message');
let check = document.getElementById('check');
let num = Math.floor(100 * Math.random()); //To Genrate Random Number Between 1 to 100
console.log(num);

function checkNumber() {

    counter.innerHTML = count;
    const inp = document.querySelector('input').value;
    if (inp == 0 || inp == null) {
        alert("Please Enter Valid Choise")
    }
    else if (inp > num) {
        message.innerHTML = "Enter Smaller Number";
    } else if (inp < num) {
        message.innerHTML = "Enter Greater Number";
    } else {
        message.classList.add("bg-body");
        message.style.color = "green";
        message.innerHTML = "Congratulation!!";
        inpbox.style.display = "none";
        check.style.display = "none";
    }
    if (count == 0) {
        // alert("You have a reached a Guess Limit");
        message.classList.add("bg-body");
        message.innerHTML = "Game Over!!"
        message.style.color = "red";
        check.style.display = "none";
        inpbox.style.display = "none";
    }
    count--;
}