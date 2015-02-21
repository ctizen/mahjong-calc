
function Set(){
    this.tiles=new Array;
    this.melds=new Array;

    this.lastDraw=undefined;
}

Set.prototype.addTile=function(code,x,y,events){
    var i;
    var left=this.x;

    for(i=0;i<this.tiles.length;i++){
        if(this.tiles[i].code>code) break;
        left+=this.tiles[i].tileset.w;
    }

    if(!x){
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