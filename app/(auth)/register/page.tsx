"use client";

import {
useState
} from "react";

import {
Eye,
EyeOff,
UserPlus,
Plane,
Shield,
User,
Lock,
Badge,
ArrowRight,
LogIn
} from "lucide-react";

import {
useRouter
} from "next/navigation";


import {
registerUser
} from "@/services/googleSheet";



export default function RegisterPage(){


const router = useRouter();



const [showPassword,setShowPassword]
=
useState(false);


const [showConfirm,setShowConfirm]
=
useState(false);


const [loading,setLoading]
=
useState(false);



const [form,setForm]
=
useState({

nama:"",
nrp:"",
pangkat:"",
role:"",
username:"",
password:"",
confirm:""

});



function handleChange(
e:any
){

setForm({

...form,

[e.target.name]:
e.target.value

});

}




async function handleRegister(){


if(
Object.values(form)
.some(
(x)=>!x
)

){

alert(
"Lengkapi semua data"
);

return;

}



if(
form.password.length < 6
){

alert(
"Password minimal 6 karakter"
);

return;

}



if(
form.password !== form.confirm
){

alert(
"Password tidak sama"
);

return;

}



try{


setLoading(true);



await registerUser({

nama:form.nama,

nrp:form.nrp,

pangkat:form.pangkat,

role:form.role,

username:form.username,

password:form.password

});



alert(
"Registrasi berhasil"
);



router.push("/");



}
catch(error){

console.error(error);

alert(
"Gagal registrasi"
);


}

finally{

setLoading(false);

}


}




return (


<div

className="
min-h-screen
bg-[#050b18]
text-white
flex
items-center
justify-center
relative
overflow-hidden
p-6
"


>


{/* BACKGROUND */}


<div

className="
absolute
inset-0

bg-[url('/baground-pesawat.jpg')]

bg-cover

bg-center

opacity-25

"

/>



<div

className="
absolute
inset-0

bg-gradient-to-b

from-[#050b18]/60

via-[#050b18]/90

to-[#050b18]

"

/>




<div

className="
relative
z-10

w-full
max-w-5xl

glass

rounded-3xl

p-10

shadow-2xl

"

>


{/* HEADER */}



<div
className="
flex
items-center
gap-4
mb-8
"

>


<div

className="
p-4
rounded-2xl

bg-cyan-500/10

border
border-cyan-400/20

"

>

<Plane

className="
text-cyan-400
w-8
h-8

"

/>

</div>



<div>


<h1
className="
text-4xl
font-bold
"
>

REGISTRASI AKUN SIMHARPES

</h1>


<p
className="
text-gray-400
mt-1
"
>

Terbatas bagi personel Skadron X

</p>


</div>


</div>





<div

className="
grid
md:grid-cols-2

gap-5

"

>



<Input

icon={<User/>}

name="nama"

placeholder="Nama (SKEP)"

onChange={handleChange}

/>


<Input

icon={<Badge/>}

name="nrp"

placeholder="NRP"

onChange={handleChange}

/>



<Input

icon={<Shield/>}

name="pangkat"

placeholder="Pangkat"

onChange={handleChange}

/>



<div className="relative">


<Shield

className="
absolute
left-4
top-4

text-gray-400

"

/>


<select

name="role"

onChange={handleChange}

className="
w-full
bg-[#111827]

border
border-gray-700

rounded-2xl

py-4

pl-12

outline-none

focus:border-cyan-400

"


>


<option>

Pilih Role

</option>


<option>
TEKNISI
</option>


<option>
ADMIN
</option>


<option>
SUPERVISOR
</option>



</select>


</div>





<Input

icon={<User/>}

name="username"

placeholder="Username"

onChange={handleChange}

/>




<PasswordInput

name="password"

placeholder="Password"

show={showPassword}

setShow={setShowPassword}

onChange={handleChange}

/>




<PasswordInput

name="confirm"

placeholder="Ulangi Password"

show={showConfirm}

setShow={setShowConfirm}

onChange={handleChange}

/>


</div>




<button

onClick={handleRegister}

disabled={loading}


className="

mt-8

w-full

py-4

rounded-2xl

bg-cyan-400

text-black

font-bold

flex

justify-center

items-center

gap-3

hover:bg-cyan-300

transition

"

>


<UserPlus/>

{

loading

?

"PROCESSING..."

:

"CREATE ACCOUNT"

}



</button>





<div

className="
mt-6
text-center
text-gray-400
"

>


Sudah punya akun?



<button

onClick={()=>router.push("/")}

className="
ml-2

text-cyan-400

font-bold

inline-flex

items-center

gap-1

"


>


Login

<LogIn
className="w-4"
/>


</button>


</div>



</div>


</div>


)

}





function PasswordInput({

name,

placeholder,

show,

setShow,

onChange

}:any){


return (

<div

className="
relative
"

>


<Lock

className="
absolute

left-4

top-4

text-gray-400

w-5

"

/>


<input


name={name}

type={
show
?
"text"
:
"password"
}


placeholder={placeholder}


onChange={onChange}


className="

w-full

bg-[#111827]

border

border-gray-700

rounded-2xl

py-4

pl-12

pr-12

outline-none

focus:border-cyan-400

"





/>



<button

type="button"

onClick={()=>setShow(!show)}

className="
absolute

right-4

top-4

text-gray-400

"

>


{
show
?

<EyeOff/>

:

<Eye/>

}


</button>



</div>

)


}




function Input({

icon,

name,

placeholder,

onChange

}:any){


return (


<div
className="
relative
"
>


<div

className="
absolute

left-4

top-4

text-gray-400

"

>

{icon}

</div>


<input

name={name}

placeholder={placeholder}

onChange={onChange}


className="

w-full

bg-[#111827]

border

border-gray-700

rounded-2xl

py-4

pl-12

outline-none

focus:border-cyan-400

"




/>


</div>


)

}