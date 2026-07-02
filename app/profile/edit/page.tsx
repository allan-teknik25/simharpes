"use client";


import {
useEffect,
useState
} from "react";


import Link from "next/link";


import {

ArrowLeft,
Save,
User,
Badge,
Shield,
Lock,
Eye,
EyeOff,
KeyRound

} from "lucide-react";



import {
updateUser
} from "@/services/googleSheet";





export default function EditProfile(){



const [user,setUser]=
useState<any>({});


const [password,setPassword]=
useState({

old:"",
new:"",
confirm:""

});


const [show,setShow]=
useState(false);




useEffect(()=>{


const data =
localStorage.getItem(
"simharpes_user"
);


if(data){

setUser(
JSON.parse(data)
);

}


},[]);







function handleChange(e:any){


setUser({

...user,

[e.target.name]:
e.target.value

});


}







function handlePassword(e:any){


setPassword({

...password,

[e.target.name]:
e.target.value

});


}









async function save(){



if(
password.new &&
password.new !== password.confirm
){

alert(
"Konfirmasi password tidak sama"
);

return;

}




const result =
await updateUser({

...user,


password:
password.new || undefined


});




if(result.success){



localStorage.setItem(

"simharpes_user",

JSON.stringify(user)

);



alert(
"Profile berhasil diperbarui"
);



window.location.href="/profile";


}


}







return (


<div

className="
max-w-5xl

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

href="/profile"

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


<ArrowLeft/>

</Link>




<div>


<h1

className="
text-3xl

font-black

"

>

Edit Profil

</h1>

</div>

</div>

</div>


{/* INFORMATION CARD */}



<div

className="
relative

overflow-hidden


bg-[#0B1727]


border

border-white/10


rounded-[20px]


p-8


space-y-4

"

>



<div

className="
absolute

w-80

h-80


bg-cyan-500/10


blur-3xl


rounded-full


top-[-100px]


right-[-100px]

"

/>





<h2

className="
relative

font-bold

text-xl

flex

gap-3

items-center

"

>


<User

className="
text-cyan-400

"

/>


Informasi Akun


</h2>







<div

className="
grid

md:grid-cols-2

gap-6

relative

"

>


<Input

icon={<User/>}

label="Nama"

name="nama"

value={user.nama}

onChange={handleChange}

/>




<Input

icon={<Badge/>}

label="NRP"

name="nrp"

value={user.nrp}

onChange={handleChange}

/>





<Input

icon={<Shield/>}

label="Pangkat"

name="pangkat"

value={user.pangkat}

onChange={handleChange}

/>






<Input

icon={<KeyRound/>}

label="Role"

name="role"

value={user.role}

disabled

/>





</div>




</div>









{/* SECURITY */}



<div

className="
bg-[#111827]

border

border-white/10


rounded-[20px]


p-10


space-y-8

"

>



<h2

className="
font-bold

text-xl

flex

items-center

gap-3

"

>


<Lock

className="
text-cyan-400

"

/>


Pengaturan Keamanan


</h2>





<PasswordInput

label="Password Lama"

name="old"

value={password.old}

onChange={handlePassword}

show={show}

/>



<PasswordInput

label="Password Baru"

name="new"

value={password.new}

onChange={handlePassword}

show={show}

/>



<PasswordInput

label="Konfirmasi Password"

name="confirm"

value={password.confirm}

onChange={handlePassword}

show={show}

/>




<button

type="button"

onClick={()=>setShow(!show)}

className="
text-sm

text-cyan-400

flex

items-center

gap-2

"

>


{

show

?

<EyeOff size={16}/>

:

<Eye size={16}/>

}


{

show

?

"Sembunyikan Password"

:

"Tampilkan Password"

}



</button>



</div>










<button


onClick={save}


className="

w-full


py-4


rounded-2xl


bg-cyan-500


text-black


font-black


flex


justify-center


gap-3


hover:bg-cyan-400


transition


"

>


<Save size={25}/>


SIMPAN PERUBAHAN


</button>






</div>



)

}









function Input({

icon,

label,

name,

value,

onChange,

disabled

}:any){



return (


<div>


<label

className="
text-sm

text-gray-400

"

>

{label}

</label>




<div

className="
relative

mt-2

"

>


<div

className="
absolute

left-4

top-4

text-cyan-400

"

>

{icon}

</div>




<input


disabled={disabled}


name={name}


value={value || ""}


onChange={onChange}


className="

w-full


bg-[#081120]


border

border-white/10


rounded-2xl


py-4


pl-12


outline-none


focus:border-cyan-400


disabled:opacity-50

"

/>


</div>


</div>


)

}









function PasswordInput({

label,

name,

value,

onChange,

show

}:any){


return (


<div>


<label

className="
text-sm

text-gray-400

"

>

{label}

</label>




<input


type={show ? "text":"password"}


name={name}


value={value}


onChange={onChange}


className="

mt-2


w-full


bg-[#081120]


border

border-white/10


rounded-2xl


py-4


px-5


outline-none


focus:border-cyan-400

"

/>


</div>



)

}