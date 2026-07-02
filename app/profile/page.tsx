"use client";

import {
useEffect,
useState
} from "react";

import Link from "next/link";

import {
ArrowLeft,
User,
Shield,
Badge,
KeyRound,
Settings,
Activity,
Edit3,
CheckCircle,
Clock,
Database,
Lock
} from "lucide-react";



export default function ProfilePage(){


const [user,setUser]=useState<any>(null);



useEffect(()=>{


const saved =
localStorage.getItem(
"simharpes_user"
);


if(saved){

setUser(
JSON.parse(saved)
);

}


},[]);



return (

<div
className="
max-w-6xl
mx-auto
space-y-8
py-6
"
>


{/* HEADER */}

<div
className="
flex
justify-between
items-center
"
>


<div
className="
flex
items-center
gap-4
"
>


<Link

href="/dashboard"

className="
w-12
h-12
rounded-2xl

bg-[#111827]

border
border-white/10

flex
items-center
justify-center

hover:border-cyan-400

transition

"

>

<ArrowLeft size={20}/>

</Link>

<div>

<h1
className="
text-3xl
font-black
"
>

PROFIL AKUN

</h1>

</div>

</div>



<Link

href="/profile/edit"

className="
flex
items-center
gap-2

px-5
py-3

rounded-2xl

bg-cyan-500/10

border
border-cyan-400/20

text-cyan-400

hover:bg-cyan-500/20

transition

"

>

<Edit3 size={16}/>

Edit Profil

</Link>


</div>





{/* MAIN PROFILE CARD */}



<div

className="
relative

overflow-hidden

rounded-[32px]

border
border-white/10

bg-[#0B1727]

p-10

shadow-2xl

"

>


<div

className="
absolute

w-96
h-96

bg-cyan-500/10

rounded-full

blur-3xl

-top-40
-right-40

"

/>



<div
className="
relative
flex
items-center
gap-8
"
>



<div

className="
w-36
h-36

rounded-[32px]

bg-cyan-500/10

border
border-cyan-400/30

flex
items-center
justify-center

text-5xl

font-black

text-cyan-400

"

>


{

user?.nama
?
user.nama.charAt(0)
:
"U"

}


</div>




<div>


<h2
className="
text-4xl
font-black
"
>

{
user?.nama ||
"Unknown User"
}

</h2>



<div
className="
flex
gap-3
mt-4
flex-wrap
"
>




<span

className="
px-4
py-2

rounded-full

bg-green-500/10

border
border-green-400/20

text-green-400

flex
items-center
gap-2

text-sm

"

>

<CheckCircle size={14}/>

ACTIVE

</span>


</div>


</div>


</div>


</div>







{/* IDENTITY GRID */}



<div

className="
grid

md:grid-cols-2

xl:grid-cols-4

gap-6

"

>


<Card

icon={<User/>}

title="Nama"

value={user?.nama}

/>



<Card

icon={<Badge/>}

title="NRP"

value={user?.nrp}

/>



<Card

icon={<Shield/>}

title="Pangkat"

value={user?.pangkat}

/>



<Card

icon={<KeyRound/>}

title="Role"

value={user?.role}

/>


</div>







{/* LOWER SECTION */}



<div

className="
grid

lg:grid-cols-2

gap-8

"

>





<Panel

title="System Activity"

icon={<Activity/>}

>

<Row
title="Last Login"
value="Today"
/>


<Row
title="System Access"
value="Authorized"
/>


<Row
title="Version"
value="SIMHARPES v1.0"
/>


<Row
title="Status"
value="Operational"
/>


</Panel>








<Panel

title="Security & Permission"

icon={<Lock/>}

>


<Row

title="Account"

value="Verified"

/>


<Row

title="Permission"

value={user?.role}

/>


<Row

title="Database"

value="Connected"

/>


<Row

title="Access"

value="Personnel"

/>


</Panel>



</div>




</div>


)

}







function Card({
icon,
title,
value
}:any){


return (

<div

className="
bg-[#111827]

border
border-white/10

rounded-3xl

p-6

hover:border-cyan-400/30

transition

"

>


<div

className="
flex
items-center
gap-3

text-cyan-400

mb-4

"

>

{icon}

<span
className="
text-sm
text-gray-400
"
>

{title}

</span>


</div>



<p
className="
font-bold
text-lg
"
>

{value || "-"}

</p>


</div>

)

}





function Panel({
title,
icon,
children
}:any){


return (

<div

className="
bg-[#111827]

border
border-white/10

rounded-[32px]

p-8

"

>


<h3

className="
flex
items-center
gap-3

font-bold

mb-6

"

>


<span
className="
text-cyan-400
"
>

{icon}

</span>


{title}


</h3>



<div
className="
space-y-5
"
>

{children}

</div>



</div>


)

}





function Row({
title,
value
}:any){


return (

<div

className="
flex
justify-between

border-b

border-white/5

pb-4

"

>


<span
className="
text-gray-400
"
>

{title}

</span>



<span
className="
font-semibold
"
>

{value || "-"}

</span>


</div>


)

}