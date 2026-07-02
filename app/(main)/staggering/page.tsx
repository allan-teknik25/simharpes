"use client";

import { useEffect, useMemo, useState } from "react";

import {
CalendarDays,
AlertTriangle,
Radar,
Clock3,
CheckCircle,
ArrowRight,
AlertCircle
} from "lucide-react";

import {
  getAircraftData,
  getMaintenancePlan,
  getMaintenanceMaster,
  getMaintenanceLogbook,
  getMaintenanceApproval,
  getAnnualPlan
} from "@/services/googleSheet";


export default function StaggeringPage() {

  // =====================================================
  // STATES
  // =====================================================

  const [fleet, setFleet] =
    useState<any[]>([]);

  const [plan, setPlan] =
    useState<any[]>([]);

  const [rules, setRules] =
    useState<any[]>([]);

  const [logbook, setLogbook] =
    useState<any[]>([]);    

  const [annualPlan,setAnnualPlan] =
  useState<any[]>([]);  

  const [approval,setApproval] =
  useState<any[]>([]);

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const [selectedTask,setSelectedTask] =
    useState<any>(null);

  const [page,setPage]=useState(0);  
  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    async function load() {

      const aircraft =
        await getAircraftData();

      const maintenancePlan =
        await getMaintenancePlan();

      const maintenanceRules =
        await getMaintenanceMaster();

      const maintenanceLogbook =
        await getMaintenanceLogbook();

      const annual =
        await getAnnualPlan();  
        console.log("ANNUAL PLAN", annual);

let approvalData:any[] = [];

try {

  approvalData =
    await getMaintenanceApproval();

  console.log(
    "APPROVAL DATA",
    approvalData
  );

}
catch(error){

  console.error(
    "APPROVAL ERROR",
    error
  );

}
        
      setFleet(aircraft);

      setPlan(maintenancePlan);

      setRules(maintenanceRules);

      setLogbook(maintenanceLogbook);

      setAnnualPlan(annual);

      setApproval(approvalData);

    }

    load();

  }, []);



const currentWeek =
Math.ceil(
(
new Date().getTime() -
new Date(
new Date().getFullYear(),
0,
1
).getTime()
)
/
(1000*60*60*24*7)
)+1;

const WEEKLY_USAGE = 5;






const maintenanceBoard =
useMemo(()=>{


const rows:any[]=[];


fleet.forEach((aircraft:any)=>{


rules.forEach((rule:any)=>{


let currentValue=0;



// ==========================
// CURRENT VALUE
// ==========================


switch(rule.Item){


case "LandingGear":

currentValue =
Number(
aircraft.LandingGearFC || 0
);

break;


case "Airframe":

currentValue =
Number(
aircraft.AirframeFH || 0
);

break;


case "Engine":

currentValue =
Math.max(
Number(aircraft.Engine1FH||0),
Number(aircraft.Engine2FH||0)
);

break;


case "Hydraulic":

currentValue =
Number(
aircraft.HydraulicFH||0
);

break;


}



// ==========================
// NEXT DUE
// ==========================


let nextDue=0;
let task="";



// ==========================
// P200/P400 STAGGER
// ==========================


if(rule.Item==="Airframe"){



let sequence:any[]=[];


for(
let fh=200;
fh<=5000;
fh+=200
){


let index =
fh/200;


sequence.push({

fh,


code:
index%2===0
?
"P400"
:
"P200",


cycle:
Math.ceil(index/2)

});


}



const next =
sequence.find(
(x)=>
x.fh > currentValue
);



if(!next)
return;



if(
next.code !== rule.Code
)
return;



nextDue =
next.fh;


task =
`${next.code} - ${next.cycle}x`;



}



// ==========================
// NORMAL RULE
// ==========================


else{


const interval =

rule.Item==="LandingGear"

?
Number(rule.IntervalFC||0)

:

Number(rule.IntervalFH||0);



if(interval<=0)
return;



nextDue =

Math.ceil(
currentValue /
interval
)
*
interval;



const cycle =

Math.ceil(
currentValue /
interval
);



task =
`${rule.Code} - ${cycle}x`;



}



// ==========================
// FORECAST
// ==========================


const remaining =
nextDue-currentValue;




let  forecastWeek =
currentWeek +
Math.ceil(
remaining / WEEKLY_USAGE
);



// ==========================
// PLAN
// ==========================


let planWeek=null;


const annual =

annualPlan.find(
(x:any)=>
x.Aircraft===aircraft.Aircraft
);



if(annual){


Object.keys(annual)
.forEach(key=>{


if(
key.startsWith("W")
&&
String(annual[key])
.includes(rule.Code)
){

planWeek =
Number(
key.replace("W","")
);


}



});


}



// ==========================
// STATUS
// ==========================


let status="";



if(!planWeek){
return;
}

else if(
forecastWeek===planWeek
){

status="EXACT";

}

else if(
forecastWeek<planWeek
){

status="EARLIER";

}

else if(
forecastWeek>planWeek
){

status="LATER";

}



// overdue jika lewat current week

if(
forecastWeek < currentWeek
){

status="OVERDUE";

}



// jangan masuk

if(status==="UNPLANNED")
return;



rows.push({

aircraft:
aircraft.Aircraft,

item:
rule.Item,

task,

current:currentValue,

due:nextDue,

plan:`W${planWeek}`,

forecast:`W${forecastWeek}`,

forecastWeek,

status

});



});


});



return rows.sort((a,b)=>{


const priority:any={

OVERDUE:1,

LATER:2,

EARLIER:3,

EXACT:4

};


if(
priority[a.status] !==
priority[b.status]
){

return (
priority[a.status]
-
priority[b.status]
);

}


return (
a.forecastWeek -
b.forecastWeek
);


});


},[
fleet,
rules,
annualPlan,
currentWeek
]);

const pageSize=10;


const totalPage =
Math.ceil(
maintenanceBoard.length/pageSize
);



const visibleRows =
maintenanceBoard.slice(
page*pageSize,
(page+1)*pageSize
); 

const statusSummary =
useMemo(()=>{

return {

EXACT:
maintenanceBoard.filter(
x=>x.status==="EXACT"
).length,


EARLIER:
maintenanceBoard.filter(
x=>x.status==="EARLIER"
).length,


LATER:
maintenanceBoard.filter(
x=>x.status==="LATER"
).length,


OVERDUE:
maintenanceBoard.filter(
x=>x.status==="OVERDUE"
).length,


};


},[maintenanceBoard]);

// =====================================================
// UI
// =====================================================

return (

<div
className="
p-5
"
>

{/* STATUS */}


<div
className="
flex
justify-between
items-center
mb-6
"
>


<div>

<div className="text-gray-400 text-sm mt-1">

Minggu Ke = {""}
<span className="text-cyan-400 font-bold">

W{currentWeek}

</span>

</div>


<div className="text-xl font-bold">

{
new Date()
.toLocaleDateString(
"en-US",
{
weekday:"long",
day:"numeric",
month:"short",
year:"numeric"
}
)
}

</div>
</div>
<div
className="
bg-green-500/10
border border-green-500/30
px-5
py-3
rounded-xl
text-green-400
font-bold
"
>

ONLINE

</div>



</div>

<div
className="
bg-[#111827]
border border-gray-800
rounded-3xl
p-6
"
>

<div
className="
grid
grid-cols-2
md:grid-cols-4
gap-4
mb-6
"
>


<div
className="
bg-green-500/10
border
border-green-500/30
rounded-2xl
p-4
"
>

<div className="flex items-center gap-2">

<CheckCircle
className="text-green-400"
/>

<span className="font-bold">
EXACT
</span>

</div>


<p className="text-gray-400 text-sm mt-2">

Prediksi sesuai dengan rencana

</p>


<div className="text-2xl font-bold text-green-400 mt-2">

{statusSummary.EXACT}

</div>


</div>





<div
className="
bg-blue-500/10
border
border-blue-500/30
rounded-2xl
p-4
"
>


<div className="flex items-center gap-2">


<ArrowRight
className="text-blue-400"
/>


<span className="font-bold">

EARLIER

</span>


</div>


<p className="text-gray-400 text-sm mt-2">

Prediksi lebih cepat dari rencana

</p>


<div className="text-2xl font-bold text-blue-400 mt-2">

{statusSummary.EARLIER}

</div>


</div>






<div
className="
bg-yellow-500/10
border
border-yellow-500/30
rounded-2xl
p-4
"
>


<div className="flex items-center gap-2">


<Clock3
className="text-yellow-400"
/>


<span className="font-bold">

LATER

</span>


</div>


<p className="text-gray-400 text-sm mt-2">

Prediksi melewati rencana

</p>


<div className="text-2xl font-bold text-yellow-400 mt-2">

{statusSummary.LATER}

</div>


</div>

<div
className="
bg-red-500/10
border
border-red-500/30
rounded-2xl
p-4
"
>


<div className="flex items-center gap-2">


<AlertCircle
className="text-red-400"
/>


<span className="font-bold">

OVERDUE

</span>


</div>


<p className="text-gray-400 text-sm mt-2">

Sudah melewati minggu berjalan

</p>


<div className="text-2xl font-bold text-red-400 mt-2">

{statusSummary.OVERDUE}

</div>


</div>



</div>


<div className="
flex
justify-between
mb-5
">


<h2 className="
text-2xl
font-bold
">

Tabel Perencanaan Pemeliharaan

</h2>



<div className="flex gap-2">


<button

disabled={page===0}

onClick={()=>setPage(page-1)}

className="
px-3
py-1
rounded-lg
bg-gray-800
"

>

←

</button>



<button

disabled={
page===totalPage-1
}

onClick={()=>setPage(page+1)}

className="
px-3
py-1
rounded-lg
bg-gray-800
"

>

→

</button>


</div>


</div>





<table
className="
w-full
text-sm
"
>


<thead>


<tr
className="
border-b
border-gray-700
text-gray-400
"
>


<th>Tail Number</th>

<th>Pemeliharaan</th>

<th>Aktif</th>

<th>Jatuh Tempo</th>

<th>Sisa</th>

<th>Rencana</th>

<th>Prediksi</th>

<th>Status</th>


</tr>


</thead>



<tbody>


{
visibleRows.map(
(row:any,i)=>(


<tr
key={i}
className="
border-b
border-gray-800
hover:bg-cyan-500/10
"
>


<td className="text-center py-3">
{row.aircraft}
</td>


<td className="
text-center
text-cyan-400
font-bold
">

{row.task}

</td>


<td className="
text-center">
{row.current}
{
row.item==="LandingGear"
?
" FC"
:
" FH"
}
</td>


<td className="
text-center">
{row.due}
{
row.item==="LandingGear"
?
" FC"
:
" FH"
}

</td>

<td className="
text-center
text-yellow-400
font-bold
">

{row.due-row.current}
{" "}
{row.item==="LandingGear"
?
" FC"
:
" FH"
}

</td>

<td className="text-center">

{row.plan}

</td>


<td className="text-center">

{row.forecast}

</td>




<td className="text-center">


<span
className={`
px-3
py-1
rounded-full
text-xs
font-bold

${
row.status==="EXACT"
?
"bg-green-500/20 text-green-400"

:
row.status==="EARLIER"
?
"bg-blue-500/20 text-blue-400"

:
row.status==="LATER"
?
"bg-yellow-500/20 text-yellow-400"

:
"bg-red-500/20 text-red-400"

}

`}
>


{row.status}


</span>


</td>



</tr>


)

)

}


</tbody>


</table>


</div>

</div>)}
