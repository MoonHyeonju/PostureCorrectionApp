const URL = "https://teachablemachine.withgoogle.com/models/wJqtqOTGu/";
let model, webcam, ctx, labelContainer, maxPredictions;
let minutes = 0;
let seconds = 0;
let tenMillis = 0;
let isCorrectPose = false;
var audio = new Audio('alert.mp3');
const appendTens = document.getElementById("tenMillis");
const appendSeconds = document.getElementById("seconds");
const appendMinutes = document.getElementById("minutes");

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const size = 520;
    const flip = true;
    webcam = new tmPose.Webcam(size, size, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    const canvas = document.getElementById("canvas");
    canvas.width = size;
    canvas.height = size;
    ctx = canvas.getContext("2d");
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

function stop() {
    stopTimer();
    webcam.stop();
}

function startTimer() { // 새로 추가 10밀리초마다 갱신
    startTime = new Date();
    timerInterval = setInterval(operateTimer, 10);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;

    // 타이머 정지 시간 계산
    const currentTime = new Date(); // 현재 시간
    const timeDiff = currentTime - startTime; // 경과 시간 (밀리초 단위)

    const milliseconds = timeDiff % 100; // 밀리초
    const seconds = Math.floor((timeDiff / 1000) % 60); // 초
    const minutes = Math.floor(timeDiff / 1000 / 60); // 분

    appendTens.textContent = milliseconds > 9 ? milliseconds : '0' + milliseconds;
    appendSeconds.textContent = seconds > 9 ? seconds : '0' + seconds;
    appendMinutes.textContent = minutes > 9 ? minutes : '0' + minutes;
}

function operateTimer() {
    const currentTime = new Date(); // 현재 시간
    const timeDiff = currentTime - startTime; // 경과 시간 (밀리초 단위)

    const milliseconds = timeDiff % 100; // 밀리초
    const seconds = Math.floor((timeDiff / 1000) % 60); // 초
    const minutes = Math.floor(timeDiff / 1000 / 60); // 분

    appendTens.textContent = milliseconds > 9 ? milliseconds : '0' + milliseconds;
    appendSeconds.textContent = seconds > 9 ? seconds : '0' + seconds;
    appendMinutes.textContent = minutes > 9 ? minutes : '0' + minutes;
}

function resetTimer() {
    tenMillis = 0;
    seconds = 0;
    minutes = 0;

    appendTens.textContent = "00";
    appendSeconds.textContent = "00";
    appendMinutes.textContent = "00";

    // 타이머 초기화 후 시작 시간도 초기화
    startTime = null;
}

async function loop(timestamp) {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    const prediction = await model.predict(posenetOutput);

    for (let i = 0; i < maxPredictions; i++) {      // prediction[0] : 바른 자세    prediction[1] : 경고
        if (prediction[0].probability.toFixed(2) > 0.9) {   // 바른 자세 점수가 0.9 이상일 때 (0.0 ~ 1.0)
            if (!isCorrectPose) {
                isCorrectPose = true;
                startTimer();
                audio.stop();
            }
        } else {
            stopTimer();
            if (isCorrectPose) {
                isCorrectPose = false;

                stopTimer();
                audio.play();
            }
        }

        // 점수 확인용
        // const classPrediction =
        //      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        // labelContainer.childNodes[i].innerHTML = classPrediction;
    }

    drawPose(pose);
}

function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0);
        if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
    }
}

function record() {
    var currentDate = new Date();
    var startDate = new Date('2023-05-24');
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1;
    var day = currentDate.getDate();

    document.getElementById("rec").innerHTML = `${year}/${month}/${day} - ${appendMinutes.textContent}:${appendSeconds.textContent}:${appendTens.textContent}`;

    // 시작 날짜부터 현재까지
    while (startDate <= currentDate) {
        records.push(`${year}/${month}/${day} - ${appendMinutes.textContent}:${appendSeconds.textContent}:${appendTens.textContent}`);
        startDate.setDate(startDate.getDate() + 1);
    }
}