const MAN		= 0;
const PIN		= 1;
const SOU		= 2;
const KAZE		= 3;
const SANGEN	= 4;

const RED		= (1<<0);
const CLOSED	= (1<<1);

const MELD_MASK		= (0x7<<8);
const PAIR			= (1<<8);
const CHII			= (2<<8);
const PON			= (3<<8);
const KAN			= (4<<8);
const KOKUSHI_MUSOU = (5<<8);

const CHARACTERS	= 0;
const CIRCLES		= 1;
const BAMBOOS		= 2;
const HONORS		= 3;

const WAIT_NONE			= 0;
const WAIT_TWO_SIDED	= 1;
const WAIT_CENTRAL		= 2;
const WAIT_EDGE			= 3;
const WAIT_HANGING		= 4;
const WAIT_DOUBLEPON	= 5;

const WIND_EAST			= 27;
const WIND_SOUTH		= 28;
const WIND_WEST			= 29;
const WIND_NORTH		= 30;

var tiles=[
    "ONE OF CHARACTERS",
    "TWO OF CHARACTERS",
    "THREE OF CHARACTERS",
    "FOUR OF CHARACTERS",
    "FIVE OF CHARACTERS",
    "SIX OF CHARACTERS",
    "SEVEN OF CHARACTERS",
    "EIGHT OF CHARACTERS",
    "NINE OF CHARACTERS",

    "ONE OF CIRCLES",
    "TWO OF CIRCLES",
    "THREE OF CIRCLES",
    "FOUR OF CIRCLES",
    "FIVE OF CIRCLES",
    "SIX OF CIRCLES",
    "SEVEN OF CIRCLES",
    "EIGHT OF CIRCLES",
    "NINE OF CIRCLES",

    "ONE OF BAMBOOS",
    "TWO OF BAMBOOS",
    "THREE OF BAMBOOS",
    "FOUR OF BAMBOOS",
    "FIVE OF BAMBOOS",
    "SIX OF BAMBOOS",
    "SEVEN OF BAMBOOS",
    "EIGHT OF BAMBOOS",
    "NINE OF BAMBOOS",

    "EAST WIND",
    "SOUTH WIND",
    "WEST WIND",
    "NORTH WIND",

    "WHITE DRAGON",
    "GREEN DRAGON",
    "RED DRAGON"
];

var numbers=[
    "ONE",
    "TWO",
    "THREE",
    "FOUR",
    "FIVE",
    "SIX",
    "SEVEN",
    "EIGHT",
    "NINE"
];

var suits=[
    "CHARACTERS",
    "CIRCLES",
    "BAMBOOS",
    "HONORS"
];

var waits=[
    "OTHER",
    "TWO SIDED",
    "CENTRAL",
    "EDGE",
    "HANGING",
    "DOUBLE PON"
];

const KOKUSHI_MUSOU_SEQ=[
    0,8,9,17,18,26,27,28,29,30,31,32,33
];
const CHUUREN_POOTOO=[
    1,1,1,2,3,4,5,6,7,8,9,9,9
];





const translations={
    /* YAKU */
    "NO-POINTS HAND" : ["voice/y00.mp3","pinfu","е№іе’Њ"],
    "ALL SIMPLES" : ["voice/y01.mp3","tan'yao","ж–­д№€"],
    "ONE SET OF IDENTICAL SEQUENCES" : ["voice/y02.mp3","Д«peikЕЌ","дёЂз›ѓеЏЈ"],
    "WHITE BOARD" : ["voice/y03.mp3","haku","з™Ѕ"],
    "GREEN PROSPER" : ["voice/y04.mp3","hatsu","з™є"],
    "RED MIDDLE" : ["voice/y05.mp3","chun","дё­"],
    "TERMINAL OR HONOR IN EACH SET" : ["voice/y08.mp3","chanta","гѓЃгѓЈгѓіг‚ї"],
    "ALL TERMINALS AND HONORS" : ["voice/y09.mp3","honrЕЌtЕЌ","ж··иЂЃй ­"],
    "THREE COLOUR STRAIGHT" : ["voice/y10.mp3","sanshoku","дё‰и‰І"],
    "STRAIGHT THROUGH" : ["voice/y11.mp3","ittsЕ«","дёЂйЂљ"],
    "ALL TRIPLET HAND" : ["voice/y12.mp3","toitoi","еЇѕгЂ…"],
    "THREE COLOUR TRIPLETS" : ["voice/y13.mp3","sanshoku doukЕЌ","дё‰и‰ІеђЊе€»"],
    "THREE CONCEALED TRIPLETS" : ["voice/y14.mp3","san ankЕЌ","дё‰жљ—е€»"],
    "THREE QUADS" : ["voice/y15.mp3","san kantsu","дё‰ж§“е­ђ"],
    "LITTLE THREE ELEMENTS" : ["voice/y16.mp3","shЕЌsangen","е°Џдё‰е…ѓ"],
    "SEVEN PAIRS" : ["voice/y17.mp3","chД«toitsu","дёѓеЇѕе­ђ"],
    "ONE SUIT TRIPLE SEQUENCE" : ["voice/y19.mp3","sanrenpon","???"],
    "TWO SETS OF IDENTICAL SEQUENCES" : ["voice/y20.mp3","ryanpeikЕЌ","дєЊз›ѓеЏЈ"],
    "TERMINAL IN EACH SET" : ["voice/y21.mp3","junchan","зґ”гѓЃгѓЈгѓі"],
    "ONE SUIT PLUS HONORS" : ["voice/y22.mp3","hon'Д«sЕЌ","ж··дёЂи‰І"],
    "SINGLE SUIT HAND" : ["voice/y23.mp3","chin'Д«sЕЌ","жё…дёЂи‰І"],
    "FOUR CONCEALED TRIPLES" : ["voice/y24.mp3","sЕ« ankЕЌ ","е››жљ—е€»"],
    "FOUR CONCEALED TRIPLES PAIR WAIT" : ["voice/y25.mp3","sЕ« ankЕЌ tanki","е››жљ—е€»еЌйЁЋ"],
    "BIG THREE ELEMENTS" : ["voice/y26.mp3","daisangen","е¤§дё‰е…ѓ"],
    "ALL HONORS" : ["voice/y27.mp3","tsЕ«Д«sЕЌ","е­—дёЂи‰І"],
    "LITTLE FOUR WINDS" : ["voice/y28.mp3","shЕЌsЕ«shД«","е°Џе››е–њ"],
    "BIG FOUR WINDS" : ["voice/y29.mp3","daisЕ«shД«","е¤§е››е–њ"],
    "ALL GREEN" : ["voice/y30.mp3","ryЕ«Д«sЕЌ","з·‘дёЂи‰І"],
    "NINE GATES" : ["voice/y31.mp3","chЕ«ren pЕЌtЕЌ","д№ќи“®е®ќз‡€"],
    "NINE GATES NINE WAIT" : ["voice/y32.mp3","chЕ«ren pЕЌtЕЌ kyumen machi","д№ќи“®е®ќз‡€д№ќйќўеѕ…гЃЎ"],
    "ALL TERMINALS" : ["voice/y33.mp3","chinrЕЌtЕЌ","жё…иЂЃй ­"],
    "FOUR QUADS" : ["voice/y34.mp3","sЕ« kantsu","е››ж§“е­ђ"],
    "THE CHARIOT" : ["voice/y36.mp3","daisharin","е¤§и»ЉијЄ"],
    "THIRTEEN ORPHANS" : ["voice/y37.mp3","kokushi musЕЌ","е›ЅеЈ«з„ЎеЏЊ"],
    "THIRTEEN ORPHANS THIRTEEN WAIT" : ["voice/y38.mp3","kokushi musЕЌ jЕ«sanmen machi","е›ЅеЈ«з„ЎеЏЊеЌЃдё‰йќўеѕ…гЃЎ"],
    "DORA" : ["voice/y39.mp3","dora","гѓ‰гѓ©"],
    "READY HAND" : ["voice/y44.mp3","rД«chi","з«‹з›ґ,гѓЄгѓјгѓЃ"],
    "DOUBLE-READY" : ["voice/y45.mp3","daburu rД«chi","гѓЂгѓ–гѓ«гѓЄгѓјгѓЃ"],
    "ONE-SHOT" : ["voice/y46.mp3","ippatsu","дёЂз™є"],
    "SELF PICK" : ["voice/y47.mp3","tsumo","и‡Єж‘ё,гѓ„гѓў"],
    "GOING OUT ON A SUPPLEMENTAL TILE FROM THE DEAD WALL" : ["voice/y48.mp3","rinshan kaihЕЌ","е¶єдёЉй–‹иЉ±"],
    "ROBBING A QUAD TO GO OUT" : ["voice/y49.mp3","chankan","жђ¶ж§“,ж§Ќж§“"],
    "LAST TILE FROM THE WALL" : ["voice/y50.mp3","haitei","жµ·еє•"],
    "LAST TILE FROM THE WALL DISCARD" : ["voice/y51.mp3","hЕЌtei","жІіеє•"],
    "HEAVEN" : ["voice/y52.mp3","tenhou","е¤©е’Њ"],
    "EARTH" : ["voice/y53.mp3","chiihou","ењ°е’Њ"],
    "MAN" : ["voice/y54.mp3","renhou","дєєе’Њ"],
    "13 UNRELATED TILES" : ["voice/y56.mp3","shisanpuuta","???"],
    "END DISCARDS" : ["voice/y57.mp3","nagashi mankan","жµЃгЃ—жєЂиІ«"],
    "SPECIAL TILES" : ["","yakuhai, huanpai","еЅ№з‰Њ,йЈњз‰Њ"],

    /* LIMITS */
    "MANGAN" : ["voice/m01.mp3","mangan","жєЂиІ«"],
    "HANEMAN" : ["voice/m02.mp3","haneman","и·іжєЂ"],
    "BAIMAN" : ["voice/m03.mp3","baiman","еЂЌжєЂ"],
    "SANBAIMAN" : ["voice/m04.mp3","sanbaiman","дё‰еЂЌжєЂ"],
    "KAZOE-YAKUMAN" : ["voice/m05.mp3","kazoe-yakuman","ж•°гЃ€еЅ№жєЂ"],
    "YAKUMAN" : ["voice/m06.mp3","yakuman","еЅ№жєЂ"],
    "DOUBLE YAKUMAN" : ["voice/m07.mp3","daburu yakuman","гѓЂгѓ–гѓ«еЅ№жєЂ"],
    "TRIPLE YAKUMAN" : ["voice/m08.mp3","toripuru yakuman","гѓ€гѓ©гѓ–гѓ«еЅ№жєЂ"],
    "SUPER YAKUMAN" : ["voice/m09.mp3","suupa yakuman","г‚№гѓјгѓ‘гѓјеЅ№жєЂ"],
};

