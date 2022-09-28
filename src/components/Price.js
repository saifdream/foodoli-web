import React, {memo} from "react";
import {Typography} from "@material-ui/core";
import {DollarSign} from "react-feather";

const Price = memo(
    ({price, discount, classname}) => {
        if(discount > 0)
            return <Typography variant="subtitle2" className={classname}><DollarSign size={14}/>{price - price * discount/100 } - (<del><DollarSign size={14}/>{price}</del>)</Typography>
        else
            return <Typography variant="subtitle2" className={classname}><DollarSign size={14}/>{price}</Typography>
    }
)

export default Price;
