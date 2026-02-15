class Box {
    totalBalls; // total number of balls
    particleCounts; // two keys, blue and red holding ints for the counts
    constructor(numBlue, numRed) {
        this.totalBalls = numBlue + numRed;
        this.particleCounts = { 'blue': numBlue, 'red': numRed};
    }
    // replaces the particle counts with a new dictionary
    addColor(c) {
        this.particleCounts[c]++;
        this.totalBalls++;
    }

	resetColors() {
		this.particleCounts['blue'] = 0;
		this.particleCounts['red'] = 0;
		this.totalBalls = 0;
	}

    // calculates entropy as the log of the multiplicity of the macrostate
	calcEntropy() {
        //console.log(this.particleCounts);

		let k = this.totalBalls;
        let b = this.particleCounts["blue"];
		let n = (width*height/2)/(2*RADIUS); // number of partitions per box, ie. num of balls that can fit inside
		let entropy;

		if (k-b <= 0)
			entropy = n * Math.log(n / (n - k)) + k * Math.log((n - k) / 1) + b * Math.log(1 / b); 
		else
			entropy = n * Math.log(n / (n - k)) + k * Math.log((n - k) / (k - b)) + b * Math.log((k - b) / (b+1));
        //let entropy = Math.log(this.factorial(n) / (this.factorial(k)*this.factorial(n-k))) + Math.log(this.factorial(k) / (this.factorial(k-b) *this.factorial(b)));
        return entropy
	}

	static calcMaxEntropy() {
		let k = ballCount/2;
        let b = k/2;
		let n = (width*height/2)/(2*RADIUS); // number of partitions per box, ie. num of balls that can fit inside
		let entropy;

		entropy = n * Math.log(n / (n - k)) + k * Math.log((n - k) / (k - b)) + b * Math.log((k - b) / b);
        return 2*entropy
	}

	// calculates the temperature of a box
	calcTemp() {
		k = this.totalBalls;
		b = this.particleCounts["blue"];
		slowSpeed = 2; // magic number for now
		fastSpeed = 5; // magic number for now
		avgSpeed = (slowSpeed*b + fastSpeed*(k-b))/k;
		return (avgSpeed**2)/3; // assuming mass and boltzman constant = 1
	}

    factorial(n) {
        if (n < 0) {
          return "Factorial is not defined for negative numbers";
        }
        // Base case: Factorial of 0 or 1 is 1
        if (n === 0 || n === 1) {
          return 1;
        }
        // Recursive case: n! = n * (n-1)!
        return n * this.factorial(n - 1);
      }
}
