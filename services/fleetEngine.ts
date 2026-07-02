// =====================================================
// FLEET ENGINE
// Central Fleet Logic
// =====================================================


export function getServiceable(
  fleet:any[]
){

  return fleet.filter(
    f =>
      f.MaintenanceStatus === "NONE" &&
      f.CertificateStatus === "VALID" &&
      f.SparepartStatus === "READY"
  );

}



export function getMaintenance(
  fleet:any[]
){

  return fleet.filter(
    f =>
      f.MaintenanceStatus !== "NONE"
  );

}



export function getAOG(
  fleet:any[]
){

  return fleet.filter(
    f =>
      f.OperationalStatus === "AOG" ||
      f.CertificateStatus === "EXPIRED" ||
      f.SparepartStatus === "WAITING"
  );

}



// =====================================================
// HEALTH SCORE
// =====================================================


export function getHealthScore(
 aircraft:any
){

 let score = 100;


 if(
  aircraft.MaintenanceStatus !== "NONE"
 ){
  score -= 25;
 }


 if(
  aircraft.CertificateStatus === "EXPIRED"
 ){
  score -= 40;
 }


 if(
  aircraft.SparepartStatus === "WAITING"
 ){
  score -= 40;
 }


 return Math.max(score,0);

}



export function getFleetHealth(
 fleet:any[]
){

 if(!fleet.length)
 return 0;


 const total =
 fleet.reduce(
  (sum,aircraft)=>
   sum + getHealthScore(aircraft),
  0
 );


 return Math.round(
  total / fleet.length
 );

}



// =====================================================
// READINESS
// =====================================================


export function getReadiness(
 fleet:any[]
){

 if(!fleet.length)
 return 0;


 const serviceable =
 getServiceable(fleet);


 return Math.round(
  (
   serviceable.length /
   fleet.length
  ) * 100
 );

}




// =====================================================
// MISSION RECOMMENDATION
// hanya pesawat siap operasi
// =====================================================


export function getMissionRecommendation(
 fleet:any[]
){


return fleet

.filter(
aircraft =>


aircraft.OperationalStatus === "SERVICEABLE"

&&

aircraft.MaintenanceStatus === "NONE"

&&

aircraft.CertificateStatus === "VALID"

&&

aircraft.SparepartStatus === "READY"


)



.sort(

(a,b)=>

getHealthScore(b)

-

getHealthScore(a)

)



.slice(0,3);



}


export function getMaintenanceForecast(
fleet:any[],
maintenanceMaster:any[],
approval:any[]
){


const forecast:any[]=[];



function getCurrent(
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

return {
value:Number(aircraft.Engine1FH ?? 0),
unit:"FH"
};



case "HYD1500":

return {
value:Number(aircraft.HydraulicFH ?? 0),
unit:"FH"
};



case "LG50":

return {
value:Number(aircraft.LandingGearFC ?? 0),
unit:"FC"
};



case "FCU1200":

return {
value:Number(aircraft.FCUFH ?? 0),
unit:"FH"
};



case "FN1200":

return {
value:Number(aircraft.FNozzleFH ?? 0),
unit:"FH"
};



case "FP1200":

return {
value:Number(aircraft.FPumpFH ?? 0),
unit:"FH"
};



default:

return {
value:0,
unit:"FH"
};


}

}







fleet.forEach((aircraft)=>{


// ============================
// SKIP FORECAST IF MAINTENANCE ACTIVE
// ============================


const maintenanceActive = approval.some(
(x:any)=>
x.Aircraft === aircraft.Aircraft
&&
x.ApprovalStatus === "PENDING"
);



if(
maintenanceActive
||
aircraft.MaintenanceStatus !== "NONE"
){

return;

}


let airframeDone=false;



maintenanceMaster.forEach((item)=>{



let currentData;


let remaining;



// ======================
// AIRFRAME SPECIAL
// ======================


if(
(item.Code==="P200" ||
item.Code==="P400")
&&
airframeDone
){

return;

}





if(
item.Code==="P200" ||
item.Code==="P400"
){


const fh =
Number(
aircraft.AirframeFH ?? 0
);



let next;



if(
Math.ceil(fh/400)*400
===
Math.ceil(fh/200)*200
&&
Math.ceil(fh/400)*400 % 400===0
){


next =
Math.ceil(fh/400)*400;


}


else{


next =
Math.ceil(fh/200)*200;


}



remaining =
next-fh;



airframeDone=true;



forecast.push({

Aircraft:
aircraft.Aircraft,

Item:
next%400===0
?
"P400"
:
"P200",

Remaining:
remaining,

Unit:
"FH"


});



return;

}





// ======================
// NORMAL
// ======================


currentData =
getCurrent(
aircraft,
item.Code
);



let interval;



let warning;



if(
item.IntervalFH !== "-"
){


interval =
Number(item.IntervalFH);


warning =
Number(item.WarningFH);


}


else{


interval =
Number(item.IntervalFC);


warning =
Number(item.WarningFC);


}






const next =

Math.ceil(
currentData.value /
interval
)

*

interval;



remaining =
next -
currentData.value;




if(
remaining <= warning
){



forecast.push({

 Aircraft:
 aircraft.Aircraft,


 Item:
 item.Item,


 Remaining:
 remaining,


 Unit:
 item.IntervalFC 
 ?
 "FC"
 :
 "FH",


});



}



});



});






return forecast

.sort(
(a,b)=>
a.Remaining-b.Remaining
)

.slice(0,3);



}


// =====================================================
// SUMMARY
// =====================================================


export function getFleetSummary(
 fleet:any[]
){

 return {


 total:
 fleet.length,


 serviceable:
 getServiceable(fleet).length,


 maintenance:
 getMaintenance(fleet).length,


 aog:
 getAOG(fleet).length,


 readiness:
 getReadiness(fleet)

 };


}



// =====================================================
// WARNING ENGINE
// hanya status aktual
// =====================================================


export function getAircraftWarnings(
 aircraft:any
){

 const warnings:any[] = [];


 if(
  aircraft.CertificateStatus === "EXPIRED"
 ){

  warnings.push({

   type:"CERTIFICATE",

   level:"CRITICAL",

   message:
   "Certificate expired"

  });

 }



 if(
  aircraft.SparepartStatus === "WAITING"
 ){

  warnings.push({

   type:"LOGISTIC",

   level:"MEDIUM",

   message:
   "Sparepart waiting"

  });

 }



 if(
  aircraft.MaintenanceStatus !== "NONE"
 ){

  warnings.push({

   type:"MAINTENANCE",

   level:"INFO",

   message:
   `Under ${aircraft.MaintenanceStatus}`

  });

 }



 return warnings;

}



// =====================================================
// BADGE
// =====================================================


export function getBadgeClass(
 type:string,
 value:string
){


 if(type==="maint"){

  return value==="NONE"

  ?
  "bg-green-500/20 text-green-400 border border-green-500/30"

  :

  "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";

 }



 if(type==="cert"){

  return value==="VALID"

  ?
  "bg-green-500/20 text-green-400 border border-green-500/30"

  :

  "bg-red-500/20 text-red-400 border border-red-500/30";

 }



 if(type==="spare"){

  return value==="READY"

  ?
  "bg-green-500/20 text-green-400 border border-green-500/30"

  :

  "bg-red-500/20 text-red-400 border border-red-500/30";

 }



 return "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30";


}