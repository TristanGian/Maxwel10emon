class Entropy {
	n = 10; // number of partitions per box, must be >= total num of particles
	totalEntropy;

	// calculates entropy as the log of the multiplicity of the macrostate
	calcEntropy(box) {
		k = box.numParticles;
		b = box.particleCounts["blue"];
		return n * Math.log(n / (n - k)) + k * Math.log((n - k) / (k - b)) + b * Math.log((k - b) / b);
	}

	// calculates the temperature of a box
	calcTemp(box) {
		k = box.numParticles;
		b = box.particleCounts["blue"];
		slowSpeed = 2 // magic number for now
		fastSpeed = 5 // magic number for now
		avgSpeed = (slowSpeed*b + fastSpeed*(k-b))/k
		return (avgSpeed**2)/3 // assuming mass and boltzman constant = 1
	}
}
