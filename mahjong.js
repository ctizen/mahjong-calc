/*
 * Copyright (c) 2009 Andrey Osenenko
 * Modified by Oleg Klimenko @ 2015
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

const TILE_WIDTH				= 39;
const TILE_HEIGHT				= 60;

const TILE_BASE_SPEED			= 25;
const TILE_SPEED_BONUS			= 2500;
const TILE_SPEED_BONUS_RANGE	= 300;

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

/* Special tiles used for visual purposes only */
const TILE_WHITESPACE	= (34<<8);
const TILE_HALFSPACE	= (35<<8);


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
    "RED DRAGON",
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
    "NINE",
];

var suits=[
    "CHARACTERS",
    "CIRCLES",
    "BAMBOOS",
    "HONORS",
];

var waits=[
    "OTHER",
    "TWO SIDED",
    "CENTRAL",
    "EDGE",
    "HANGING",
    "DOUBLE PON",
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

function e(n){return document.getElementById(n);}
function defined(x){return x!=undefined;}
function now(){return new Date().getTime()}
function capitalize(s){return s.substr(0,1).toUpperCase()+s.substr(1).toLowerCase()}
function lc(s){return s.toLowerCase()}
function uc(s){return s.toUpperCase()}
function plus(a,b){return a+b[1]}
function debug(a){if(defined(console)) console.log(a);}

function createCookie(name,value,days) {
    var expires="";

    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date.toGMTString();
    }

    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}


var sounds={};
function playSound(s){
    var sound=sounds[s];

    try{
        if(!defined(sound))
            sound=sounds[s]=soundManager.createSound({id: s, url: s});

        if(defined(sound))
            sound.play();

    } catch(e){}
}

function translate(word,func){
    var translation=translations[uc(word)]
    if(!defined(translation)) return capitalize(word);

    var html="<span class='tl'>"+(func?func:capitalize)(word);

    var have_voice=!!translation[0];
    var have_text=translation[1]||translation[2];

    if(have_voice || have_text) html+="<span style='position: relative'>";

    if(have_voice) html+="<a href='#' onclick='playSound(\""+translation[0]+"\"); return false;'><img src='loudspeaker.png' alt='[LISTEN]' /></a>";
    else if(have_text) html+="<img src='arrowdown.png' alt='[DROPDOWN]' />";

    if(have_text){
        html+="<span class='dropdown'>"+translation[1]+"<br />"+translation[2]+"</span>";
    }

    if(have_voice || have_text) html+="</span>";

    html+="</span>";

    return html;
}

Array.prototype.shuffle=function(){
    var i,L;
    i = L = this.length;
    while (i--){
        var r = Math.floor(Math.random()*L);
        var x = this[i];
        this[i] = this[r];
        this[r] = x;
    }

    return this;
};

Array.prototype.remove=function(item){
    var i=0;
    while (i<this.length) {
        if (this[i]==item) {
            this.splice(i,1);
        } else{
            i++;
        }
    }
    return this;
};
Array.prototype.removeOne=function(item){
    var i=0;
    while (i<this.length) {
        if (this[i]==item) {
            this.splice(i,1);
            return;
        } else{
            i++;
        }
    }
    return this;
};

Array.prototype.map=function(f){
    var list=[];

    for(var i=0;i<this.length;i++)
        list[i]=f(this[i]);

    return list;
};

Array.prototype.fold=function(v,f){
    for(var i=0;i<this.length;i++)
        v=f(v,this[i]);

    return v;
};

function isColor(code){
    var id=code>>8;
    if(id>=31 && id<=33) return 1;
    return 0;
}
function isEnd(code){
    var id=code>>8;

    if(id==0  || id==8)  return 1;
    if(id==9  || id==17) return 1;
    if(id==18 || id==26) return 1;

    return 0;
}
function isTerminal(code){
    var id=code>>8;

    if(isEnd(code)) 	 return 1;
    if(id>=27 && id<=33) return 1;

    return 0;
}
function isWind(code){
    var id=code>>8;

    if(id>=27 && id<=30) return 1;

    return 0;
}
function isColor(code){
    var id=code>>8;

    if(id>=31 && id<=33) return 1;

    return 0;
}
function isChar(code){
    return isColor(code) || isWind(code);
}
function isGreen(code){
    var id=code>>8;

    return id==19 || id==20 || id==21 || id==23 || id==25 || id==32;
}
function isSuit(code){
    return type(code)<27;
}
function makeSuit(suitno,no){
    if(no<1 || no>9 || suitno<0 || suitno>2) return -1;
    return (suitno*9+no-1)<<8;
}

function getDora(code){
    var t=type(code);
    var n=numberic(code);

    if(n>0 && n<9)	return ((t+1)<<8);
    if(n==9)		return ((t-8)<<8);

    if(t<30)		return ((t+1)<<8);
    if(t==30)		return ((t-3)<<8);

    if(t<33)		return ((t+1)<<8);
    if(t==33)		return ((t-2)<<8);

    return -1;
}

function tileIsNext(left,right){
    var l=left>>8;
    var r=right>>8;

    if(r!=l+1) return 0;
    if(l==8 || l==17 || l>=26) return 0;

    return 1;
}

function describe(code){
    var id=code>>8;
    var res=tiles[id];

    if(code&RED) res="RED "+res;

    return res;
}

function describeMeld(list){
    var res;

    if((list[0]&MELD_MASK)==PAIR)	res="PAIR OF "+describe(list[1]);
    if((list[0]&MELD_MASK)==PON)	res="PON OF "+describe(list[1]);
    if((list[0]&MELD_MASK)==KAN)	res="KAN OF "+describe(list[1]);
    if((list[0]&MELD_MASK)==CHII)	res="CHII OF "+
        numbers[numberic(list[1])-1]+"-"+
        numbers[numberic(list[1])]+"-"+
        numbers[numberic(list[1])+1]+
        " OF "+suits[suit(list[1])];
    if((list[0]&MELD_MASK)==KOKUSHI_MUSOU)	return "KOKUSHI MUSOU";

    if(!res) return "UNK";

    if(!(list[0]&CLOSED)) res="OPEN "+res;

    return res;
}
function describeCombination(list){
    return list.map(describeMeld).join(", ");
}

function id(code){
    return "t"+(code>>8)+(code&1?"r":"");
}

function type(code){
    return code>>8;
}
function fromType(code){
    return code<<8;
}
function generalize(code){
    return code&0xffffff00;
}
function numberic(code){
    var id=code>>8;

    if(id<27) return 1+id%9;

    return 0;
}
function suit(code){
    var id=code>>8;

    if(id<9) return CHARACTERS;
    if(id<18) return CIRCLES;
    if(id<27) return BAMBOOS;

    return HONORS;
}

function Wall(){
    var a=new Array;

    for(var i=0;i<tiles.length;i++){
        var code=i<<8;

        a.push(code);a.push(code);a.push(code);

        if(numberic(code)==5) a.push(code|1);
        else a.push(code);
    }newMeld

    this.tiles=a.shuffle();
}

function Hand(){
    this.tiles=new Array;
    this.melds=new Array;
    this.lastDraw=-1;
}

function handFromText(text){
    var tokens=text.match(/([psm][1-9]|c[rwg]|w[sewn])/gi);
    var hand=new Hand;

    for(var i=0;i<tokens.length;i++){
        var token=tokens[i].toLowerCase();
        var a=token[0],b=token[1];
        var res;

        if(a=='p') res=8+parseInt(b);
        else if(a=='s') res=17+parseInt(b);
        else if(a=='m') res=-1+parseInt(b);
        else if(a=='w' && b=='e') res=27;
        else if(a=='w' && b=='s') res=28;
        else if(a=='w' && b=='w') res=29;
        else if(a=='w' && b=='n') res=30;
        else if(a=='c' && b=='w') res=31;
        else if(a=='c' && b=='g') res=32;
        else if(a=='c' && b=='r') res=33;
        else res=-1;

        hand.add(res<<8);
    }

    return hand;
}

Hand.prototype.toText=function(){

}

function ns(a,b){return a - b;}

Hand.prototype.draw=hand_draw;
function hand_draw(wall){
    this.tiles.push(wall.tiles.shift());
    this.tiles.sort(ns);
}

/* Not used */
Hand.prototype.add=function(code){
    var i;

    for(i=0;i<this.tiles.length;i++)
        if(this.tiles[i]>code) break;

    this.tiles=this.tiles.slice(0,i).concat(code,this.tiles.slice(i));
}

Hand.prototype.copy=function(){
    var hand=new Hand;

    hand.tiles=this.tiles.slice();
    hand.melds=this.melds;

    return hand;
}

Hand.prototype.wait=function(){
    var wait=[];

    for(var i=0;i<tiles.length;i++){
        var code=i<<8;
        var hand=this.copy();

        hand.add(code);

        var com=hand.valid();
        if(com.length==0) continue;

        wait.push([code,com]);
    }

    return wait;
}

Hand.prototype.waitKind=function(code,combination){
    var tile=type(code);
    var kind=WAIT_NONE;

    for(var j=0;j<combination.length;j++){
        var m=combination[j];
        var mkind=m[0]&MELD_MASK;

        if(mkind==PAIR && type(m[1])==tile){kind=WAIT_HANGING;break;}

        if(!m[0]&CLOSED) continue;
        if(mkind==CHII && type(m[1])+1==tile){kind=WAIT_CENTRAL;break;}
        if(mkind==CHII && (type(m[1])==tile || type(m[1])+1==tile || type(m[1])+2==tile)){
            if(numberic(m[1])==1 && numberic(code)!=1){kind=WAIT_EDGE;break;}
            if(numberic(m[1])==7 && numberic(code)!=9){kind=WAIT_EDGE;break;}

            kind=WAIT_TWO_SIDED;
        }
        if(mkind==PON && type(m[1])==tile){kind=WAIT_DOUBLEPON;}
    }

    return kind;
}

Hand.prototype.valid=function(){
    var i;
    var list=this.valid_helper(0,0,0,this.melds.length,[]);

    /* SPECIAL CASE: KOKUSHI MUSOU */
    if(this.tiles.length==14){
        var musou_tile=-1;

        for(i=0;i<14;i++){
            if(musou_tile==-1){
                if(type(this.tiles[i])!=KOKUSHI_MUSOU_SEQ[i]) break;

                if(type(this.tiles[i+1])==KOKUSHI_MUSOU_SEQ[i])
                    musou_tile=this.tiles[i],i++;
            } else{
                if(type(this.tiles[i])!=KOKUSHI_MUSOU_SEQ[i-1]) break;
            }
        }

        if(i==14)
            return [[[KOKUSHI_MUSOU,musou_tile]]]
    }

    var mm=this.melds;
    return list.map(function(x){
        return x[2].concat(mm.length?mm:[])
    });
}

/*
 * Mask bits:
 * 0-14 marks whether this tile is used for chii and
 *      should be ignored.
 */

Hand.prototype.valid_helper=function(start,mask,pairs,melds,desc){
    var result=[];

    if(start==this.tiles.length){
        if(melds==0 && pairs==7) return [[pairs,melds,desc]];
        if(melds>0 && pairs==1) return [[pairs,melds,desc]];

        return [];
    }
    if(start>this.tiles.length) return [];
    var i=start;

    if(mask&(1<<i)) return this.valid_helper(i+1,mask,pairs,melds,desc);

    var j;
    var tile=this.tiles[i];

    /* Checking for pairs/pons. If two previous tiles are pair
     * and were not used for chii, this one can't form neither
     * pair nor pon with others. */
    if(i<2 || mask&(1<<(i-2)) || mask&(1<<(i-1)) || (type(tile)!=type(this.tiles[i-2])))

    /* Next tile is same as this; adding one pair and branching */
        if(type(tile)==type(this.tiles[i+1])){
            /* Pair can only be useful if there are not pairs yet (to form 4
             * melds and pair), or when there are no melds (7 pairs) */
            if(pairs==0 || melds==0)
                result=result.concat(this.valid_helper(i+2,mask,pairs+1,melds,
                    desc.concat([[CLOSED+PAIR,tile]])));

            /* Two next tiles are same as this; adding one pon and branching
             * unless we have two or more pairs -- in this case, melds are no use. */
            if(type(tile)==type(this.tiles[i+2]) && pairs<2)
                result=result.concat(this.valid_helper(i+3,mask,pairs,melds+1,
                    desc.concat([[CLOSED+PON,tile]])));
        }

    /* Checking for chiis: */

    /* Have many pairs, aiming for 7-pairs only; no use checking for chiis */
    if(pairs>1) return result;

    /* No chiis started by 8s and 9s and honors */
    if(numberic(tile)<0 || numberic(tile)>7) return result;

    /* Find first tile suitable for chii. Mask is used here to mark tiles
     * already used for chiis to prevent combinations like 3345 from forming
     * two chiis. */
    for(j=i+1;(type(this.tiles[j])==type(tile) || mask&(1<<j)) && j<this.tiles.length;j++)
        ;
    if(!tileIsNext(tile,this.tiles[j])) return result;
    var first=j;

    /* Second tile */
    for(j=j+1;(type(this.tiles[j])==type(this.tiles[first]) || mask&(1<<j)) && j<this.tiles.length;j++)
        ;
    if(!tileIsNext(this.tiles[first],this.tiles[j])) return result;
    var second=j;

    /* Now that we have three tiles forming sequence, branch. It is
     * possible to search for all chii combinations with picked tile,
     * but I don't think there are cases where not doing so would miss
     * a complete hand. */
    result=result.concat(this.valid_helper(i+1,mask|(1<<i)|(1<<first)|(1<<second),pairs,melds+1,
        desc.concat([[CLOSED+CHII,tile]])));

    return result;
}

function calculateFu(combination,hand){
    var description=[["Base score",20]];

    var all_closed=true;
    var pairs_count=0;
    var pon_count=0;
    var kan_count=0;

    combination.forEach(function(c){
        var closed=c[0]&CLOSED;
        var kind=c[0]&MELD_MASK;
        var tile=generalize(c[1]);

        if(!closed) all_closed=false;

        if(kind==PAIR){
            if(tile==hand.ownWind && tile==hand.roundWind)
                description.push(["Double wind pair",4]);
            else if(tile==hand.ownWind)
                description.push(["Position wind pair",2]);
            else if(tile==hand.roundWind)
                description.push(["Round wind pair",2]);
            else if(tile==(31<<8) || tile==(32<<8) || tile==(33<<8))
                description.push([capitalize(describeMeld(c)),2]);

            pairs_count++;
        } else if(kind==CHII){
        } else if(kind==PON){
            pon_count++;

            if(isTerminal(tile))
                description.push(closed?
                    [capitalize(describeMeld(c)),8]:
                    [capitalize(describeMeld(c)),4]);
            else
                description.push(closed?
                    [capitalize(describeMeld(c)),4]:
                    [capitalize(describeMeld(c)),2]);

        } else if(kind==KAN){
            kan_count++;

            if(isTerminal(tile))
                description.push(closed?
                    [capitalize(describeMeld(c)),32]:
                    [capitalize(describeMeld(c)),16]);
            else
                description.push(closed?
                    [capitalize(describeMeld(c)),16]:
                    [capitalize(describeMeld(c)),8]);
        }
    });

    if(pairs_count==7) return [25,[["Seven pairs",25]]];

    /*	if(pon_count==0 && kan_count==0) return hand.ron?
     [30,[["All Sequence",30]]]:
     [20,[["All Sequence",20]]]*/

    if(all_closed && hand.ron) description.push(["Closure Bonus",10]);
    if(!hand.ron && description.length>1) description.push(["Self-draw Bonus",2]);

    if(hand.lastDraw){
        var wait=hand.waitKind(hand.lastDraw,combination);

        if(wait==WAIT_CENTRAL || wait==WAIT_EDGE || wait==WAIT_HANGING)
            description.push([capitalize(waits[wait])+" wait",2]);
    }

    var sum=description.fold(0,plus);
    var rounded=Math.ceil(sum/10)*10;

    if(sum!=rounded)
        description.push(["Rounded up",rounded-sum]);

    return [rounded,description];
}

function calculateYaku(combination,hand){
    var i;
    var description=[];

    var all_closed=true;
    var pair_is_special=false;

    var wait=WAIT_NONE;
    if(hand.lastDraw)
        var wait=hand.waitKind(hand.lastDraw,combination);

    var allTiles=hand.melds.fold(hand.tiles.slice(),function(a,b){return a.concat(b[2])}).sort(ns);

    var pairs=0;
    var chiis=0;
    var pons=0;
    var closedPons=0;
    var openPons=0;
    var kans=0;
    var closedKans=0;
    var openKans=0;
    var colorMelds=0;
    var windMelds=0;

    var colorPairs=0;
    var windPairs=0;
    var pairTile;

    var chiiCounts=tiles.map(function(){return 0});
    var ponCounts=tiles.map(function(){return 0});
    var suitsCounts=[0,0,0,0];

    var dirtyTerminalMelds=0;
    var pureTerminalMelds=0;
    var dirtyEndMelds=0;
    var pureEndMelds=0;

    var specials=0;

    combination.forEach(function(c){
        var closed=c[0]&CLOSED;
        var kind=c[0]&MELD_MASK;
        var tile=generalize(c[1]);

        if(!closed) all_closed=false;
        suitsCounts[suit(tile)]++;

        if(kind==PAIR){
            if(isColor(tile) || tile==hand.ownWind || tile==hand.roundWind)
                pair_is_special=true;
            pairTile=tile;

            pairs++;
            if(isColor(tile)) colorPairs++;
            if(isWind(tile)) windPairs++;

            if(isTerminal(tile)) dirtyTerminalMelds++,dirtyEndMelds++;
            if(isEnd(tile)) pureTerminalMelds++,pureEndMelds++;
        } else if(kind==CHII){
            chiiCounts[type(tile)]++;

            if(numberic(tile)==1 || numberic(tile)==7) pureEndMelds++,dirtyEndMelds++;
        } else if(kind==PON){
            pons++;
            closed?closedPons++:openPons++;

            ponCounts[type(tile)]++;

            if(isColor(tile)) colorMelds++;
            if(isWind(tile)) windMelds++;

            if(tile==hand.ownWind) specials++;
            if(tile==hand.roundWind) specials++;

            if(isTerminal(tile)) dirtyTerminalMelds++,dirtyEndMelds++;
            if(isEnd(tile)) pureTerminalMelds++,pureEndMelds++;
        } else if(kind==KAN){
            kans++;
            closed?closedKans++:openKans++;

            if(isColor(tile)) colorMelds++;
            if(isWind(tile)) windMelds++;

            if(tile==hand.ownWind) specials++;
            if(tile==hand.roundWind) specials++;

            if(isTerminal(tile)) dirtyTerminalMelds++,dirtyEndMelds++;
            if(isEnd(tile)) pureTerminalMelds++,pureEndMelds++;
        }
    });

    function returnYakuman(text,value){
        return [value,[[text,value]]];
    }

    var greens=allTiles.fold(0,function(a,b){return isGreen(b)?a+1:a;});
    if(greens==allTiles.length)
        description.push(["ALL GREEN",-1]);

    var allSameSuit=allTiles.fold(suit(allTiles[0]),function(a,b){return suit(b)==a?a:-1;});
    if(allSameSuit!=-1 && allSameSuit!=HONORS){
        var extra_tile=-1;
        for(i=0;i<CHUUREN_POOTOO.length;i++){
            if(extra_tile==-1){
                if(numberic(allTiles[i])!=CHUUREN_POOTOO[i]) break;

                if(i>=2 && numberic(allTiles[i+1])==CHUUREN_POOTOO[i])
                    extra_tile=allTiles[i];
            } else{
                if(numberic(allTiles[i+1])!=CHUUREN_POOTOO[i]) break;
            }
        }

        if(i==CHUUREN_POOTOO.length)
            description.push(hand.lastDraw==extra_tile?
                ["NINE GATES NINE WAIT",-2]:
                ["NINE GATES",-1]);
    }

    if(colorMelds==3)
        description.push(["BIG THREE ELEMENTS",-1]);

    if(windMelds==3 && windPairs==1)
        description.push(["LITTLE FOUR WINDS",-1]);

    if(windMelds==4)
        description.push(["BIG FOUR WINDS",-2]);

    if(closedPons+closedKans==4)
        description.push(hand.lastDraw==pairTile?
            ["FOUR CONCEALED TRIPLES PAIR WAIT",-2]:
            ["FOUR CONCEALED TRIPLES",-1]);

    if(kans==4)
        description.push(["FOUR QUADS",-1]);

    if(colorMelds+windMelds+colorPairs+windPairs==combination.length)
        description.push(["ALL HONORS",-1]);

    if(pureTerminalMelds==combination.length)
        description.push(["ALL TERMINALS",-1]);

    if((combination[0][0]&MELD_MASK)==KOKUSHI_MUSOU)
        description.push(hand.lastDraw==combination[0][1]?
            ["THIRTEEN ORPHANS THIRTEEN WAIT",-2]:
            ["THIRTEEN ORPHANS",-1]);


    var sum=description.fold(0,plus);
    if(sum!=0) return [sum,description];

    if(all_closed && !hand.ron)
        description.push(["SELF PICK",1]);

    if(colorPairs==1 && colorMelds==2)
        description.push(["LITTLE THREE ELEMENTS",4]),colorMelds-=2;

    if(colorMelds+specials>0)
        description.push(["SPECIAL TILES",colorMelds+specials]);

    if(all_closed && !pair_is_special && wait==WAIT_TWO_SIDED && pons==0 && kans==0)
        description.push(["NO-POINTS HAND",1]);

    var terminals=allTiles.fold(0,function(a,b){return isTerminal(b)?a+1:a;});
    if(terminals==0)
        description.push(["ALL SIMPLES",1]);

    var doubleChiis=chiiCounts.fold(0,function(a,b){if(b==2) a+=1; return a;});
    if(doubleChiis==1 && all_closed)
        description.push(["ONE SET OF IDENTICAL SEQUENCES",1]);

    if(hand.dabururiichi)
        description.push(["DOUBLE-READY",2]);
    else if(hand.riichi)
        description.push(["READY HAND",1]);

    if((hand.dabururiichi || hand.riichi) && hand.ippatsu)
        description.push(["ONE-SHOT",1]);

    if(hand.rinjan)
        description.push(["GOING OUT ON A SUPPLEMENTAL TILE FROM THE DEAD WALL",1]);

    if(hand.chankan)
        description.push(["ROBBING A QUAD TO GO OUT",1]);

    if(hand.haidei)
        description.push(["LAST TILE FROM THE WALL",1]);

    if(hand.houdei)
        description.push(["LAST TILE FROM THE WALL DISCARD ",1]);


    if(		(chiiCounts[ 0] && chiiCounts[ 3] && chiiCounts[ 6]) ||
        (chiiCounts[ 9] && chiiCounts[12] && chiiCounts[15]) ||
        (chiiCounts[18] && chiiCounts[21] && chiiCounts[24]) ){
        description.push(["STRAIGHT THROUGH",all_closed?2:1]);
    }


    if(dirtyTerminalMelds==combination.length)
        description.push(["ALL TERMINALS AND HONORS",pairs==7?2:4]);
    else if(pureEndMelds==combination.length)
        description.push(["TERMINAL IN EACH SET",all_closed?3:2]);
    else if(dirtyEndMelds==combination.length)
        description.push(["TERMINAL OR HONOR IN EACH SET",all_closed?2:1]);


    [0,1,2,3,4,5,6].forEach(function(a){
        if(chiiCounts[a] && chiiCounts[a+9] && chiiCounts[a+18])
            description.push(["THREE COLOUR STRAIGHT",all_closed?2:1]);
    });

    [0,1,2,3,4,5,6,7,8].forEach(function(a){
        if(ponCounts[a] && ponCounts[a+9] && ponCounts[a+18])
            description.push(["THREE COLOUR TRIPLETS",2]);
    });

    if(pairs==7)
        description.push(["SEVEN PAIRS",2]);

    if(chiis==0 && pons+kans==4 && dirtyTerminalMelds!=combination.length)
        description.push(["ALL TRIPLET HAND",2]);

    if(closedPons+closedKans==3)
        description.push(["THREE CONCEALED TRIPLETS",2]);

    if(kans==3)
        description.push(["THREE QUADS",2]);

    if(		(suitsCounts[MAN]==0 && suitsCounts[PIN]==0 && suitsCounts[HONORS]==0)	||
        (suitsCounts[MAN]==0 && suitsCounts[SOU]==0 && suitsCounts[HONORS]==0)	||
        (suitsCounts[SOU]==0 && suitsCounts[PIN]==0 && suitsCounts[HONORS]==0)	){
        description.push(["SINGLE SUIT HAND",all_closed?6:5]);
    }else if(	(suitsCounts[MAN]==0 && suitsCounts[PIN]==0 && suitsCounts[SOU]!=0) ||
        (suitsCounts[MAN]==0 && suitsCounts[PIN]!=0 && suitsCounts[SOU]==0) ||
        (suitsCounts[MAN]!=0 && suitsCounts[PIN]==0 && suitsCounts[SOU]==0) ){
        description.push(["ONE SUIT PLUS HONORS",all_closed?3:2]);
    }

    if(doubleChiis==2 && all_closed)
        description.push(["TWO SETS OF IDENTICAL SEQUENCES",3]);


    var tripleChiis=chiiCounts.fold(0,function(a,b){if(b==3) a+=1; return a;});
    if(tripleChiis==1)
        description.push(["ONE SUIT TRIPLE SEQUENCE",2]);

    [0,1,2,3,4,5,6,9,10,11,12,13,14,15,18,19,20,21,22,23,24].forEach(function(a){
        if(ponCounts[a] && ponCounts[a+1] && ponCounts[a+2])
            description.push(["ONE SUIT TRIPLE SEQUENCE",2]);
    });

    if(description.length>0){
        var redTiles=allTiles.fold(0,function(a,b){if(b&RED) a+=1; return a;});
        if(redTiles>0)
            description.push(["RED TILES",redTiles]);


        var doras=hand.dora.map(function(a){return type(getDora(a))});
        var doraTiles=allTiles.fold(0,function(a,tile){
            return a+doras.fold(0,function(b,dora){if(type(tile)==dora) b++; return b;});
        });
        if(doraTiles>0)
            description.push(["DORA",doraTiles]);
    }

    var sum=description.fold(0,plus);

    return [sum,description];
}

Table.prototype.onTimer=function(){
    var now=new Date().getTime();
    var eslaped=now-this.now;
    this.now=now;

    for(var i=this.movingTiles.length-1;i>=0;i--){
        var tile=this.movingTiles[i];

        var dx=tile.targetX-tile.x;
        var dy=tile.targetY-tile.y;
        var angle=Math.atan(dx/dy);
        if(dy<0) angle+=Math.PI;

        var fulldist=Math.sqrt(dx*dx+dy*dy);
        var bonus=Math.min(1,(Math.max(0,fulldist/TILE_SPEED_BONUS_RANGE)));
        var speed=TILE_BASE_SPEED+TILE_SPEED_BONUS*bonus;
        var dist=speed*eslaped/1000;

        if(fulldist>dist){
            tile.relocate(tile.x+Math.sin(angle)*dist,tile.y+Math.cos(angle)*dist);
        } else{
            tile.place(tile.targetX,tile.targetY);

            if(tile.fading)
                tile.remove();
        }

        if(tile.fading || tile.appearing){
            var idx=tile.idleX-tile.targetX;
            var idy=tile.idleY-tile.targetY;
            var idledist=Math.sqrt(idx*idx+idy*idy);

            tile.elem.style.opacity=(tile.opacity?tile.opacity:1)*tile.fading?
                fulldist/idledist:
                1-fulldist/idledist;
        }
    }

    if(this.movingTiles.length==0){
        clearInterval(this.timer);
        this.timer=undefined;
    }
}
function Table(w,h,tileset,ee){
    this.tiles=new Array;
    this.movingTiles=new Array;
    this.tileset=tileset;

    this.dora=new Array;

    this.timer=undefined;

    this.roundWind=WIND_EAST;

    var elem=document.createElement('div');
    elem.style.position		= "relative";
    elem.style.width		= w;
    elem.style.height		= h;

    if(!ee) ee=document.body;
    ee.appendChild(elem);

    this.elem=elem;
}

function Tile(code,x,y,events){
    this.x=x;
    this.y=y;
    this.targetX=x;
    this.targetY=y;
    this.idleX=x;
    this.idleY=y;
    this.code=code;
    this.fading=false;
    this.appearing=false;

    var tile=this;

    if(events){
        if(events.onclick) this.onclick=function(){events.onclick(tile)};
        if(events.onmouseover) this.onmouseover=function(){events.onmouseover(tile)};
        if(events.onmouseout) this.onmouseout=function(){events.onmouseout(tile)};
    }

    this.elem=undefined;
}

function Set(){
    this.tiles=new Array;
    this.melds=new Array;

    this.lastDraw=undefined;
}

function SetHand(){
    this.wait=new Array;
    this.valid=new Array;

    this.ownWind=WIND_EAST;
}

function TileSet(picture,w,h){
    this.picture=picture;
    this.w=w;
    this.h=h;
}

SetHand.prototype=new Set();

Table.prototype.startTimer=function(){

    if(defined(this.timer)) return;

    this.now=new Date().getTime();
    this.timer=setInterval(function(a){a.onTimer()},20,this);
}

Table.prototype.addTile=function(code,x,y,events){
    var tile=new Tile(code,x,y,events);
    var elem=tile.changeTileset(this.tileset);

    this.elem.appendChild(elem);

    tile.table=this;

    this.tiles.push(tile);

    return tile;
}

Table.prototype.addTileAppear=function(code,x,y,events){
    var tile=this.addTile(code,x,y+TILE_HEIGHT,events);

    tile.appearing=true;
    tile.moveTo(x,y);

    return tile;
}

Table.prototype.addSet=function(x,y){
    var set=new Set;

    set.x=x;
    set.y=y;

    set.table=this;

    return set;
}

Table.prototype.addHand=function(x,y,waitEvents){
    var set=new SetHand;

    set.x=x;
    set.y=y;
    set.waitEvents=waitEvents;

    set.table=this;

    return set;
}

Set.prototype.addTile=function(code,x,y,events){
    var i;
    var left=this.x;

    for(i=0;i<this.tiles.length;i++){
        if(this.tiles[i].code>code) break;
        left+=this.tiles[i].tileset.w;
    }

    if(!defined(x)){
        x=left;
        y=this.y;
    }

    var tile=this.table.addTile(code,x,y,events);
    this.lastDraw=tile;
    this.tiles=this.tiles.slice(0,i).concat(tile,this.tiles.slice(i));

    this.changeWait();
    this.refresh();

    return tile;
}

Set.prototype.refresh=function(){
    var i;
    var left=this.x;

    for(i=0;i<this.tiles.length;i++){
        var tile=this.tiles[i];

        tile.moveTo(left,this.y);
        left+=tile.tileset.w;
    }

    /* Display wait */
    if(this.wait && this.wait.length){
        left+=this.table.tileset.w/2;
        for(var index=0;index<this.wait.length;index++){
            var tile=this.wait[index];
            left+=tile.tileset.w;
        }
    }

    /* Display open melds */
    left+=this.table.tileset.w;
    for(var i=0;i<this.melds.length;i++){
        var entry=this.melds[i][1];
        for(var j=0;j<entry.length;j++){
            var tile=entry[j];
            tile.moveTo(left,this.y);

            left+=tile.tileset.w;
        }

        left+=this.table.tileset.w/2;
    }
}

Set.prototype.removeTile=function(tile){
    this.removeTileHelper(tile,true);
}

Set.prototype.fadeOutTile=function(tile){
    this.removeTileHelper(tile,false);
}

Set.prototype.removeTileHelper=function(tile,instantly){
    var i,index;

    for(index=0;index<this.tiles.length;index++)
        if(this.tiles[index]==tile) break;

    if(index==this.tiles.length) return;
    instantly?
        tile.remove():
        tile.fadeOut();

    this.lastDraw=undefined;
    this.tiles=this.tiles.slice(0,index).concat(this.tiles.slice(index+1));
}

Set.prototype.hasType=function(t){
    var i;

    for(i=0;i<this.tiles.length;i++)
        if(type(this.tiles[i].code)==t) return this.tiles[i];

    return;
}

Set.prototype.prevTile=function(tile){
    var i;

    for(i=1;i<this.tiles.length;i++)
        if(this.tiles[i]==tile) return this.tiles[i-1];

    return;
}
Set.prototype.nextTile=function(tile){
    var i;

    for(i=0;i<this.tiles.length-1;i++)
        if(this.tiles[i]==tile) return this.tiles[i+1];

    return;
}

Set.prototype.changeWait=function(){
}

SetHand.prototype.toHand=function(){
    var hand=new Hand;

    for(var i=0;i<this.tiles.length;i++)
        hand.add(this.tiles[i].code);

    for(var i=0;i<this.melds.length;i++)
        hand.melds.push([this.melds[i][0],this.melds[i][1][0].code,this.melds[i][1].map(function(a){return a.code;})]);

    if(this.lastDraw)
        hand.lastDraw=this.lastDraw.code;

    hand.dora=this.table.dora;
    hand.roundWind=this.table.roundWind;
    hand.ownWind=this.ownWind;

    return hand;
}

SetHand.prototype.changeWait=function(){
    var hand=new Hand;
    var left=this.x;

    for(var index=0;index<this.wait.length;index++)
        this.wait[index].fadeOut();

    this.wait=[];

    for(var index=0;index<this.tiles.length;index++){
        left+=this.tiles[index].tileset.w;
        hand.add(this.tiles[index].code);
    }

    for(var i=0;i<this.melds.length;i++){
        var entry=this.melds[i];

        hand.melds.push([entry[0],entry[1][0]]);
    }

    var wait=hand.wait();

    left+=this.table.tileset.w/2;
    for(var index=0;index<wait.length;index++){
        var entry=wait[index];
        var tile=this.table.addTileAppear(entry[0],left,this.y,this.waitEvents);
        tile.setOpacity(0.6);
        left+=tile.tileset.w;
        this.wait.push(tile);
    }
}

SetHand.prototype.addMeld=function(kind,meld,events){
    var newMeld=[];

    newMeld.push(kind);
    newMeld.push([]);

    for(var j=0;j<meld.length;j++){
        var tile=meld[j];

        newMeld[1].push(this.table.addTile(tile.code,tile.x,tile.y,events));
        this.removeTile(tile);
    }

    this.melds.push(newMeld);

    this.changeWait();
    this.refresh();
}
SetHand.prototype.removeMeld=function(meldTile){

    for(var i=0;i<this.melds.length;i++){
        var entry=this.melds[i][1];
        for(var j=0;j<entry.length;j++){
            if(entry[j]==meldTile){
                for(var z=0;z<entry.length;z++)
                    entry[z].fadeOut()
                this.melds.remove(this.melds[i]);

                this.changeWait();
                this.refresh();
                return;
            }
        }
    }
}
Tile.prototype.moveTo=function(x,y){
    this.table.movingTiles.remove(this);
    this.table.movingTiles.push(this);

    this.targetX=x;
    this.targetY=y;

    this.table.startTimer();
}

Tile.prototype.relocate=function(x,y){
    this.appearing=false;
    if(this.x!=x) this.elem.style.left=this.x=x;
    if(this.y!=y) this.elem.style.top=this.y=y;
}

Tile.prototype.place=function(x,y){
    this.table.movingTiles.remove(this);

    this.relocate(x,y);
    this.targetX=this.idleX=this.x=x;
    this.targetY=this.idleY=this.y=y;
}

Tile.prototype.fadeOut=function(){
    this.table.movingTiles.remove(this);
    this.table.movingTiles.push(this);

    this.idleX=this.x;
    this.idleY=this.y;
    this.targetX=this.x;
    this.targetY=this.y-TILE_HEIGHT;
    this.fading=true;

    this.table.startTimer();
}

Tile.prototype.setOpacity=function(v){
    this.opacity=v;

    this.elem.style.opacity=v;
}

Tile.prototype.remove=function(){

    if(this.table)
        this.table.tiles.remove(this);

    if(this.elem){
        if(this.elem.parentNode)
            this.elem.parentNode.removeChild(this.elem);

        if(this.onclick)
            this.elem.removeEventListener("click",this.onclick,false);
        if(this.onmouseover)
            this.elem.removeEventListener("mouseover",this.onmouseover,false);
        if(this.onmouseout)
            this.elem.removeEventListener("mouseout",this.mouseout,false);
    }

}

Tile.prototype.changeTileset=function(tileset){
    var old=this.elem;

    if(this.tileset==tileset) return;

    var elem=tileset.createTileGraphic(this.code);
    elem.style.position	= defined(this.elem)?this.elem.style.position:"absolute";
    elem.style.left		= this.x;
    elem.style.top		= this.y;

    if(this.onclick) elem.addEventListener("click",this.onclick,false);
    if(this.onmouseover) this.elem.addEventListener("mouseover",this.onmouseover,false);
    if(this.onmouseout) this.elem.addEventListener("mouseout",this.mouseout,false);

    if(old)
        old.parentNode.replaceChild(elem,old);

    this.elem=elem;
    this.tileset=tileset;

    return elem;
}

TileSet.prototype.createTileGraphic=function(code){
    if(code>=TILE_WHITESPACE){
        var elem=document.createElement('div');
        elem.style.height				= this.h;
        elem.style.display				= "inline-block";

        if(code==TILE_WHITESPACE)
            elem.style.width			= this.w;
        else if(code==TILE_HALFSPACE)
            elem.style.width			= this.w/2;

        return elem;
    }

    var y=suit(code);
    var x=(y==HONORS)?
        1+type(code)-27:
        (code&RED?0:numberic(code));

    if(code&CLOSED){x=8;y=3;}

    var elem=document.createElement('div');
    elem.style.backgroundPosition	= ""+(-x*this.w)+"px "+(-y*this.h)+"px";
    elem.style.backgroundImage		= "url("+this.picture+")";
    elem.style.width				= this.w;
    elem.style.height				= this.h;
    elem.style.display				= "inline-block";

    return elem;
}

function createTile(tileset,code,events){
    var tile=new Tile(code,0,0,events);
    var elem=tile.changeTileset(tileset);
    elem.style.position				= "";

    return tile;
}

function createCombination(tileset,combination,events){
    var elem=document.createElement('div');
    elem.style.padding				= 0;
    elem.style.margin				= 0;

    function add(c){elem.appendChild(createTile(tileset,c,events).elem);}

    combination.forEach(function(c){
        var t=(c[0]&MELD_MASK);
        var tt=generalize(c[1]);

        if(t==PAIR){
            add(tt);
            add(tt);
        } else if(t==PON){
            add(tt);
            add(tt);
            add(tt);
        } else if(t==CHII){
            add(tt);
            add(tt+0x100);
            add(tt+0x200);
        } else if(t==KAN){
            var ttt=c[0]&CLOSED?tt|CLOSED:tt;
            add(tt);
            add(ttt);
            add(ttt);
            add(tt);
        } else if(t==KOKUSHI_MUSOU){
            KOKUSHI_MUSOU_SEQ.forEach(function(v){
                if(v==type(tt)) add(v<<8);
                add(v<<8);
            });
        }
        add(TILE_HALFSPACE);
    });

    elem.removeChild(elem.lastChild);

    return elem;
}

