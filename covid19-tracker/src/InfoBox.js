import React from 'react';
import './InfoBox.css';
import {Card,CardContent,Typography} from "@material-ui/core";


function InfoBox({title,cases,active,isRed,total,...props}) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active &&  'infoBox--selected'} ${isRed && 'infoBox--red'}`}>
            <CardContent>
                {/* Title */}

            <Typography  className="infoBox_title" color="textSecondary">{title}</Typography>

                {/* 120 no f cases */}
            <h2 className={`infoBox_cases ${!isRed && "infoBox_cases--green"}`}>Today {cases}</h2>

                {/* 1.2M total */}
            <Typography className="infoBox_total" color="textSecondary">{total} Total</Typography>    
            </CardContent>
        </Card>
    )
}

export default InfoBox
