// PatientDashboard.jsx
"use client";
import React, { useState,useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

import {
  FaUserDoctor,
  FaCalendarPlus,
  FaFileLines,
  FaStethoscope,
  FaArrowLeft,
} from "react-icons/fa6";
import logo_white from "@/assets/logo_white.png";
import iconlogo from "@/assets/iconlogo.png";
const API = import.meta.env.VITE_API_BASE;
export default function PatientDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [profileName, setProfileName] = useState(""); // ← footer label

  useEffect(() => {
    const token = localStorage.getItem("patientToken");
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`${API}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));
        const name = data?.profile?.name;
        if (name && typeof name === "string") setProfileName(name);
      } catch {
        // ignore; keep default "Patient"
      }
    })();
  }, []);
  //console.log(profileName);

  const handleLogout = () => {
    localStorage.removeItem("patientToken");
    navigate("/");
  };


  // NOTE: Logout has onClick -> treated as "action" (never active)
  const links = [
    { label: "Browse Doctors",  href: "/user/doctors",         icon: <FaUserDoctor className="h-5 w-5 shrink-0" /> },
    { label: "Appointments",    href: "/user/appointments",    icon: <FaCalendarPlus className="h-5 w-5 shrink-0" /> },
    { label: "Precription",         href: "/user/prescription",         icon: <FaFileLines className="h-5 w-5 shrink-0" /> },
    { label: "Logout",          href: "/", icon: <FaArrowLeft className="h-5 w-5 shrink-0" />, onClick: handleLogout },
  ];

  return (
    <div className="min-h-dvh w-full bg-neutral-900">
      <div className="flex h-dvh w-full overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          open={open}
          setOpen={setOpen}
          className="h-full bg-black w-[64px] md:w-[280px] lg:w-[300px]"
        >
          <SidebarBody
            className="h-full justify-between gap-10 bg-black"
            mobileLogo={<img src={logo_white} alt="BookMyDoc" className="h-6 w-auto" />}
          >
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              {open ? <Logo /> : <LogoIcon />}

              <div className="mt-6 flex flex-col gap-1">
                {links.map((link, idx) => {
                  const isAction = Boolean(link.onClick);
                  const isActive =
                    !isAction && link.href !== "/" && location.pathname.startsWith(link.href);


                  return (
                    <SidebarLink
                      key={idx}
                      // Prevent navigation for actions; never mark them active
                      link={{
                        ...link,
                        href: isAction ? "#" : link.href,
                        active: isActive,
                      }}
                      className={cn(
                        // entire box hover/active handled in SidebarLink component
                        "text-neutral-200 hover:text-white"
                      )}
                      onClick={(e) => {
                        if (isAction) {
                          e.preventDefault();
                          link.onClick?.();
                        }
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div>
              <SidebarLink
                link={{
                  label: profileName,
                  href: "/user/profile",
                  icon: (
                    <img
                      src="https://37assets.37signals.com/svn/765-default-avatar.png"
                      className="h-7 w-7 shrink-0 rounded-full"
                      alt="Avatar"
                    />
                  ),
                  active: location.pathname.startsWith("/user/profile"),
                }}
                className="text-neutral-200 hover:text-white"
              />
            </div>
          </SidebarBody>
        </Sidebar>

        {/* Main */}
        <main className="flex-1 min-w-0 overflow-auto pt-12 md:pt-0">
          <Outlet />
        </main>
      </div>
    </div>

  );
}

/* Logos */
const Logo = () => (
  <a href="/" className="relative z-20 flex items-center space-x-2 py-1">
    <motion.img
      src={logo_white}
      alt="BookMyDoc"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-10 w-auto"
    />
  </a>
);

const LogoIcon = () => (
  <a href="/" className="relative z-20 flex items-center space-x-2 py-1">
    <img src={iconlogo} alt="BMD" className="h-10" />
  </a>
);
