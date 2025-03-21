const displayINRCurrency = (num) => {
    const formatter = new Intl.NumberFormat('en-IN',{
        style : "currency",
        currency : 'INR',
        minimumFractionDigits : 2
    })

    return formatter.format(num).replace('₹', 'Rs.');

}

export default displayINRCurrency