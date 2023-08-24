class Coupon {
    //Personal details
    id:             number;
    voucher:        string;
    expiry_date:    string;
    isActive:       string;
    amount:       string;

    constructor(id: number, voucher: string, expiry_date: strring, isActive: string, amount: string) {
        this.id             = id;
        this.voucher        = voucher;
        this.expiry_date    = expiry_date;
        this.isActive       = isActive;
        this.amount         = amount;
    }

    function couponGenerator() {
        var coupon = "";
        const possible = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 4; i++){
            coupon += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return coupon;
    }

    let discountExists = false;
    do {
        let myDicountCode = couponGenerator();
        let newDiscountCode = new DiscountCode({voucher: myDicountCode, 
                                                ispercent: false, 
                                                amount: [{AUD: 5}, {USD: 10}], 
                                                expiry: expiry_date, 
                                                isActive: true
    });
        newDiscountCode.save(function (err) {
            if (err) {
                if (err.name === 'MongoError' && err.code === 11000) {
                    //Duplicate detected
                    discountExists = true;
                }
            }
            res.send({
                //success message
            })
        })
        
    }
}

export = Coupon;