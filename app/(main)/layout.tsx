"use client";

import "@/app/globals.css";

import Link from "next/link";
import Image from "next/image";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useState,
  useEffect,
} from "react";

import {
  LayoutDashboard,
  Plane,
  BookOpen,
  Radar,
  CalendarRange,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Bell,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname =
    usePathname();

  const router =
    useRouter();

  // =====================================================
  // STATES
  // =====================================================

const [collapsed,setCollapsed] =
useState(false);

const [mounted,setMounted] =
useState(false);

const [profileOpen,setProfileOpen] =
useState(false);

const [user,setUser] =
useState<any>(null);

  // =====================================================
  // FIX HYDRATION
  // =====================================================

useEffect(() => {

setMounted(true);


const savedUser = localStorage.getItem("simharpes_user");

if (savedUser && savedUser !== "undefined") {
  try {
    console.log("savedUser =", savedUser);
    setUser(JSON.parse(savedUser));
  } catch (err) {
    console.error("Invalid user data:", err);
    localStorage.removeItem("simharpes_user");
  }
}


}, []);

  // =====================================================
  // LOGOUT
  // =====================================================

const handleLogout = () => {


localStorage.removeItem(
"simharpes_auth"
);


localStorage.removeItem(
"simharpes_user"
);


router.push("/");


};

  // =====================================================
  // MENUS
  // =====================================================

  const menus = [

    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },

    {
      label: "Operations",
      href: "/operations",
      icon: Radar,
    },

    {
      label: "Aircraft",
      href: "/aircraft",
      icon: Plane,
    },


    {
      label: "Logbook",
      href: "/logbook",
      icon: BookOpen,
    },

    {
      label: "Staggering",
      href: "/staggering",
      icon: CalendarRange,
    },

    {
      label: "Messages",
      href: "/messages",
      icon: MessageSquare,
    },

  ];

  // =====================================================
  // PAGE HEADER CONFIG
  // =====================================================

  const pageHeaders:any = {

    "/dashboard": {
      title:"FLEET READINESS CENTER",
      subtitle:"Monitoring Kesiapan dan Kondisi Operasional Fleet"
    },

    "/operations": {
      title:"FLEET OPERATIONS",
      subtitle:"Approval dan Koordinasi Operasional"
    },

    "/aircraft": {
      title:"AIRCRAFT READINESS",
      subtitle:"Monitoring Status dan Kesiapan Pesawat"
    },

    "/logbook": {
      title:"LOGBOOK DATA",
      subtitle:"Pemantauan Aktivitas Pemeliharaan Pesawat Terintegrasi"
    },

    "/staggering": {
      title:"STAGGERING PEMELIHARAAN",
      subtitle:"Perencanaan Jadwal Pemeliharaan Pesawat"
    },

    "/messages": {
      title:"INFORMATION CENTER",
      subtitle:"Sistem Komunikasi dan Informasi Terpusat"
    },


  };


  const currentHeader =
  pageHeaders[pathname] || {

  title:"TACTICAL FLEET COMMAND",

  subtitle:"Real-Time Aircraft Monitoring System"

  };

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="
      h-screen
      overflow-hidden
      bg-[#081120]
      text-white
      flex
    ">

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <aside className={`
        relative
        transition-all
        duration-500
        ease-in-out
        border-r
      border-white/10
        bg-[#0B1727]
        flex
        flex-col
        overflow-hidden

        ${
          collapsed
            ? "w-[100px]"
            : "w-[280px]"
        }
      `}>

        {/* GLOW */}

        <div className="
          absolute
          top-[-120px]
          left-[-120px]
          w-[260px]
          h-[260px]
          rounded-full
          bg-cyan-500/10
          blur-3xl
        " />

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="
          relative
          z-10
          px-6
          py-5
          border-b
          border-white/5
        ">

          <div className={`
            flex
            items-center

            ${
              collapsed
                ? "justify-center"
                : "justify-between"
            }
          `}>

            {/* LOGO */}

            <div className={`
              flex
              items-center
              gap-3
              overflow-hidden
            `}>

<div className="
w-12
h-12
shrink-0

rounded-xl

bg-cyan-500/5

border
border-cyan-400/20

flex
items-center
justify-center

shadow-lg
">

                <Image
                  src="/skadron.png"
                  alt="Skadron"
                  width={50}
                  height={50}
                  className="
                    object-contain
                    drop-shadow-lg
                  "
                />

              </div>

              {!collapsed && (

                <div className="
                  min-w-0
                ">

                  <h1 className="
                    text-[19px]
                    font-black
                    tracking-[0.08em]
                    text-cyan-400
                    whitespace-nowrap
                  ">

                    SIMHARPES

                  </h1>

                  <p className="
                    text-[12px]
                    text-gray-400
                    mt-0.3
                  ">

                    Tactical Fleet System

                  </p>

                </div>

              )}

            </div>

            {/* COLLAPSE */}

            {!collapsed && (

              <button
                onClick={() =>
                  setCollapsed(true)
                }
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-[#111827]
                  border
                  border-gray-800
                  flex
                  items-center
                  justify-center
                  hover:border-cyan-400
                  hover:text-cyan-400
                  transition-all
                "
              >

                <ChevronLeft
                  size={18}
                />

              </button>

            )}

          </div>

          {/* EXPAND */}

          {collapsed && (

            <div className="
              flex
              justify-center
              mt-5
            ">

              <button
                onClick={() =>
                  setCollapsed(false)
                }
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-[#111827]
                  border
                  border-gray-800
                  flex
                  items-center
                  justify-center
                  hover:border-cyan-400
                  hover:text-cyan-400
                  transition-all
                "
              >

                <ChevronRight
                  size={18}
                />

              </button>

            </div>

          )}

        </div>

        {/* ================================================= */}
        {/* MENU */}
        {/* ================================================= */}

        <div className="
          flex-1
          overflow-y-auto
          modern-scroll
          px-4
          py-6
          relative
          z-10
        ">

          {!collapsed && (

            <div className="
              text-xs
              text-gray-500
              uppercase
              tracking-[0.2em]
              mb-4
              px-3
            ">

              MAIN MENU

            </div>

          )}

          <div className="
            space-y-2
          ">

            {menus.map(
              (item, index) => {

                const Icon =
                  item.icon;

                const active =
                  pathname ===
                  item.href;

                return (

                  <Link
                    key={index}
                    href={item.href}
                    className={`
                      group
                      relative
                      flex
                      items-center
                      rounded-2xl
                      transition-all
                      duration-300

                      ${
                        collapsed
                          ? `
                            justify-center
                            py-4
                          `
                          : `
                            justify-between
                            px-4
                            py-4
                          `
                      }

                      ${
                        active
                          ? `
                            bg-cyan-500/15
                            border
                            border-cyan-400/30
                            text-cyan-400
                          `
                          : `
                            text-gray-400
                            hover:bg-[#111827]
                            hover:text-white
                          `
                      }
                    `}
                  >

                    {active && (

                      <div className="
                        absolute
                        left-0
                        top-3
                        bottom-3
                        w-1
                        rounded-full
                        bg-cyan-400
                      " />

                    )}

                    <div className={`
                      flex
                      items-center

                      ${
                        collapsed
                          ? ""
                          : "gap-4"
                      }
                    `}>

                      <div className={`
                        rounded-xl
                        transition-all

                        ${
                          collapsed
                            ? ""
                            : "p-2"
                        }

                        ${
                          active
                            ? `
                              bg-cyan-500/20
                            `
                            : `
                              bg-[#111827]
                            `
                        }
                      `}>

                        <Icon className="
                          w-5
                          h-5
                        " />

                      </div>

                      {!collapsed && (

                        <span className="
                          font-medium
                        ">

                          {item.label}

                        </span>

                      )}

                    </div>

                    {!collapsed && (

                      <ChevronRight
                        className="
                          w-4
                          h-4
                          opacity-40
                        "
                      />

                    )}

                  </Link>

                );

              }
            )}

          </div>

        </div>

      </aside>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

<main className="
flex-1
overflow-y-auto
modern-scroll
relative

bg-[#081120]
">

        {/* ================================================= */}
        {/* TOPBAR */}
        {/* ================================================= */}

<div className="
sticky
top-0
z-30
backdrop-blur-2xl
bg-[#081120]/70

border-b
border-white/15

px-8
py-5

flex
justify-between
items-center
">

          {/* LEFT */}

          <div>

<h1 className="
text-2xl
font-black
tracking-wide
">

{currentHeader.title}

</h1>


<p className="
text-gray-400
text-sm
mt-1
">

{currentHeader.subtitle}

</p>

          </div>

          {/* RIGHT */}

          <div className="
            flex
            items-center
            gap-5
          ">

            {/* PROFILE */}

            <div className="
              relative
            ">

              <button
                onClick={() =>
                  setProfileOpen(
                    !profileOpen
                  )
                }
                className="
                  flex
                  items-center
                  gap-3
                  bg-[#111827]
                  border
                  border-gray-800
                  px-4
                  py-2
                  rounded-2xl
                  hover:border-cyan-400
                  transition-all
                "
              >
<div
className="
w-10
h-10
rounded-xl

bg-cyan-500/20

flex
items-center
justify-center

text-cyan-400

font-bold
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

<div className="
text-left
min-w-0
max-w-[160px]
">


<div className="
text-sm
font-semibold
truncate
">

{
user?.nama || "Unknown User"
}

</div>



<div className="
text-xs
text-cyan-400
truncate
">

{
user?.role
}

</div>


</div>

              </button>

              {/* DROPDOWN */}

              {profileOpen && (

                <div className="
                  absolute
                  right-0
                  mt-3
                  w-70
                  bg-[#111827]
                  border
                  border-gray-800
                  rounded-2xl
                  shadow-2xl
                  overflow-hidden
                  z-50
                ">

<div
>

</div>

                  <Link
                    href="/profile"
                    className="
                      flex
                      items-center
                      gap-3
                      px-5
                      py-4
                      hover:bg-[#1F2937]
                      transition-all
                    "
                  >

                    <User className="
                      w-4
                      h-4
                    " />

                    Profile

                  </Link>

                  <Link
                    href="/settings"
                    className="
                      flex
                      items-center
                      gap-3
                      px-5
                      py-4
                      hover:bg-[#1F2937]
                      transition-all
                    "
                  >

                    <Settings className="
                      w-4
                      h-4
                    " />

                    Settings

                  </Link>

<button

onClick={handleLogout}

className="
w-full
flex
items-center
gap-3

text-red-400

px-5
py-4

hover:bg-red-500/10

transition-all

"
>

                    <LogOut className="
                      w-4
                      h-4
                    " />

                    Logout

                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* PAGE */}
        {/* ================================================= */}

        <div className="
          p-8
        ">

          {children}

        </div>

      </main>

    </div>

  );

}