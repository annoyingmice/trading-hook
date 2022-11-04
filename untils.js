Number.prototype.toFixedNoRound = function(precision = 1) {
    console.log(this.toString());
    return `${this.toString()}`.match(new RegExp(`^-?\\d+(?:\.\\d{0,${precision}})?`))[0];
}