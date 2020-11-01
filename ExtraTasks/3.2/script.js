let prices = [7,1,5,3,6,4];


let cashProfile = {
    maxCash: 0,

    curentCash: 0,
    isShares: false,

    buyShares: function(price) {
        if(!this.isShares) {
            this.curentCash -= price;
            this.isShares = true;
        }
        
    },
    soldShares: function(price) {
        if(this.isShares) {
            this.curentCash += price;
            this.isShares = false;
        }
    },
}

