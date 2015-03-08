import _ = require('../libdefs/lodash');

class Yaku {
    private _name: string;
    private _han: {
        open: number;
        closed: number
    };

    get han() {
        return this._han;
    }

    constructor(name: string, hanCountOpen: number, hanCountClosed: number) {
        this._name = name;
        this._han = {
            open: hanCountOpen,
            closed: hanCountClosed
        };
    }

    static pinfu = new Yaku('Pin-fu', 0, 1);
    static tanyao = new Yaku('Tan-yao', 1, 1); // TODO: конфигурация по правилу куитан
    static iipeiko = new Yaku('Iipeiko', 0, 1);
    static haku = new Yaku('Yaku-hai (haku)', 1, 1);
    static hatsu = new Yaku('Yaku-hai (hatsu)', 1, 1);
    static chun = new Yaku('Yaku-hai (chun)', 1, 1);
    static placeWind = new Yaku('Yaku-hai (wind of place)', 1, 1);
    static roundWind = new Yaku('Yaku-hai (wind of round)', 1, 1);
    static chanta = new Yaku('Chanta', 1, 2);
    static honroto = new Yaku('Honroto', 2, 2);
    static ittsu = new Yaku('Ittsu', 1, 2);
    static sanshoku = new Yaku('Sanshoku doujun', 1, 2);
    static toitoi = new Yaku('Toitoi', 2, 2);
    static sanshokudoko = new Yaku('Sanshoku dokou', 2, 2);
    static sanankou = new Yaku('Sanankou', 2, 2);
    static sankantsu = new Yaku('Sankantsu', 2, 2);
    static shosangen = new Yaku('Shosangen', 2, 2);
    static chiitoitsu = new Yaku('Chiitoitsu', NaN, 2);
    static ryanpeiko = new Yaku('Ryanpeikou', 0, 3);
    static junchan = new Yaku('Junchan', 2, 3);
    static honitsu = new Yaku('Honitsu', 2, 3);
    static chinitsu = new Yaku('Chinitsu', 5, 6);
    static daisangen = new Yaku('Daisangen', -1, -1);
    static suuankou = new Yaku('Suuankou', 0, -1);
    static tsuisou = new Yaku('Tsuuiisou', -1, -1);
    static shosuushi = new Yaku('Shosuushi', -1, -1);
    static daisuushi = new Yaku('Daisuushi', -1, -1);
    static ryuisou = new Yaku('Ryuuiisou', -1, -1);
    static chuuren = new Yaku('Chuurenpoutou', 0, -1);
    static chinroto = new Yaku('Chinroto', -1, -1);
    static suukantsu = new Yaku('Suukantsu', -1, -1);
    static kokushi = new Yaku('Kokushimusou', NaN, -1);
    static dora = new Yaku('Dora', 1, 1);
    static uradora = new Yaku('Ura-dora', 1, 1);
    static akadora = new Yaku('Aka-dora', 1, 1);
    static riichi = new Yaku('Riichi', NaN, 1);
    static dabururiichi = new Yaku('Double riichi', NaN, 2);
    static ippatsu = new Yaku('Ippatsu', NaN, 1);
    static tsumo = new Yaku('Menzen tsumo', NaN, 1);
    static rinshan = new Yaku('Rinshan kaihou', 1, 1);
    static chankan = new Yaku('Chankan', 1, 1);
    static haitei = new Yaku('Haitei raoyue', 1, 1);
    static houtei = new Yaku('Houtei raoyui', 1, 1);
    static tenhou = new Yaku('Tenhou', NaN, -1);
    static renhou = new Yaku('Renhou', NaN, 5);
    static nagashi = new Yaku('Nagashi mangan', 5, 5);
}

export = Yaku;
