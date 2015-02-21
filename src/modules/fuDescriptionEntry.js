function DescriptionEntry(fuCount, textDescription) {
    if (this instanceof DescriptionEntry) {
        this.fu = fuCount;
        this.text = textDescription;
    } else {
        return new DescriptionEntry(fuCount, textDescription);
    }
}

module.exports = {
    base: DescriptionEntry(20, 'Base score'),
    roundWind: DescriptionEntry(2, 'Round wind pair'),
    placeWind: DescriptionEntry(2, 'Position wind pair'),
    doubleWind: DescriptionEntry(4, 'Double wind pair'),
    sevenPairs: DescriptionEntry(25, 'Seven pairs'),
    closedHand: DescriptionEntry(10, 'Closed hand'),
    tsumo: DescriptionEntry(2, 'Self-draw bonus'),
    closedWait: DescriptionEntry(2, 'Closed wait'),
    edgeWait: DescriptionEntry(2, 'Edge wait'),
    pairWait: DescriptionEntry(2, 'Pair wait')
};
