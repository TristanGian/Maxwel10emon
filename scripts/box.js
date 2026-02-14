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
    removeColor(c) {
        this.particleCounts[c]--;
        this.totalBalls--;

    }

    // calculates entropy as the log of the multiplicity of the macrostate
	calcEntropy() {
        console.log(this.particleCounts);

		let k = this.totalBalls;
        let b = this.particleCounts["blue"];
        if (k < b) console.log('me retarded?');
		
		let n = (width*height/2)/(2*RADIUS); // number of partitions per box, ie. num of balls that can fit inside
		let entropy = n * Math.log(n / (n - k)) + k * Math.log((n - k) / (k - b)) + b * Math.log((k - b) / b);
        //let entropy = Math.log(this.factorial(k) / (this.factorial(k-b) *this.factorial(b) +1));
        return entropy
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