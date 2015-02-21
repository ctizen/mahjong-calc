
function TileSet(picture,w,h){
    this.picture=picture;
    this.w=w;
    this.h=h;
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
