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
    elem.style.position	= this.elem ? this.elem.style.position : "absolute";
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

