"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Link } from "react-router-dom";


export default function ExpandableDoctorCard({ doctor, onViewProfile, onBook }) {
  const [active, setActive] = useState(null);
  const ref = useRef(null);
  const id = useId();
  const MotionLink=motion(Link);

  const card = React.useMemo(() => {
    if (!doctor) return null;

    const title = doctor.name || "Unnamed Doctor";
    const description = doctor.specialization || "Specialist";
    const src =
      doctor.photo_url ||
      `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(title)}`;
    const location = doctor.city || doctor.clinic_address || "Location N/A";

    // Content for expanded view
    const content = () => (
      <div className="w-full">
        {/* Quick facts */}
        <div className="grid grid-cols-1 gap-3 text-sm">
          <InfoRow label="Specialization" value={doctor.specialization || "—"} />
          <InfoRow label="City" value={doctor.city || "—"} />
          <InfoRow label="Clinic Address" value={doctor.clinic_address || "—"} />
          <InfoRow label="Email" value={doctor.email || "—"} />
          <InfoRow label="Phone" value={doctor.phone || "—"} />
        </div>

        {/* Optional bio/summary */}
        {doctor.bio && (
          <div className="mt-4">
            <h4 className="font-semibold text-neutral-700 dark:text-neutral-200">About</h4>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">{doctor.bio}</p>
          </div>
        )}

        {/* Optional availabilities */}
        {Array.isArray(doctor.availabilities) && doctor.availabilities.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-neutral-700 dark:text-neutral-200">
              Upcoming Availability
            </h4>
            <ul className="mt-2 space-y-2">
              {doctor.availabilities.slice(0, 8).map((slot, i) => (
                <li
                  key={`${doctor.id || title}-slot-${i}`}
                  className="rounded-lg border border-white/10 bg-white/5 dark:bg-neutral-800/50 px-3 py-2"
                >
                  <div className="text-neutral-800 dark:text-neutral-200 text-sm ">
                    {slot.date}
                    {(slot.from || slot.to) && (
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {" "}
                        — {slot.from || "??"} to {slot.to || "??"}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );

    return {
      title,
      description, // specialization shown as subtitle/description
      src,
      location,
      ctaText: "Book",
      content,
    };
  }, [doctor]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") setActive(null);
    }
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  if (!card) return null;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      {/* Expanded modal */}
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100] py-5">
            <motion.button
              key={`button-${card.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${card.title}-${id}`}
              ref={ref}
              className="w-full max-w-[560px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden group"
            >
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={card.src}
                  alt={card.title}
                  className="w-full h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-center"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div >
                    <motion.h3
                      layoutId={`title-${card.title}-${id}`}
                      className="font-bold text-neutral-800 dark:text-neutral-200"
                    >
                      {card.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${card.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {card.description}
                    </motion.p>
                    {card.location && (
                      <p className="text-xs mt-1 text-neutral-500 dark:text-neutral-400">
                        {card.location}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <MotionLink
                       to={`/doctors/${doctor.id}`}
                      className="px-4 py-3 text-sm rounded-full font-bold  bg-gray-100 dark:bg-neutral-800 dark:text-neutral-100 hover:bg-gray-200"
                    >
                      Book Appointment
                    </MotionLink>
                    <button
                      onClick={() => onViewProfile?.(doctor)}
                      className="px-4 py-3 text-sm rounded-full font-bold bg-gray-100 dark:bg-neutral-800 dark:text-neutral-100 hover:bg-gray-200"
                    >
                      View Profile
                    </button>
                  </div>
                </div>

                <div className="pt-2 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base max-h-64 md:max-h-[50vh] pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof card.content === "function" ? card.content() : card.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

<motion.div
  layoutId={`card-${card.title}-${id}`}
  onClick={() => setActive(true)}
  className="group p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 rounded-xl cursor-pointer"
>
  <div className="flex gap-4 flex-col md:flex-row w-full m-1 ">
    <motion.div layoutId={`image-${card.title}-${id}`}>
      <img
        width={100}
        height={100}
        src={card.src}
        alt={card.title}
        className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-center"
      />
    </motion.div>

    <div className="flex-1">
      <motion.h3
        layoutId={`title-${card.title}-${id}`}
        className="font-bold text-white group-hover:text-black text-center md:text-left"
      >
        {card.title}
      </motion.h3>
      <motion.p
        layoutId={`description-${card.description}-${id}`}
        className="text-neutral text-white group-hover:text-black text-center md:text-left"
      >
        {card.description}
      </motion.p>

      {card.location && (
        <p className="text-xs mt-1 text-neutral text-white group-hover:text-black text-center md:text-left">
          {card.location}
        </p>
      )}
    </div>
  </div>
</motion.div>

    </>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-[120px,1fr] gap-2">
      <span className="text-neutral-500 dark:text-neutral-400">{label}</span>
      <span className="text-neutral-800 dark:text-neutral-200">{value}</span>
    </div>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
