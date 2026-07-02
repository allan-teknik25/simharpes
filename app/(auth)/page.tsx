"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
 loginUser
} from "@/services/googleSheet";

import {
  useEffect,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  Lock,
  Shield,
  User,
  Radar,
  Plane,
} from "lucide-react";

export default function LoginPage() {

  const router = useRouter();

  const [mounted, setMounted] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  // =========================
  // HYDRATION SAFE
  // =========================

  useEffect(() => {

    setMounted(true);

    const auth =
      localStorage.getItem(
        "simharpes_auth"
      );

    if (auth === "true") {

      router.push("/dashboard");

    }

  }, [router]);

// =========================
// LOGIN
// =========================


const handleLogin = async(
e:any
)=>{


e.preventDefault();


if(
!username ||
!password
){

alert(
"Username dan password wajib diisi"
);

return;

}


try{


setLoading(true);



const result =
await loginUser({

username,

password

});



if(result.success){



localStorage.setItem(

"simharpes_auth",

"true"

);



localStorage.setItem(

"simharpes_user",

JSON.stringify(
result.user
)

);



router.push(
"/dashboard"
);



}
else{


alert(

result.message ||

"Username atau password salah"

);


}



}
catch(error){


console.error(error);


alert(
"Server login tidak tersedia"
);


}

finally{


setLoading(false);


}


};


  // =========================
  // PREVENT HYDRATION ERROR
  // =========================

  if (!mounted) return null;

  return (

    <main
      className="
        min-h-screen
        bg-[#081120]
        text-white
        overflow-y-auto
        overflow-x-hidden
        relative
      "
    >

      {/* =========================
          BACKGROUND EFFECT
      ========================= */}

      <div className="absolute inset-0 overflow-hidden">

        <div
          className="
            absolute
            w-[600px]
            h-[600px]
            bg-cyan-500/10
            blur-3xl
            rounded-full
            -top-40
            -left-40
            animate-pulse
          "
        />

        <div
          className="
            absolute
            w-[500px]
            h-[500px]
            bg-blue-500/10
            blur-3xl
            rounded-full
            bottom-0
            right-0
            animate-pulse
          "
        />

        {/* GRID */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.04]
            bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)]
            bg-[size:60px_60px]
          "
        />

      </div>

      {/* =========================
          CONTENT
      ========================= */}

      <div
        className="
          relative
          z-10
          min-h-screen
          flex
          items-center
          justify-center
          px-6
          py-10
        "
      >

        <div
          className="
            w-full
            max-w-7xl
            grid
            lg:grid-cols-2
            gap-10
            items-center
          "
        >

          {/* ======================================================
              LEFT SIDE
          ====================================================== */}

          <div
            className="
              hidden
              lg:flex
              flex-col
              justify-center
              pr-10
              animate-[fadeIn_1s_ease]
            "
          >

            {/* TOP BADGE */}

            <div
              className="
                inline-flex
                items-center
                gap-3
                w-fit
                px-4
                py-2
                rounded-full
                border
                border-cyan-500/20
                bg-cyan-500/5
                text-cyan-300
                text-sm
                mb-8
              "
            >

              <Shield size={16} />

              Integrated Tactical Readiness Monitoring

            </div>

            {/* TITLE */}

            <h1
              className="
                text-6xl
                font-black
                leading-tight
                tracking-tight
              "
            >

              SIMHARPES

            </h1>

            <p
              className="
                text-cyan-400
                text-xl
                mt-2
                font-medium
              "
            >

              Sistem Informasi Monitoring Pemeliharaan
              Pesawat

            </p>

            {/* DESC */}

            <p
              className="
                text-gray-400
                mt-8
                leading-relaxed
                text-lg
                max-w-xl
                text-justify
              "
            >

             SIMHARPES merupakan sistem monitoring kesiapan dan pemeliharaan pesawat berbasis web yang terintegrasi secara realtime untuk mendukung pengawasan fleet readiness, status operasional, aktivitas pemeliharaan, serta monitoring jam terbang pesawat secara efektif dan terpusat.

            </p>

            {/* FEATURES */}

            <div className="grid grid-cols-2 gap-5 mt-10">

              <FeatureCard
                icon={<Radar size={24} />}
                title="Fleet Readiness"
                desc="Realtime operational monitoring"
              />

              <FeatureCard
                icon={<Plane size={24} />}
                title="Maintenance AI"
                desc="Predictive aircraft maintenance"
              />

            </div>

            {/* STATUS */}

            <div
              className="
                mt-12
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  w-3
                  h-3
                  rounded-full
                  bg-green-400
                  animate-pulse
                "
              />

              <p className="text-green-400">

                ONLINE

              </p>

            </div>

          </div>

          {/* ======================================================
              RIGHT SIDE
          ====================================================== */}

          <div
            className="
              flex
              items-center
              justify-center
            "
          >

            <div
              className="
                w-full
                max-w-md
                backdrop-blur-2xl
                bg-white/[0.04]
                border
                border-white/10
                rounded-[32px]
                shadow-2xl
                p-8
                relative
                overflow-hidden
                transition-all
                duration-500
                hover:border-cyan-400/30
              "
            >

              {/* Glow */}

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-br
                  from-cyan-500/5
                  to-transparent
                  pointer-events-none
                "
              />

              {/* LOGO */}

              <div
                className="
                  flex
                  flex-col
                  items-center
                  relative
                  z-10
                "
              >

                <div
                  className="
                    w-28
                    h-28
                    rounded-full
                    flex
                    items-center
                    justify-center
                    bg-cyan-500/5
                    mb-5
                    transition-all
                    duration-500
                    hover:scale-105
                  "
                >

                  <Image
                    src="/skadron.png"
                    alt="SIMHARPES"
                    width={95}
                    height={95}
                    priority
                    className="object-contain"
                  />

                </div>

                <h2
                  className="
                    text-4xl
                    font-black
                    tracking-[0.15rem]
                    text-cyan-400
                  "
                >

                  SIMHARPES

                </h2>

                <p
                  className="
                    text-gray-400
                    text-xs
                    text-center
                    mt-3
                    leading-relaxed
                  "
                >

                  Sistem Informasi Monitoring
                  Pesawat Terbang

                </p>

              </div>

              {/* FORM */}

              <form
                onSubmit={handleLogin}
                className="
                  mt-10
                  space-y-5
                  relative
                  z-10
                "
              >

                {/* USERNAME */}

                <InputBox
                  icon={<User size={20} />}
                  placeholder="Username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  type="text"
                />

                {/* PASSWORD */}

                <div className="relative">

                  <InputBox
                    icon={<Lock size={20} />}
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                      hover:text-cyan-400
                      transition
                    "
                  >

                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}

                  </button>

                </div>

                {/* REMEMBER */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    text-sm
                  "
                >

                  <label
                    className="
                      flex
                      items-center
                      gap-2
                      text-gray-400
                    "
                  >

                    <input
                      type="checkbox"
                      className="accent-cyan-500"
                    />

                    Remember me

                  </label>

                  <button
                    type="button"
                    className="
                      text-cyan-400
                      hover:text-cyan-300
                    "
                  >

                    Forgot Password?

                  </button>

                </div>

                {/* BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full
                    py-4
                    rounded-2xl
                    bg-cyan-500
                    hover:bg-cyan-400
                    text-white
                    font-black
                    tracking-wide
                    transition-all
                    duration-500
                    shadow-lg
                    shadow-cyan-500/20
                    hover:shadow-cyan-500/40
                    hover:scale-[1.02]
                    disabled:opacity-50
                  "
                >

                  {loading
                    ? "AUTHENTICATING..."
                    : "LOGIN SYSTEM"}

                </button>

              </form>

              {/* FOOTER */}

              <div
                className="
                  mt-8
                  text-center
                  text-sm
                  text-gray-400
                  relative
                  z-10
                "
              >

                Belum punya akun?

                <Link
                  href="/register"
                  className="
                    ml-2
                    text-cyan-400
                    hover:text-cyan-300
                    font-semibold
                  "
                >

                  Register Here

                </Link>

              </div>

              {/* VERSION */}

              <div
                className="
                  mt-8
                  text-center
                  text-xs
                  text-gray-600
                  relative
                  z-10
                "
              >

                SIMHARPES v1.0

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>

  );

}

/* =========================================================
   INPUT
========================================================= */

function InputBox({
  icon,
  placeholder,
  value,
  onChange,
  type,
}: any) {

  return (

    <div className="relative">

      <div
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-cyan-400
        "
      >

        {icon}

      </div>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full
          bg-[#0b1729]
          border
          border-cyan-500/10
          rounded-2xl
          py-4
          pl-12
          pr-4
          outline-none
          transition-all
          duration-500
          focus:border-cyan-400
          focus:shadow-lg
          focus:shadow-cyan-500/10
          hover:border-cyan-500/20
        "
      />

    </div>

  );

}

/* =========================================================
   FEATURE
========================================================= */

function FeatureCard({
  icon,
  title,
  desc,
}: any) {

  return (

    <div
      className="
        bg-white/[0.03]
        border
        border-white/10
        rounded-3xl
        p-5
        hover:border-cyan-400/20
        hover:bg-cyan-500/[0.03]
        transition-all
        duration-500
        hover:-translate-y-1
      "
    >

      <div className="text-cyan-400 mb-4">

        {icon}

      </div>

      <h3 className="font-bold text-lg">

        {title}

      </h3>

      <p className="text-gray-400 text-sm mt-2">

        {desc}

      </p>

    </div>

  );

}