"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Bell,
  Send,
  ShieldAlert,
  Radio,
  MessageSquare,
} from "lucide-react";

import {
  getAircraftData,
} from "@/services/googleSheet";

import {
  generateMessages,
} from "@/services/messageEngine";

type MessageType =
  | "critical"
  | "warning"
  | "info"
  | "success";

type MessageCategory =
  | "SYSTEM_ALERT"
  | "MISSION"
  | "MAINTENANCE"
  | "COMMUNICATION";

type Message = {

id:number;

title:string;

desc:string;

time:string;

type:
"critical"
|
"warning"
|
"info"
|
"success";


category:
"SYSTEM_ALERT"
|
"MISSION"
|
"MAINTENANCE"
|
"COMMUNICATION";


aircraft?:string;

detail?:{

current?:number;

due?:number;

task?:string;

action?:string;

};


read:boolean;

action?:
"APPROVAL_REQUIRED"
|
"INFO_ONLY"
|
"ACTION_REQUIRED";

}

export default function MessagesPage() {

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [title, setTitle] =
    useState("");

  const [desc, setDesc] =
    useState("");

  const [selected,setSelected] =
    useState<Message|null>(null);

  // ==========================================
  // LOAD FROM GOOGLE SHEET
  // ==========================================

  useEffect(() => {

    async function load() {

      const fleet =
        await getAircraftData();

      const generated =
        generateMessages(fleet);

      setMessages(generated);

    }

    load();

    

  }, []);

  // ==========================================
  // STYLE ENGINE
  // ==========================================

  const typeStyle = {

    critical:
      "border-red-500/40 text-red-400",

    warning:
      "border-yellow-500/40 text-yellow-300",

    info:
      "border-cyan-500/40 text-cyan-400",

    success:
      "border-green-500/40 text-green-400",

  };

  const categoryBadge = {

    SYSTEM_ALERT:
      "bg-red-500/10 text-red-400",

    MISSION:
      "bg-yellow-500/10 text-yellow-300",

    MAINTENANCE:
      "bg-cyan-500/10 text-cyan-400",

    COMMUNICATION:
      "bg-green-500/10 text-green-400",

  };

  // ==========================================
  // READ MESSAGE
  // ==========================================

  const markAsRead = (
    id: number
  ) => {

    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              read: true,
            }
          : m
      )
    );

  };

  // ==========================================
  // BROADCAST
  // ==========================================

  const sendBroadcast = () => {

    if (
      !title.trim() ||
      !desc.trim()
    )
      return;

    const newMessage: Message = {

      id: Date.now(),

      title,

      desc,

      time: "Just Now",

      type: "info",

      category:
        "COMMUNICATION",

      read: false,

      action:
        "INFO_ONLY",

    };

    setMessages((prev) => [
      newMessage,
      ...prev,
    ]);

    setTitle("");

    setDesc("");

  };

  // ==========================================
  // UI
  // ==========================================

  return (

<div
className="
p-5
"
>
      {/* GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT */}

        <div className="xl:col-span-2 bg-[#111827] border border-gray-800 rounded-3xl p-6">

          <div className="flex justify-between items-center mb-6">

            <div>

              <h2 className="text-3xl font-bold">

                Messages

              </h2>


            </div>

            <Bell className="text-cyan-400" />

          </div>

          <div className="space-y-4">

            {messages.map((msg) => (

              <div
                key={msg.id}
                onClick={()=>{
                  markAsRead(msg.id);
                  setSelected(msg);
                  }}
                className={`
                  cursor-pointer
                  bg-[#1F2937]
                  border
                  rounded-2xl
                  p-5
                  relative
                  transition-all
                  hover:scale-[1.01]
                  hover:border-cyan-400
                  ${typeStyle[msg.type]}
                  ${
                    msg.read
                      ? "opacity-60"
                      : "opacity-100"
                  }
                `}
              >

                {!msg.read && (

                  <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />

                )}

                <div
                  className={`inline-block px-3 py-1 text-xs rounded-lg mb-3 ${categoryBadge[msg.category]}`}
                >

                  {msg.category}

                </div>

                <div className="flex justify-between items-start">

                  <div>

                    <h3 className="text-xl font-bold">

                      {msg.title}

                    </h3>

                    <p className="text-gray-400 mt-2">

                      {msg.desc}

                    </p>

                    <p className="text-xs mt-3 text-gray-500">

                      {msg.action}

                    </p>

                  </div>

                  <div className="text-sm text-gray-500">

                    {msg.time}

                  </div>

                </div>

              </div>

            ))}

            {messages.length === 0 && (

              <div className="text-center text-gray-500 py-10">

                No Messages

              </div>

            )}

          </div>

        </div>

        {/* RIGHT */}

        <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 h-fit">

          <div className="flex items-center gap-3 mb-6">

            <ShieldAlert className="text-yellow-400" />

            <h2 className="text-2xl font-bold">

              Broadcast

            </h2>

          </div>

          <div className="space-y-4">

            <input
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder="Kepada"
              className="w-full bg-[#1F2937] border border-gray-700 rounded-2xl p-4 outline-none focus:border-cyan-400"
            />

            <textarea
              value={desc}
              onChange={(e) =>
                setDesc(
                  e.target.value
                )
              }
              rows={6}
              placeholder="Tuliskan pesan..."
              className="w-full bg-[#1F2937] border border-gray-700 rounded-2xl p-4 outline-none focus:border-cyan-400"
            />

            <button
              onClick={sendBroadcast}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3"
            >

              <Send className="w-5 h-5" />

              Kirim Pesan

            </button>

          </div>

        </div>

      </div>

{
selected && (

<div
className="
fixed
inset-0
bg-black/60
flex
items-center
justify-center
z-50
"
>


<div
className="
bg-[#111827]
border
border-gray-700
rounded-3xl
p-8
w-[450px]
"
>


<h2 className="
text-2xl
font-bold
mb-4
">

Message Detail

</h2>


<div className="space-y-3">


<p>
<b>Title:</b>
{selected.title}
</p>


<p>
<b>Category:</b>
{selected.category}
</p>


<p>
<b>Aircraft:</b>
{selected.aircraft || "-"}
</p>


<p>
<b>Description:</b>
{selected.desc}
</p>


{
selected.detail &&

<div
className="
bg-[#1F2937]
rounded-xl
p-4
"
>

<p>
Current :
{selected.detail.current}
</p>


<p>
Due :
{selected.detail.due}
</p>


<p>
Task :
{selected.detail.task}
</p>


</div>

}


</div>



<button

onClick={()=>setSelected(null)}

className="
mt-6
w-full
bg-cyan-500
text-black
font-bold
rounded-xl
py-3
"

>

CLOSE

</button>


</div>


</div>

)
}

    </div>

  );

}