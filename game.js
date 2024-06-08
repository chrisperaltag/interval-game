const intervals = {"C":0,"C#":1,"Db":1,"D":2,"D#":3,"Eb":3,"E":4,"Fb":4,"E#":5,"F":5,"F#":6,"Gb":6,"G":7,"G#":8,"Ab":8,"A":9,"A#":10,"Bb":10,"B":11,"Cb":11,"B#":0};
const augmentations = ["A","aum","aug","aumentado"], diminutions = ["D","dis","dim","disminuido"];
function showInstructions() { document.getElementById('content').innerHTML = '<h2>Instrucciones</h2><p>Ej: ¿Cuál es el intervalo de A a F#? Respuesta: 6M.</p><button class="button" onclick="startGame()">Iniciar</button>'; }
function startGame() {
    let score = 0, attempts = 3, notes = Object.keys(intervals), question, note1, note2;
    function askQuestion() {
        do { note1 = notes[Math.floor(Math.random() * notes.length)]; note2 = notes[Math.floor(Math.random() * notes.length)]; } while (Math.abs(intervals[note2] - intervals[note1]) > 2); 
        question = `¿Cuál es el intervalo de ${note1} a ${note2}?`; document.getElementById('content').innerHTML = `<h2>${question}</h2><input class="input" id="answer" placeholder="Respuesta"><button class="button" onclick="checkAnswer()">Enviar</button><p>Puntos: ${score}</p><p>Intentos: ${attempts}</p>`; }
    function checkAnswer() {
        const ans = document.getElementById('answer').value.trim().toLowerCase();
        const correct = intervals[note2] - intervals[note1] === 4 ? "3M" : intervals[note2] - intervals[note1] === 3 ? "3m" : "Incorrecto";
        if (ans === correct.toLowerCase()) { score += 10; alert("¡Correcto!"); } else { attempts -= 1; alert(`Incorrecto. Respuesta: ${correct}`); }
        attempts > 0 ? askQuestion() : document.getElementById('content').innerHTML = `<h2>Juego Terminado</h2><p>Puntuación: ${score}</p><button class="button" onclick="startGame()">Reiniciar</button><button class="button" onclick="location.reload()">Menú</button>`;
    }
    askQuestion();
}
