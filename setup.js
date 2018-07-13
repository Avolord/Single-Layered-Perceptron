Animation(true);
let P1 = new Perceptron(2);
P1.createBenchmark(1000);
function setup() {
  P1.Benchmark();
  //P1.visualize([0,0]);
//FrameRate = 10;
}

function draw() {
  P1.Benchmark();
  //P1.visualize([0,0]);
  document.getElementById("Count").innerHTML = FPS;
}
