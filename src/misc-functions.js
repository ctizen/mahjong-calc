
function capitalize(s){return s.substr(0,1).toUpperCase()+s.substr(1).toLowerCase()}
function plus(a,b){return a+b[1]}

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


