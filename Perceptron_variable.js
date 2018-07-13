let random = (min, max) => {
  return Math.floor(min + Math.random()*(max+1 - min))
};

let map = (input,start,stop,min,max) => {
  return (input-start)*((max-min)/(stop-start))+min;
};

let activate = (input) => (input>=0) ? 1 : -1;

let multiplier = 1;
let adder = 100;

class Perceptron {
  constructor(input_amount = 2) {
    this.bias = 1;
    this.bias_weight = random(-10,10);
    this.input_amount = input_amount;
    this.weights = {x:random(-10,10),y:random(-10,10)};
    this.learning_rate = 0.1;
    this.spacing = width/(this.input_amount+1);
    this.max_size = width/this.input_amount/4;
  }

  guess(input_array) {
    if(input_array.length!=this.input_amount) {return}

    let sum = this.bias*this.bias_weight;
    for(let i in input_array) {
      sum+=input_array[i]*this.weights[i];
    }
      //console.log(sum);
    return activate(sum);
  }

  advance(input_array,target) {
    if(input_array.length!=this.input_amount) {return}

    const guess = this.guess(input_array);
    const error = target - guess;
    this.bias_weight += error * this.bias * this.learning_rate;

    for(let i in input_array)
      this.weights[i] += error * input_array[i] * this.learning_rate;
  }

  visualize(input_array) {
    this.weights.forEach((weight,i) => {
      let size = map(weight,-100,100,-1,1);
      let color = (size>0) ? "green" : "red";
          size = Math.abs(size);
          size = (size>1) ? 1 : size;
      line((i+1)*this.spacing-width/2,height/4,0,-height/4,"black");
      circle((i+1)*this.spacing-width/2,height/4,size*this.max_size,"fill",color,0.5);
    });
    let size = this.guess(input_array);
    let style = (size==1) ? "fill" : "stroke";
        size = Math.abs(size);
      circle(0,-height/4,this.max_size*size,style,"blue",0.5);
  }

  createBenchmark(length = 100) {
    this.benchmark = {state:"running",start_time:Date.now(),end_time:undefined,iterations:0,duration:0};
    this.system = new Array(length).fill(0).map(particle => new Benchmark_Particle());
    console.log("Function to evaluate : f(x) = ("+multiplier+") x + ("+adder+")");
  }

  Benchmark(func = Benchmark_standard_func) {

    this.system.forEach(particle => {
       particle.show(this);
     });
     line(-width/2,-func(-width/2),width/2,-func(width/2),"black",5);
     line(-width/2,-this.guessY(-width/2),width/2,-this.guessY(width/2),"orange",5)

    if(this.benchmark.state == "running") {
      this.system.forEach(particle => {
         this.advance([particle.x,particle.y],particle.state);
       });
      this.benchmark.iterations++;
      if(this.benchmark.iterations % 1 == 0) {
        this.benchmark.state = (this.system.every(z => this.guess([z.x,z.y]) == z.state)) ?
          "done" :
          "running";
      }
      if(this.benchmark.state == "done") {
        this.benchmark.end_time = Date.now();
        this.benchmark.duration = this.benchmark.end_time-this.benchmark.start_time;
        console.log("Benchmark is done! Duration : "+this.benchmark.duration/1000+" Seconds!");
        console.log("Benchmark took : "+this.benchmark.iterations+" iterations.")
        console.log("Weight distribution : "+Math.round(this.weights[0])+" | "+Math.round(this.weights[1])+" => [BIAS: "+Math.round(this.bias_weight)+"]");
        console.log("Evaluated Function : f(x) = ("+this.weights[0]/-this.weights[1]+") x + ("+this.bias_weight/this.weights[0]+")");
      }
    }
  }

  guessY(x) {
    return -(this.bias_weight/this.weights[1]) - (this.weights[0]/this.weights[1]) * x;;
  }
}

Benchmark_standard_func = (input) => multiplier*input+adder; //referring to f(x)=2x

class Benchmark_Particle {
  constructor(func) {
    if(typeof func != "function") {func = Benchmark_standard_func}
    this.x = random(-width/2,width/2);
    this.y = random(-height/2,height/2);
    this.state = (this.y > func(this.x)) ? 1 : -1;
  }

  static set_standard_function(func) {
    if(typeof func == "function" )
    Benchmark_standard_func = func;
  }

  show(Prcptrn) {
    if(!Prcptrn instanceof Perceptron)
    return;
    switch(this.state) {
      case 1 :
        circle(this.x,-this.y,10,"fill","green");
      break;
      case -1:
        circle(this.x,-this.y,10,"fill","red");
      break;
    }
    if(Prcptrn.guess([this.x,this.y]) == this.state)
      circle(this.x,-this.y,5,"fill","white");
    else
      circle(this.x,-this.y,5,"fill","black");
  }

}
