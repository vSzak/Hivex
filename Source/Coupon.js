const {get} = require('mongoose')
const coupon = require("../database/models/coupon")
var voucherCodes = require('voucher-code-generator')

const addCoupon = async (body) => {
    const newCoupon = new coupon({

        expiry: body.expiry,
        totalCreated: body.totalCreated,
        couponCode: voucherCodes,
        value: body.value
    })
    return newCoupon.save()
}

voucherCodes.generate({
    length: 4,
    count: body.totalCreated,
    charset: voucherCodes.charset("alphanumeric")
})

const getAllCoupons = async () => {
    return await coupon.find({})
}

const verifyCoupon = async (body) =>{

    const Coupon = await coupon.findOne({code: body.coupon})
    if (coupon) {
        if (new Date().getTime() < coupon.expiry.getTime()) {
            if (body.total >= coupon.totalCreated) {

                let discount
                if (Coupon.type === 'percentage') {
                    discount = (body.total * Coupon.value)/100
                } else {
                    discount = Coupon.value
                }

                return {
                    inRange: true,
                    discount,
                    finalAmount: body.total - discount
                }
            } else {
                return{
                    inRange: false,
                    message: `Need to add more items with ${Coupon.totalCreated - body.total} to the list for this coupon to be enabled.`
                }
            }
        } else {
            return {
                inRange: false,
                message: `Coupon expired! Try another coupon.`
            }
        }
    } else {
        return {
            inRange: false,
            message: 'Coupon invalid! Please use a valid coupon.'
        }
    }
}

module.exports = {addCoupon, getAllCoupons, verifyCoupon}