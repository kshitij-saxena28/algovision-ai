let stepTimer = null;
let voiceEnabled = true;
let speech = new SpeechSynthesisUtterance();
speech.rate = 1;
speech.pitch = 1;
speech.volume = 1;function speak(text, callback){

    if(!voiceEnabled){
        if(callback) callback();
        return;
    }

    const speech = new SpeechSynthesisUtterance(text);

    speech.rate = 0.95;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onend = () => {
        if(callback) callback();
    };

    window.speechSynthesis.speak(speech);
}function pause(){
    isRunning = false;
    clearTimeout(stepTimer);
    window.speechSynthesis.cancel();
}
let currentAlgo = null;
let arr = [];
let steps = [];
let currentStep = -1;
let interval = null;
let isRunning = false;

const speedSlider = document.getElementById("speed");

/* ================= NAV ================= */

function openAlgo(algo){
    currentAlgo = algo;

    document.getElementById("home").classList.remove("active");
    document.getElementById("app").classList.add("active");
    document.getElementById("title").innerText = algo.toUpperCase();
 

    if(["bubble","insertion","selection"].includes(algo)){
        document.getElementById("searchInput").style.display="none";
    } else {
        document.getElementById("searchInput").style.display="inline";
    }
 setDefinition();

    setupPanel();
}

function goHome(){

    stop();

    // Clear algorithm state
    steps = [];
    currentStep = -1;
    arr = [];

    // Clear inputs
    document.getElementById("arrayInput").value = "";
    document.getElementById("searchInput").value = "";

    // Clear bars
    barsContainer.innerHTML = "";

    // Reset panel
    const panel = document.querySelector(".panel");
    if(panel){
        panel.innerHTML = `
            <div id="message" class="explain">Choose an algorithm to begin.</div>
        `;
    }

    document.getElementById("app").classList.remove("active");
    document.getElementById("home").classList.add("active");
}

/* ================= PANEL ================= */

function setupPanel(){
    const panel = document.querySelector(".right-panel");

    panel.innerHTML = `
    <div id="definitionBox" class="definition-box"></div>
    <div id="message" class="explain">Ready to start.</div>
    <hr>
    <div id="codeBox" class="pseudoBox"></div>
`;

    const codeBox = document.getElementById("codeBox");
    const definitionBox = document.getElementById("definitionBox");

if(currentAlgo==="bubble"){
    definitionBox.innerHTML = `
        <h3>📘 Bubble Sort</h3>
        <p>
        Bubble Sort compares adjacent numbers and swaps them if needed.
        In each round, the biggest number moves to the end.
        </p>
    `;
}

if(currentAlgo==="insertion"){
    definitionBox.innerHTML = `
        <h3>📘 Insertion Sort</h3>
        <p>
        Insertion Sort takes one number and inserts it
        into its correct position among sorted numbers.
        </p>
    `;
}

if(currentAlgo==="selection"){
    definitionBox.innerHTML = `
        <h3>📘 Selection Sort</h3>
        <p>
        Selection Sort finds the smallest number
        and places it at the beginning in each round.
        </p>
    `;
}

if(currentAlgo==="linear"){
    definitionBox.innerHTML = `
        <h3>📘 Linear Search</h3>
        <p>
        Linear Search checks elements one by one
        until it finds the target value.
        </p>
    `;
}

if(currentAlgo==="binary"){
    definitionBox.innerHTML = `
        <h3>📘 Binary Search</h3>
        <p>
        Binary Search works only on sorted arrays.
        It repeatedly divides the array in half to search faster.
        </p>
    `;
}

    let lines = [];

    if(currentAlgo==="bubble"){
        lines = [
            "for(int i = 0; i < n-1; i++) {",
            "  for(int j = 0; j < n-i-1; j++) {",
            "    if(arr[j] > arr[j+1]) {",
            "      swap(arr[j], arr[j+1]);",
            "    }",
            "  }",
            "}"
        ];
    }

    if(currentAlgo==="insertion"){
        lines = [
            "for(int i = 1; i < n; i++) {",
            "  int key = arr[i];",
            "  int j = i-1;",
            "  while(j >= 0 && arr[j] > key) {",
            "    arr[j+1] = arr[j];",
            "    j--;",
            "  }",
            "  arr[j+1] = key;",
            "}"
        ];
    }

    if(currentAlgo==="selection"){
        lines = [
            "for(int i = 0; i < n-1; i++) {",
            "  int minIndex = i;",
            "  for(int j = i+1; j < n; j++) {",
            "    if(arr[j] < arr[minIndex])",
            "      minIndex = j;",
            "  }",
            "  swap(arr[i], arr[minIndex]);",
            "}"
        ];
    }

    if(currentAlgo==="linear"){
        lines = [
            "for(int i = 0; i < n; i++) {",
            "  if(arr[i] == target)",
            "    return i;",
            "}",
            "return -1;"
        ];
    }

    if(currentAlgo==="binary"){
        lines = [
            "int low = 0, high = n-1;",
            "while(low <= high) {",
            "  int mid = low + (high - low)/2;",
            "  if(arr[mid] == target)",
            "    return mid;",
            "  else if(arr[mid] < target)",
            "    low = mid + 1;",
            "  else",
            "    high = mid - 1;",
            "}",
            "return -1;"
        ];
    }

    lines.forEach((line,i)=>{
        codeBox.innerHTML += `<div class="code-line" id="code${i}">${line}</div>`;
    });
}
function highlightCode(index){
    document.querySelectorAll(".code-line")
        .forEach(el=>el.classList.remove("active-line"));

    if(index === undefined || index === null) return;

    const el = document.getElementById("code"+index);
    if(el) el.classList.add("active-line");
}

function setDefinition(){

    const box = document.getElementById("definitionBox");
    if(!box) return;

    if(currentAlgo==="bubble"){
        box.innerHTML = `
            <h3>📘 Bubble Sort</h3>
            <p>
            Bubble Sort compares neighboring numbers.
            Bigger numbers slowly move to the end.
            </p>
        `;
    }

    if(currentAlgo==="insertion"){
        box.innerHTML = `
            <h3>📘 Insertion Sort</h3>
            <p>
            Insertion Sort takes one number
            and places it into its correct position.
            </p>
        `;
    }

    if(currentAlgo==="selection"){
        box.innerHTML = `
            <h3>📘 Selection Sort</h3>
            <p>
            Selection Sort finds the smallest number
            and fixes it at the front.
            </p>
        `;
    }

    if(currentAlgo==="linear"){
        box.innerHTML = `
            <h3>📘 Linear Search</h3>
            <p>
            Linear Search checks each number one by one
            until it finds the target.
            </p>
        `;
    }

    if(currentAlgo==="binary"){
        box.innerHTML = `
            <h3>📘 Binary Search</h3>
            <p>
            Binary Search works on sorted arrays
            and removes half of the search space each step.
            </p>
        `;
    }
}
/* ================= ARRAY ================= */

function parseArray(){
    arr = document.getElementById("arrayInput").value
        .split(",")
        .map(x=>parseInt(x.trim()))
        .filter(x=>!isNaN(x));
}
function createBars(){
    const barsContainer = document.getElementById("bars");
    if (!barsContainer) return;

    barsContainer.innerHTML = "";

    arr.forEach(v => {
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = v * 5 + "px";
        bar.innerHTML = `<span>${v}</span>`;
        barsContainer.appendChild(bar);
    });
}

/* ================= STEP ENGINE ================= */
function addStep(obj){
    if (steps.length > 0 && obj.line === undefined) {
        obj.line = steps[steps.length - 1].line;
    }
    steps.push(obj);
}
/* ---------- BUBBLE ---------- */

function buildBubble(){
    steps=[];
    let temp=[...arr];
    let n=temp.length;

    for(let i=0;i<n-1;i++){

        addStep({
            state:[...temp],
            line:0,
            message:`Round ${i+1} begins.
In this round, the biggest number will move toward the end.`
        });

        for(let j=0;j<n-i-1;j++){

            addStep({
                state:[...temp],
                highlight:[j,j+1],
                line:2,
                message:`We compare ${temp[j]} and ${temp[j+1]}.
If the left number is bigger, it should move to the right.`
            });

            if(temp[j] > temp[j+1]){

                addStep({
                    state:[...temp],
                    highlight:[j,j+1],
                    message:`Since ${temp[j]} is bigger than ${temp[j+1]},
we swap them so the bigger number moves right.`
                });

                [temp[j],temp[j+1]]=[temp[j+1],temp[j]];

                addStep({
                    state:[...temp],
                    highlight:[j,j+1],
                    line:3,
                    message:`Now they have swapped places.
The bigger number is moving toward its correct position.`
                });

            } else {

                addStep({
                    state:[...temp],
                    highlight:[j,j+1],
                    message:`${temp[j]} is NOT bigger than ${temp[j+1]}.
They are already in correct order, so we do nothing.`
                });
            }
        }
    }

    addStep({
        state:[...temp],
        message:`All numbers are now sorted from smallest to largest.
Bubble Sort is complete!`
    });
}


/* ---------- INSERTION ---------- */

function buildInsertion(){
    steps=[];
    let temp=[...arr];
    let n=temp.length;

    for(let i=1;i<n;i++){

        let key=temp[i];
        let j=i-1;

        addStep({
            state:[...temp],
            highlight:[i],
            line:1,
            message:`We pick ${key}.
Think of it like a student trying to stand in the correct position.`
        });

        while(j>=0 && temp[j]>key){

            addStep({
                state:[...temp],
                highlight:[j],
                line:3,
                message:`Is ${temp[j]} bigger than ${key}? Yes!
So ${temp[j]} must move one step to the right.`
            });

            temp[j+1]=temp[j];

            addStep({
                state:[...temp],
                highlight:[j+1],
                line:4,
                message:`We shift ${temp[j+1]} right to make space for ${key}.`
            });

            j--;
        }

        if(j>=0){
            addStep({
                state:[...temp],
                highlight:[j],
                message:`Now ${temp[j]} is NOT bigger than ${key}.
So we stop shifting.`
            });
        }

        temp[j+1]=key;

        addStep({
            state:[...temp],
            highlight:[j+1],
            line:7,
            message:`We place ${key} in the empty space.
It is now in its correct position!`
        });
    }

    addStep({
        state:[...temp],
        message:`Insertion Sort is complete!
All numbers are in ascending order.`
    });
}

/* ---------- SELECTION ---------- */
function buildSelection(){
    steps=[];
    let temp=[...arr];
    let n=temp.length;

    for(let i=0;i<n-1;i++){

        let min=i;

        addStep({
            state:[...temp],
            line:1,
            message:`We assume the smallest number is at position ${i}.
Now we will check if that is true.`
        });

        for(let j=i+1;j<n;j++){

            addStep({
                state:[...temp],
                highlight:[min,j],
                line:3,
                message:`We compare ${temp[min]} and ${temp[j]}
to find the smallest number.`
            });

            if(temp[j]<temp[min]){

                min=j;

                addStep({
                    state:[...temp],
                    highlight:[min],
                    message:`${temp[min]} is smaller!
It becomes our new minimum.`
                });
            }
        }

        [temp[i],temp[min]]=[temp[min],temp[i]];

        addStep({
            state:[...temp],
            highlight:[i],
            line:6,
            message:`We place the smallest number at position ${i}.
That position is now fixed forever.`
        });
    }

    addStep({
        state:[...temp],
        message:`Selection Sort is complete!
Everything is sorted correctly.`
    });
}

/* ---------- LINEAR SEARCH ---------- */
function buildLinear(){
    steps=[];
    let target=parseInt(document.getElementById("searchInput").value);

    for(let i=0;i<arr.length;i++){

        addStep({
            state:[...arr],
            highlight:[i],
            line:0,
            message:`We check if ${arr[i]} equals ${target}.`
        });

        if(arr[i]===target){

            addStep({
                state:[...arr],
                highlight:[i],
                line:1,
                message:`Yes! ${arr[i]} equals ${target}.
We found it at index ${i}.`
            });

            return;
        }

        addStep({
            state:[...arr],
            highlight:[i],
            message:`No, this is not ${target}.
So we move to the next number.`
        });
    }

    addStep({
        state:[...arr],
        message:`We checked all numbers.
${target} was not found.`
    });
}

/* ---------- BINARY SEARCH (C++ LOGIC) ---------- */
function buildBinary(){
    steps=[];
    let target=parseInt(document.getElementById("searchInput").value);
    let temp=[...arr].sort((a,b)=>a-b);

    let low=0;
    let high=temp.length-1;

    addStep({
        state:[...temp],
        message:`Binary search only works on sorted arrays.
So first we sort the numbers.`
    });

    while(low<=high){

        let mid = low + Math.floor((high-low)/2);

        addStep({
            state:[...temp],
            highlight:[mid],
            line:2,
            message:`low = ${low}, high = ${high}.
We calculate mid = ${mid}.
The middle number is ${temp[mid]}.`
        });

        if(temp[mid]===target){

            addStep({
                state:[...temp],
                highlight:[mid],
                line:3,
                message:`${temp[mid]} equals ${target}.
We found the target!`
            });

            return;
        }

        if(temp[mid] < target){

            addStep({
                state:[...temp],
                highlight:[mid],
                line:5,
                message:`${temp[mid]} is smaller than ${target}.
So the answer must be on the RIGHT side.
We move low to ${mid+1}.`
            });

            low = mid + 1;

        } else {

            addStep({
                state:[...temp],
                highlight:[mid],
                line:7,
                message:`${temp[mid]} is bigger than ${target}.
So the answer must be on the LEFT side.
We move high to ${mid-1}.`
            });

            high = mid - 1;
        }
    }

    addStep({
        state:[...temp],
        message:`We searched the entire range.
${target} was not found.`
    });
}

/* ================= RENDER ================= */
function updateBars(state){
    const bars = document.querySelectorAll("#bars .bar");
    if (!bars.length) return;

    state.forEach((value, index) => {
        if (!bars[index]) return;
        bars[index].style.height = value * 5 + "px";
        bars[index].querySelector("span").innerText = value;
    });
}
function renderStep(step){

    updateBars(step.state);

    const bars=document.querySelectorAll(".bar");
    bars.forEach(bar=>bar.classList.remove("active"));

    if(step.highlight){
        step.highlight.forEach(i=>{
            bars[i]?.classList.add("active");
        });
    }

    highlightCode(step.line);

   document.getElementById("message").innerText = step.message;


}

/* ================= SPEED ================= */

function getSpeed(){
    const value = parseInt(speedSlider.value);
   return 3000 - (speedSlider.value * 20);
}

/* ================= CONTROLS ================= */

function buildSteps(){
    if(currentAlgo==="bubble") buildBubble();
    if(currentAlgo==="insertion") buildInsertion();
    if(currentAlgo==="selection") buildSelection();
    if(currentAlgo==="linear") buildLinear();
    if(currentAlgo==="binary") buildBinary();
}function start(){

    if(isRunning) return;

    parseArray();
    createBars();
    buildSteps();

    currentStep = -1;
    isRunning = true;

    runStep();
}function runStep(){

    if(!isRunning) return;

    if(currentStep >= steps.length - 1){
        pause();
        return;
    }

    currentStep++;

    const step = steps[currentStep];

    renderStep(step);

    if(voiceEnabled){

        speak(step.message, () => {
            if(isRunning){
                runStep();
            }
        });

    } else {

        stepTimer = setTimeout(runStep, getSpeed());

    }

}
runStep();
function pause(){
    isRunning = false;
    window.speechSynthesis.cancel();
}
function stop(){
    isRunning = false;
    window.speechSynthesis.cancel();

    currentStep = -1;

    parseArray();
    createBars();
}
function nextStep(){

    pause();

    if(currentStep >= steps.length - 1) return;

    currentStep++;
    renderStep(steps[currentStep]);
}
function prevStep(){

    pause();

    if(currentStep <= 0) return;

    currentStep--;
    renderStep(steps[currentStep]);
}
function restart(){
    stop();
    start();
}
function chooseLevel(level) {
    localStorage.setItem("userLevel", level);
    window.location.href = "algorithms.html";
}

function startQuiz() {
    // Simple example quiz logic (temporary)
    let score = Math.floor(Math.random() * 3);

    let level;
    if (score === 0) level = "beginner";
    else if (score === 1) level = "intermediate";
    else level = "pro";

    localStorage.setItem("userLevel", level);
    window.location.href = "algorithms.html";
}
document.addEventListener("DOMContentLoaded", function () {
    const level = localStorage.getItem("userLevel");

    if (!level) return;

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        const allowedLevels = card.getAttribute("data-level");

        if (!allowedLevels.includes(level)) {
            card.style.display = "none";
        }
    });
});
function goToLevel(level) {
    window.location.href = level + ".html";
}
function toggleQuiz() {
    const quiz = document.getElementById("quiz-box");
    quiz.style.display = quiz.style.display === "block" ? "none" : "block";
}

function submitQuiz() {
    const q1 = parseInt(document.getElementById("q1").value || 0);
    const q2 = parseInt(document.getElementById("q2").value || 0);
    const q3 = parseInt(document.getElementById("q3").value || 0);

    const score = q1 + q2 + q3;

    let level;
    if (score <= 2) level = "beginner";
    else if (score <= 4) level = "intermediate";
    else level = "pro";

    window.location.href = level + ".html";
}
function openQuiz() {
    document.getElementById("quiz-box").style.display = "block";
    document.getElementById("quiz-overlay").style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeQuiz() {
    document.getElementById("quiz-box").style.display = "none";
    document.getElementById("quiz-overlay").style.display = "none";
    document.body.style.overflow = "auto";
}
function submitQuiz() {
    const q1 = parseInt(document.getElementById("q1").value || 0);
    const q2 = parseInt(document.getElementById("q2").value || 0);
    const q3 = parseInt(document.getElementById("q3").value || 0);

    const score = q1 + q2 + q3;

    let page;
    if (score <= 2) page = "beginner.html";
    else if (score <= 4) page = "intermediate.html";
    else page = "pro.html";

    window.location.href = page;
}
const topics = [
    { name: "Bubble Sort", page: "bubble-sort.html" },
    { name: "Linear Search", page: "linear-search.html" },

    { name: "Insertion Sort", page: "insertion-sort.html" },
    { name: "Selection Sort", page: "selection-sort.html" },
    { name: "Binary Search", page: "binary-search.html" },

    { name: "Merge Sort", page: "merge-sort.html" },
    { name: "Quick Sort", page: "quick-sort.html" },
    { name: "Dynamic Programming", page: "dynamic-programming.html" },
    { name: "Graph Traversal", page: "graph-traversal.html" }
];function searchTopics(query) {
    const resultsBox = document.getElementById("searchResults");
    if (!resultsBox) return;

    resultsBox.innerHTML = "";

    if (!query.trim()) {
        resultsBox.style.display = "none";
        return;
    }

    const filtered = topics.filter(t =>
        t.name.toLowerCase().includes(query.toLowerCase())
    );

    filtered.forEach(topic => {
        const div = document.createElement("div");
        div.className = "search-item";
        div.innerHTML = topic.name;
        div.onclick = () => {
            window.location.href = topic.page;
        };
        resultsBox.appendChild(div);
    });

    resultsBox
    resultsBox.style.display = "block";
}
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".algo-card").forEach(card => {
        card.addEventListener("click", () => {
            const page = card.getAttribute("data-page");
            if (page) {
                window.location.href = page;
            }
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
    if (document.body.dataset.algo) {
        currentAlgo = document.body.dataset.algo;
        setupPanel();
    }
});
function setActiveButton(btn) {
    document.querySelectorAll(".controls button")
        .forEach(b => b.classList.remove("active-btn"));

    if (btn) btn.classList.add("active-btn");
}
const speedValue = document.getElementById("speedValue");

speedSlider.addEventListener("input", () => {
    speedValue.innerText = speedSlider.value + "%";
});

document.addEventListener("DOMContentLoaded", () => {
    const algo = document.body.dataset.algo;
    if (!algo) return;

    currentAlgo = algo;
    setupPanel();
});function toggleVoice(){

    voiceEnabled = !voiceEnabled;

    const btn = document.getElementById("voiceBtn");

    if(voiceEnabled){
        btn.innerText = "🔊 Voice ON";
    } else {
        btn.innerText = "🔇 Voice OFF";
        window.speechSynthesis.cancel();
    }

}
function resume(){

    if(isRunning) return;

    isRunning = true;

    runStep();
}