// =====================================================
// MAINTENANCE FORECAST ENGINE
// Single Source Maintenance Logic
// =====================================================


export function getCurrentValue(
 aircraft:any,
 code:string
){

switch(code){


case "P200":
case "P400":

return {
 value:Number(aircraft.AirframeFH ?? 0),
 unit:"FH"
};



case "ENG1200":
case "ENG2400":

return {
 value:Number(aircraft.Engine1FH ?? 0),
 unit:"FH"
};



case "HYD1500":
case "HYD3000":

return {
 value:Number(aircraft.HydraulicFH ?? 0),
 unit:"FH"
};



case "FCU1200":
case "FCU2400":

return {
 value:Number(aircraft.FCUFH ?? 0),
 unit:"FH"
};



case "FN1200":
case "FN2400":

return {
 value:Number(aircraft.FNozzleFH ?? 0),
 unit:"FH"
};



case "FP1200":
case "FP2400":

return {
 value:Number(aircraft.FPumpFH ?? 0),
 unit:"FH"
};



case "LG50":

return {
 value:Number(aircraft.LandingGearFC ?? 0),
 unit:"FC"
};



default:

return {
 value:0,
 unit:""
};

}

}




// =====================================================
// NEXT DUE
// =====================================================

function calculateDue(
current:number,
interval:number
){

return Math.ceil(
current / interval
)
*
interval;

}



// =====================================================
// MAIN FORECAST
// =====================================================

export function generateMaintenanceForecast(
fleet:any[],
maintenanceMaster:any[]
){


const result:any[]=[];



fleet.forEach((aircraft)=>{


const airframeHandled =
false;



maintenanceMaster.forEach((item)=>{



let code=item.Code;



// ===================================
// AIRFRAME SPECIAL
// P400 PRIORITY
// ===================================


if(
code==="P200" ||
code==="P400"
){


const current =
Number(
aircraft.AirframeFH ?? 0
);



const interval =
Number(
item.IntervalFH
);



const due =
calculateDue(
current,
interval
);



const remaining =
due-current;



// P400 menggantikan P200

if(
code==="P200"
&&
due%400===0
){

return;

}



if(
remaining <= Number(item.WarningFH)
){


result.push({

Aircraft:
aircraft.Aircraft,


Item:
item.Item,


Code:
code,


Current:
current,


Due:
due,


Remaining:
remaining,


Unit:"FH"



});


}


return;


}



// ===================================
// NORMAL COMPONENT
// ===================================



const currentData =
getCurrentValue(
aircraft,
code
);



const interval =
Number(
item.IntervalFH !== "-"
?
item.IntervalFH
:
item.IntervalFC
);



const warning =
Number(
item.IntervalFH !== "-"
?
item.WarningFH
:
item.WarningFC
);



const due =
calculateDue(
currentData.value,
interval
);



const remaining =
due-currentData.value;



if(
remaining <= warning
){


result.push({

Aircraft:
aircraft.Aircraft,


Item:
item.Item,


Code:
code,


Current:
currentData.value,


Due:
due,


Remaining:
remaining,


Unit:
currentData.unit



});


}



});


});



return result.sort(
(a,b)=>
a.Remaining-b.Remaining
);


}