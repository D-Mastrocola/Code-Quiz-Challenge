let highscoreList = document.querySelector('.highscore-list');

for(let i = 0; i < 10; i++) {
    let listEl = document.createElement('li')
    listEl.innerHTML = '<h3>#' + (i+1) + ' Dominic: </h3><p>' + Math.floor(Math.random() * 500) + "</p>";
    highscoreList.appendChild(listEl);
}