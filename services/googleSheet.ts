import axios from "axios";


const SPREADSHEET_ID =
"1tCJ8k8AwpQesVvx9bfH4mm7m-RYQ6FZPei6xmiI-w8E";



const GAS_URL =
process.env.NEXT_PUBLIC_GAS_URL;

console.log("GAS URL =", GAS_URL);

function sheetUrl(sheetName:string){

return `https://opensheet.elk.sh/${SPREADSHEET_ID}/${encodeURIComponent(sheetName)}`;

}



// ===============================
// GET AIRCRAFT
// ===============================


export async function getAircraftData(){


const res =
await axios.get(

sheetUrl(
"Aircraft_Master"
)

);


return res.data;


}




// ===============================
// GET LOGBOOK
// ===============================


export async function getMaintenanceLogbook(){


const res =
await axios.get(

sheetUrl(
"Maintenance_Logbook"
)

);


return res.data;


}




// ===============================
// GET PLAN
// ===============================


export async function getMaintenancePlan(){


const res =
await axios.get(

sheetUrl(
"Maintenance_Plan"
)

);


return res.data;


}

export async function getAnnualPlan(){

const res =
await axios.get(

sheetUrl(
"Maintenance_Plan"
)

);

return res.data;

}


// ===============================
// GET MASTER
// ===============================


export async function getMaintenanceMaster(){


const res =
await axios.get(

sheetUrl(
"Maintenance_Master"
)

);


return res.data;


}




// ===============================
// GET APPROVAL
// ===============================


export async function getMaintenanceApproval(){


const res =
await axios.get(

sheetUrl(
"Maintenance_Approval"
)

);


return res.data;


}



export async function updateMaintenanceApproval(
  id: string,
  pin: string,
  action: string,
  remarks: string
) {

  const res = await fetch(
    GAS_URL!,
    {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "updateMaintenanceApproval",
        id,
        pin,
        result: action,
        remarks,
      }),
    }
  );

  const text = await res.text();

  console.log("STATUS:", res.status);
  console.log("RESPONSE GOOGLE:", text);

  return JSON.parse(text);
}


export async function getUsers(){

const res =
await axios.get(
sheetUrl(
"USER_DATABASE"
)
);

return res.data;

}

export async function registerUser(data:any){


const response =
await fetch(
process.env.NEXT_PUBLIC_GAS_URL!,
{

method:"POST",

body:JSON.stringify({

action:"registerUser",

...data

})

}

);


return await response.json();


}

export async function loginUser(data:any){


const url =
process.env.NEXT_PUBLIC_GAS_URL;


const res =
await fetch(
url!,
{

method:"POST",

body:JSON.stringify({

action:"loginUser",

username:data.username,

password:data.password

})

}

);


return await res.json();


}

export async function updateUser(data:any){


const url =
process.env.NEXT_PUBLIC_GAS_URL;



const res =
await fetch(url,{

method:"POST",

body:JSON.stringify({

action:"updateUser",

...data

})

});



return await res.json();


}

