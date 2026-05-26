"use client";

import "./globals.css";

import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Plane,
  BookOpen,
  Radar,
  ShieldCheck,
  ChevronRight,
  Settings,
  LogOut,
  Bell,
  UserCircle2,
  Wrench,
} from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname =
    usePathname();

  return (

    <html lang="en">

      <body className="
        bg-[#081120]
        text-white
        overflow-hidden
      ">

        <div className="
          flex
          h-screen
        ">

          {/* ================================================= */}
          {/* SIDEBAR */}
          {/* ================================================= */}

          <aside className="
            w-[290px]
            bg-[#0D1729]
            border-r border-cyan-500/10
            flex flex-col
            justify-between
            p-4
            relative
            overflow-y-scroll
            custom-scrollbar
          ">

            {/* BACKGROUND GLOW */}

            <div className="
              absolute
              top-[-120px]
              left-[-120px]
              w-[300px]
              h-[300px]
              bg-cyan-500/10
              rounded-full
              blur-3xl
            " />

            {/* ================================================= */}
            {/* TOP CONTENT */}
            {/* ================================================= */}

            <div className="
              relative z-10
            ">

              {/* ================================================= */}
              {/* BRANDING */}
              {/* ================================================= */}

              <div className="mb-6">

                <div className="
                  bg-gradient-to-br
                  from-[#111827]
                  to-[#172033]
                  border border-cyan-500/10
                  rounded-3xl
                  p-4
                  relative
                  overflow-hidden
                ">

                  {/* GLOW */}

                  <div className="
                    absolute
                    top-[-40px]
                    right-[-40px]
                    w-[140px]
                    h-[140px]
                    bg-cyan-500/10
                    rounded-full
                    blur-3xl
                  " />

                  {/* CONTENT */}

                  <div className="
                    relative z-10
                    flex items-center
                    gap-4
                  ">

                    {/* LOGO */}

                    <div className="
                      relative
                      w-20
                      h-20
                      overflow-hidden
                      shrink-0
                    ">

                      <Image
                        src="/assets/skadron.png"
                        alt="Skadron Logo"
                        fill
                        className="
                          object-contain
                        "
                      />

                    </div>

                    {/* TITLE */}

                    <div className="flex-1 min-w-0">

                      <h1 className="
                        text-2xl
                        font-black
                        tracking-normal
                        text-cyan-400
                        leading-none
                        truncate
                      ">

                        SIMHARPES

                      </h1>

                      <div className="
                        w-14
                        h-[3px]
                        bg-cyan-400
                        rounded-full
                        mt-3
                        mb-3
                      " />

                      <p className="
                        text-[11px]
                        text-gray-400
                        leading-relaxed
                      ">

                        Aircraft Readiness Tactical
                        Maintenance Command System

                      </p>

                    </div>

                  </div>

                  {/* SYSTEM STATUS */}

                  <div className="
                    mt-5
                    flex items-center
                    justify-between
                    bg-[#081120]
                    border border-green-500/20
                    rounded-2xl
                    px-4 py-3
                  ">

                    <div className="
                      flex items-center
                      gap-3
                    ">

                      <div className="
                        w-3
                        h-3
                        rounded-full
                        bg-green-400
                        animate-pulse
                      " />

                      <div>

                        <div className="
                          text-green-400
                          font-semibold
                          text-sm
                        ">

                          SYSTEM ONLINE

                        </div>

                        <div className="
                          text-gray-500
                          text-xs
                        ">

                          Fleet Monitoring Active

                        </div>

                      </div>

                    </div>

                    <ShieldCheck className="
                      text-green-400
                      w-5
                      h-5
                    " />

                  </div>

                </div>

              </div>

              {/* ================================================= */}
              {/* MAIN NAVIGATION */}
              {/* ================================================= */}

              <div className="
                text-xs
                uppercase
                tracking-[0.25em]
                text-gray-500
                mb-4
              ">

                Main Navigation

              </div>

              <nav className="
                space-y-2
              ">

                <Nav
                  href="/dashboard"
                  label="Dashboard"
                  icon={<LayoutDashboard size={20} />}
                  pathname={pathname}
                />

                <Nav
                  href="/aircraft"
                  label="Aircraft"
                  icon={<Plane size={20} />}
                  pathname={pathname}
                />

                <Nav
                  href="/logbook"
                  label="Logbook"
                  icon={<BookOpen size={20} />}
                  pathname={pathname}
                />

                <Nav
                  href="/operations"
                  label="Operations"
                  icon={<Radar size={20} />}
                  pathname={pathname}
                />

                <Nav
                  href="/staggering"
                  label="Staggering"
                  icon={<Wrench size={20} />}
                  pathname={pathname}
                />

              </nav>

              {/* ================================================= */}
              {/* SYSTEM */}
              {/* ================================================= */}

              <div className="
                mt-8
              ">

                <div className="
                  text-xs
                  uppercase
                  tracking-[0.25em]
                  text-gray-500
                  mb-4
                ">

                  System

                </div>

                <nav className="
                  space-y-2
                ">

                  <Nav
                    href="/profile"
                    label="Profile"
                    icon={<UserCircle2 size={20} />}
                    pathname={pathname}
                  />

                  <Nav
                    href="/messages"
                    label="Messages"
                    icon={<Bell size={20} />}
                    pathname={pathname}
                  />

                  <Nav
                    href="/settings"
                    label="Settings"
                    icon={<Settings size={20} />}
                    pathname={pathname}
                  />

                </nav>

              </div>

            </div>

            {/* ================================================= */}
            {/* USER PROFILE */}
            {/* ================================================= */}

            <div className="
              relative z-10
              mt-6
            ">

              <div className="
                bg-[#081120]
                border border-cyan-500/10
                rounded-3xl
                p-4
              ">

                <div className="
                  flex items-center
                  justify-between
                ">

                  {/* LEFT */}

                  <div className="
                    flex items-center
                    gap-3
                  ">

                    <div className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-cyan-500/10
                      border border-cyan-500/20
                      flex items-center
                      justify-center
                    ">

                      <UserCircle2 className="
                        text-cyan-400
                        w-7
                        h-7
                      " />

                    </div>

                    <div>

                      <div className="
                        font-semibold
                        text-sm
                      ">

                        Tactical Officer

                      </div>

                      <div className="
                        text-xs
                        text-gray-500
                      ">

                        Engineering Command

                      </div>

                    </div>

                  </div>

                  {/* LOGOUT */}

                  <button className="
                    w-11
                    h-11
                    rounded-2xl
                    bg-red-500/10
                    border border-red-500/20
                    flex items-center
                    justify-center
                    hover:bg-red-500/20
                    transition-all
                  ">

                    <LogOut className="
                      text-red-400
                      w-4
                      h-4
                    " />

                  </button>

                </div>

              </div>

            </div>

          </aside>

          {/* ================================================= */}
          {/* MAIN CONTENT */}
          {/* ================================================= */}

          <main className="
            flex-1
            overflow-y-auto
            custom-scrollbar
            bg-[#081120]
          ">

            {/* ================================================= */}
            {/* TOPBAR */}
            {/* ================================================= */}

            <div className="
              sticky
              top-0
              z-50
              bg-[#081120]/80
              backdrop-blur-2xl
              border-b border-cyan-500/10
              px-8
              py-5
              flex items-center
              justify-between
            ">

              {/* LEFT */}

              <div>

                <h1 className="
                  text-2xl
                  font-bold
                ">

                  Tactical Fleet Command

                </h1>

                <p className="
                  text-gray-500
                  text-sm
                  mt-1
                ">

                  Real-Time Aircraft Readiness Monitoring

                </p>

              </div>

              {/* RIGHT */}

              <div className="
                flex items-center
                gap-4
              ">

                {/* NOTIFICATION */}

                <button className="
                  relative
                  w-12
                  h-12
                  rounded-2xl
                  bg-[#111827]
                  border border-cyan-500/10
                  flex items-center
                  justify-center
                  hover:border-cyan-400
                  transition-all
                ">

                  <Bell className="
                    text-cyan-400
                    w-5
                    h-5
                  " />

                  <div className="
                    absolute
                    top-3
                    right-3
                    w-2
                    h-2
                    rounded-full
                    bg-red-400
                  " />

                </button>

                {/* PROFILE */}

                <div className="
                  flex items-center
                  gap-3
                  bg-[#111827]
                  border border-cyan-500/10
                  rounded-2xl
                  px-4
                  py-2
                ">

                  <div className="
                    w-10
                    h-10
                    rounded-xl
                    bg-cyan-500/10
                    border border-cyan-500/20
                    flex items-center
                    justify-center
                  ">

                    <UserCircle2 className="
                      text-cyan-400
                      w-6
                      h-6
                    " />

                  </div>

                  <div>

                    <div className="
                      font-semibold
                      text-sm
                    ">

                      Tactical Officer

                    </div>

                    <div className="
                      text-xs
                      text-gray-500
                    ">

                      Operational Control

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* ================================================= */}
            {/* PAGE CONTENT */}
            {/* ================================================= */}

            <div className="
              p-8
            ">

              {children}

            </div>

          </main>

        </div>

      </body>

    </html>

  );

}

/* ================================================= */
/* NAVIGATION ITEM */
/* ================================================= */

function Nav({

  href,
  label,
  icon,
  pathname,

}: any) {

  const active =
    pathname === href;

  return (

    <Link
      href={href}
      className={`
        group
        flex items-center
        justify-between
        px-4 py-3
        rounded-2xl
        border
        transition-all
        duration-300

        ${
          active

            ? `
              bg-cyan-500/10
              border-cyan-500/30
              text-cyan-400
              shadow-lg shadow-cyan-500/10
            `

            : `
              border-transparent
              text-gray-300
              hover:bg-[#162235]
              hover:border-cyan-500/10
              hover:text-white
            `
        }
      `}
    >

      <div className="
        flex items-center
        gap-4
      ">

        <div className={`
          transition-all

          ${
            active
              ? "text-cyan-400"
              : "text-gray-400 group-hover:text-white"
          }
        `}>

          {icon}

        </div>

        <span className="
          font-medium
        ">

          {label}

        </span>

      </div>

      <ChevronRight className={`
        w-4
        h-4
        transition-all

        ${
          active
            ? "text-cyan-400"
            : "text-gray-600 group-hover:text-white"
        }
      `} />

    </Link>

  );

}