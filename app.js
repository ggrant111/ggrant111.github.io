document.getElementById("btn").addEventListener("click", joke);

async function joke() {
    let config = {
    headers: {
        Accept: "application/json",
        },
    };

    let a = await fetch("https://icanhazdadjoke.com/", config);
    let b = await a.json();
    document.getElementById("content").innerHTML = b.joke;
}

function playRandomSound() {
    const randomIndex = Math.floor(Math.random() * 4) + 1; // Generate a random number between 1 and 4
    const sound = document.getElementById(`sound${randomIndex}`);
    sound.play();
}
