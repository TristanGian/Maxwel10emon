class Entropy {
	k = 10; // number of partitions per box, must be >= total num of particles
	totalEntropy;

	// calculates entropy as the log of the number of microstates
	calcEntropy(box) {
		n = box.numParticles;
		b = box.particleCounts["blue"];
		return n*Math.log(n/(n-k)) + k*Math.log((n-k)/(k-b)) + b*Math.log((k-b)/b);
	}

	calcTemp(box) {
		// get velocity of all particle
		// calculate kinetic energy
		// return average kinetic energy
	}
}
