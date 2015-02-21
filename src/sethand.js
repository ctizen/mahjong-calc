var _ = require('lodash');

function SetHand(){
    this.wait=new Array;
    this.valid=new Array;

    this.ownWind=WIND_EAST;
}

SetHand.prototype=new Set();

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
    var self = this;
    for(var i=0;i<this.melds.length;i++){
        var entry=this.melds[i][1];
        for(var j=0;j<entry.length;j++){
            if(entry[j]==meldTile){
                for(var z=0;z<entry.length;z++)
                    entry[z].fadeOut()
                _.remove(this.melds, function(element) {
                    return element == self.melds[i];
                });

                this.changeWait();
                this.refresh();
                return;
            }
        }
    }
}
