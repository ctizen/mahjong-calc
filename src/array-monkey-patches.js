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

Array.prototype.fold=function(v,f){
    for(var i=0;i<this.length;i++)
        v=f(v,this[i]);

    return v;
};