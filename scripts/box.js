class Box {
    totalBalls; // total number of balls
    particleCounts; // two keys, blue and red holding ints for the counts
    constructor(numBlue, numRed) {
        this.totalBalls = numBlue + numRed;
        this.particleCounts = { 'blue': numBlue, 'red': numRed};
    }
    // replaces the particle counts with a new dictionary
    replaceCounts(dict) {
        this.particleCounts = dict;
    }

    // calculates entropy as the log of the multiplicity of the macrostate
	calcEntropy() {
        console.log(this.particleCounts);

		k = this.totalBalls;
		b = this.particleCounts["blue"];
		n = 10; // number of partitions per box, must be >= total num of particles
		return n * Math.log(n / (n - k)) + k * Math.log((n - k) / (k - b)) + b * Math.log((k - b) / b);
	}

	// calculates the temperature of a box
	calcTemp() {
		k = this.totalBalls;
		b = this.particleCounts["blue"];
		slowSpeed = 2 // magic number for now
		fastSpeed = 5 // magic number for now
		avgSpeed = (slowSpeed*b + fastSpeed*(k-b))/k
		return (avgSpeed**2)/3 // assuming mass and boltzman constant = 1
	}
}
