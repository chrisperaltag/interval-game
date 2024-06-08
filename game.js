const intervals = {
    "C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "Fb": 4, "E#": 5, "F": 5, "F#": 6, "Gb": 6,
    "G": 7, "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11, "Cb": 11, "B#": 0
};

const genericIntervals = {
    1: ["1J", "8J"],
    2: ["2m", "2M"],
    3: ["3m", "3M"],
    4: ["4J"],
    5: ["5J"],
    6: ["6m", "6M"],
    7: ["7m", "7M"]
};

const specificIntervals = {
    0: ["1J", "8J"],
    1: ["2m"],
    2: ["2M"],
    3: ["3m"],
    4: ["3M"],
    5: ["4J"],
    6: ["4A", "5d"],
    7: ["5J"],
    8: ["6m"],
    9: ["6M"],
    10: ["7m"],
    11: ["7M"],
    12: ["8J"]
};

const augmentations = ["A", "aum", "Aum", "aug", "Aug", "aumentado", "Aumentado"];
const diminutions = ["D", "dis", "Dis", "dim", "Dim", "disminuido", "Disminuido"];
const doubleAugmentations = ["DA", "daum", "DAum", "daug", "DAug", "doble aumentado", "Doble Aumentado"];
const doubleDiminutions = ["DD", "ddis", "DDis", "DDis#", "ddim", "DDim", "doble disminuido", "Doble Disminuido", "doble dis", "doble dim"];

function showInstructions() {
    document.getElementById('content').innerHTML = `
        <h2>Instrucciones del Juego</h2>
        <p>El objetivo del juego es identificar correctamente los intervalos musicales.</p>
        <p>Ejemplo 1: ¿Cuál es el intervalo de A a F#? Respuesta: 6M.</p>
        <p>Ejemplo 2: ¿Cuál es la 3m de D? Respuesta: F.</p>
        <p>Nomenclatura: M (Mayor), m (Menor), J (Justo), dis (Disminuido), aum (Aumentado)</p>
        <button class="button" onclick="startGame()">Iniciar Juego</button>
    `;
}

function startGame() {
    let score = 0;
    let attempts = 3;
    let currentQuestion;

    function askQuestion() {
        const notes = Object.keys(intervals);
        let note1, note2, genericInterval, specificInterval;

        do {
            note1 = notes[Math.floor(Math.random() * notes.length)];
            note2 = notes[Math.floor(Math.random() * notes.length)];
            genericInterval = getGenericInterval(note1, note2);
            specificInterval = getSpecificInterval(note1, note2);
        } while (isDoubleAugmentedOrDiminished(note1, note2));

        currentQuestion = { note1, note2 };

        document.getElementById('content').innerHTML = `
            <h2>Juego en Progreso</h2>
            <p id="question">¿Cuál es el intervalo de ${note1} a ${note2}?</p>
            <input type="text" class="input" id="answer" placeholder="Respuesta">
            <button class="button" id="submitBtn">Enviar</button>
            <p id="score">Puntos: ${score}</p>
            <p id="attempts">Intentos Restantes: ${attempts}</p>
        `;

        document.getElementById('submitBtn').addEventListener('click', checkAnswer);
    }

    function isDoubleAugmentedOrDiminished(note1, note2) {
        const interval = (intervals[note2] - intervals[note1] + 12) % 12;
        return doubleAugmentations.includes(interval) || doubleDiminutions.includes(interval);
    }

    function checkAnswer() {
        const answer = document.getElementById('answer').value.trim().toLowerCase();
        const { note1, note2 } = currentQuestion;
        const genericInterval = getGenericInterval(note1, note2);
        const specificInterval = getSpecificInterval(note1, note2);
        const correctAnswers = getCorrectAnswers(genericInterval, specificInterval);

        if (correctAnswers.includes(answer)) {
            score += 10;
            alert("¡Correcto!");
        } else {
            attempts -= 1;
            alert(`Incorrecto. La respuesta correcta es ${correctAnswers[0]}.`);
        }

        if (attempts > 0) {
            askQuestion();
        } else {
            endGame();
        }
    }

    function getGenericInterval(note1, note2) {
        const notes = ["C", "D", "E", "F", "G", "A", "B"];
        const index1 = notes.indexOf(note1[0]);
        const index2 = notes.indexOf(note2[0]);
        return (index2 - index1 + 7) % 7 + 1;
    }

    function getSpecificInterval(note1, note2) {
        return (intervals[note2] - intervals[note1] + 12) % 12;
    }

    function getCorrectAnswers(genericInterval, specificInterval) {
        const genericNames = genericIntervals[genericInterval];
        let specificName = specificIntervals[specificInterval][0];

        if (specificInterval === 6 || specificInterval === 10) {
            if (genericNames.includes("2m") || genericNames.includes("3m") || genericNames.includes("6m") || genericNames.includes("7m")) {
                specificName = "dis";
            } else {
                specificName = "dim";
            }
        } else if (specificInterval === 8 || specificInterval === 9 || specificInterval === 3 || specificInterval === 4) {
            if (genericNames.includes("2M") || genericNames.includes("3M") || genericNames.includes("6M") || genericNames.includes("7M")) {
                specificName = "m";
            } else {
                specificName = "aum";
            }
        } else if (specificInterval === 6) {
            specificName = "d";
        }

        let correctAnswers = [];
        if (genericInterval === 1 && specificInterval === 1) {
            correctAnswers.push("1dis", "8dis");
        } else {
            genericNames.forEach(name => {
                if (name.includes("A")) {
                    augmentations.forEach(aug => correctAnswers.push(name[0] + aug));
                } else if (name.includes("d")) {
                    diminutions.forEach(dim => correctAnswers.push(name[0] + dim));
                } else {
                    correctAnswers.push(name);
                }
            });
        }

        if (specificName === "A" || specificName === "d") {
            specificName = specificName === "A" ? "aum" : "dis";
        }
        augmentations.forEach(aug => correctAnswers.push(genericInterval + aug));
        diminutions.forEach(dim => correctAnswers.push(genericInterval + dim));

        return correctAnswers.map(ans => ans.toLowerCase());
    }

    function endGame() {
        document.getElementById('content').innerHTML = `
            <h2>¡Juego Terminado!</h2>
            <p>Puntuación Final: ${score}</p>
            <button
