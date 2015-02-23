var _ = require('lodash');

function YakuListItem(name, hanCountOpen, hanCountClosed) {
    this.name = name;
    this.han = {
        open: hanCountOpen,
        closed: hanCountClosed
    };
}

function YakuList() {
    this.list = [];
}

YakuList.prototype.add = function(yaku) {
    this.list.push(yaku);
};

YakuList.prototype.countTotal = function() {
    var totalHan = [0, 0];
    _.each(this.list, function(yaku) {
        totalHan[0] += yaku.han.open;
        totalHan[1] += yaku.han.closed;
    });

    return new YakuListItem('Total:', totalHan[0], totalHan[1]);
};

module.exports = YakuList;
module.exports.yaku = {
    'pinfu': new YakuListItem('Pin-fu', 0, 1),
    'tanyao': new YakuListItem('Tan-yao', 1, 1), // TODO: конфигурация по правилу куитан
    'iipeiko': new YakuListItem('Iipeiko', 0, 1),
    'haku': new YakuListItem('Yaku-hai (haku)', 1, 1),
    'hatsu': new YakuListItem('Yaku-hai (hatsu)', 1, 1),
    'chun': new YakuListItem('Yaku-hai (chun)', 1, 1),
    'placeWind': new YakuListItem('Yaku-hai (wind of place)', 1, 1),
    'roundWind': new YakuListItem('Yaku-hai (wind of round)', 1, 1),
    'chanta': new YakuListItem('Chanta', 1, 2),
    'honroto': new YakuListItem('Honroto', 2, 2),
    'ittsu': new YakuListItem('Ittsu', 1, 2),
    'sanshoku': new YakuListItem('Sanshoku doujun', 1, 2),
    'toitoi': new YakuListItem('Toitoi', 2, 2),
    'sanshokudoko': new YakuListItem('Sanshoku dokou', 2, 2),
    'sanankou': new YakuListItem('Sanankou', 2, 2),
    'sankantsu': new YakuListItem('Sankantsu', 2, 2),
    'shosangen': new YakuListItem('Shosangen', 2, 2),
    'chiitoitsu': new YakuListItem('Chiitoitsu', NaN, 2),
    'ryanpeiko': new YakuListItem('Ryanpeikou', 0, 3),
    'junchan': new YakuListItem('Junchan', 2, 3),
    'honitsu': new YakuListItem('Honitsu', 2, 3),
    'chinitsu': new YakuListItem('Chinitsu', 5, 6),
    'daisangen': new YakuListItem('Daisangen', -1, -1),
    'suuankou': new YakuListItem('Suuankou', 0, -1),
    'tsuisou': new YakuListItem('Tsuuiisou', -1, -1),
    'shosuushi': new YakuListItem('Shosuushi', -1, -1),
    'daisuushi': new YakuListItem('Daisuushi', -1, -1),
    'ryuisou': new YakuListItem('Ryuuiisou', -1, -1),
    'chuuren': new YakuListItem('Chuurenpoutou', 0, -1),
    'chinroto': new YakuListItem('Chinroto', -1, -1),
    'suukantsu': new YakuListItem('Suukantsu', -1, -1),
    'kokushi': new YakuListItem('Kokushimusou', NaN, -1),

    'dora': new YakuListItem('Dora', 1, 1),
    'uradora': new YakuListItem('Ura-dora', 1, 1),
    'akadora': new YakuListItem('Aka-dora', 1, 1),

    'riichi': new YakuListItem('Riichi', NaN, 1),
    'dabururiichi': new YakuListItem('Double riichi', NaN, 2),
    'ippatsu': new YakuListItem('Ippatsu', NaN, 1),
    'tsumo': new YakuListItem('Menzen tsumo', NaN, 1),
    'rinshan': new YakuListItem('Rinshan kaihou', 1, 1),
    'chankan': new YakuListItem('Chankan', 1, 1),
    'haitei': new YakuListItem('Haitei raoyue', 1, 1),
    'houtei': new YakuListItem('Houtei raoyui', 1, 1),
    'tenhou': new YakuListItem('Tenhou', NaN, -1),

    'renhou': new YakuListItem('Renhou', NaN, 5),
    'nagashi': new YakuListItem('Nagashi mangan', 5, 5)
};
