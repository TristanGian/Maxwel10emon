class Box {
    sizeX; // int
    sizeY; // int dimension of the boxes of the boxs
    totalBalls; // total number of balls
    particleCounts; // two keys, blue and red holding ints for the counts
    constructor(sizeX, sizeY, numBlue, numRed) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.totalBalls = numBlue + numRed;
        this.particleCounts = { 'blue': numBlue, 'red': numRed};
    }
    // replaces the particle counts with a new dictionary
    replaceCounts(dict) {
        this.particleCounts = dict;
    }

}
