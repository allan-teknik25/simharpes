export async function submitLogbook(data:any){

const payload = {

action:data.action,

aircraft:data.aircraft,

engineer:data.engineer,

flightHourAdded:Number(data.flightHourAdded || 0),

engine1Added:Number(data.engine1Added || 0),

engine2Added:Number(data.engine2Added || 0),

hydraulicAdded:Number(data.hydraulicAdded || 0),

landingGearAdded:Number(data.landingGearAdded || 0),

fcuAdded:Number(data.fcuAdded || 0),

fNozzleAdded:Number(data.fNozzleAdded || 0),

fPumpAdded:Number(data.fPumpAdded || 0),

maintenanceStatus:data.maintenanceStatus,

operationalStatus:data.operationalStatus,

remarks:data.remarks

};


const response =
await fetch(
process.env.NEXT_PUBLIC_GAS_URL!,
{
method:"POST",

headers:{
"Content-Type":"text/plain;charset=utf-8"
},

body:
JSON.stringify(payload)

});


return await response.json();

}