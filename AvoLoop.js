let AnimationLoopVariable;
let ClearCanvasOnLoop = true;
let FrameRate = 60;
let FrameIterator = 60/FrameRate-1;
let FPS = FrameRate;
let AvoLoop_before = Date.now();
let AvoLoop_now;

let BenchmarkStartTime = 0;
let BenchmarkStopTime = 0;

function Animation(active) {
  if(active) {
    AnimationLoopVariable = requestAnimationFrame(AnimationLoop);
  } else {
    cancelAnimationFrame(AnimationLoopVariable);
  }
}

function AnimationLoop() {
  if (typeof draw == 'function') {
    if(FrameIterator>=60/FrameRate-1) {
      AvoLoop_now = Date.now();
      FPS = Math.round(1000/(AvoLoop_now-AvoLoop_before));
      AvoLoop_before = AvoLoop_now;
    if(ClearCanvasOnLoop) {
      Canvas.Clear();
    }
    draw();
    FrameIterator=0;
  } else
    FrameIterator++;
  }
  AnimationLoopVariable = requestAnimationFrame(AnimationLoop);
}

function benchmark_start() {
  BenchmarkStartTime = new Date().getTime();
}

function benchmark_stop() {
  BenchmarkStopTime = new Date().getTime();
  console.log("Benchmark took : "+(BenchmarkStopTime-BenchmarkStartTime)/1000+" Seconds");
}
