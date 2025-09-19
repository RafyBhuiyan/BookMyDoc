"use client";

import React from "react";

/**
 * IMPORTANT: Adjust the import path below to match where shadcn placed the file.
 * After the `npx shadcn add ...` step, search your project for "expandable-card-demo-standard"
 * and update this import accordingly if needed.
 */
import ExpandableCardDemoStandard from "@/components/expandable-card-demo-standard";

export default function DoctorCardStandard({
  doctor,
  onViewProfile,
  onBook,
}) {
  // Map/backfill fields from your API
  const {
    name,
    email,
    phone,
    specialization,
    city,
    address,
    photo_url, // optional backend field if you have it
    bio,       // optional summary
  } = doctor || {};

  const title = name || "Unnamed Doctor";
  const subtitle = specialization || "Specialist";
  const location = city || address || "N/A";
  const description =
    bio ||
    `Consult with ${name || "this doctor"} for ${specialization || "your needs"}. Located in ${location}.`;

  // The Aceternity demo_standard usually accepts content via children/props.
  // We keep the shape minimal and let the inner component render.
  // If your generated component expects a different prop name (e.g. `item` or `data`),
  // simply adjust the object/prop below in both places it’s passed.
  const cardData = {
    title,
    subtitle,
    description,
    // Provide an image or fallback
    image: photo_url || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(title)}`,
    // Any tag/badge you want to highlight
    badge: specialization || "Doctor",
    meta: {
      email,
      phone,
      location,
    },
    // Primary + secondary actions
    ctas: [
      { label: "View Profile", onClick: () => onViewProfile?.(doctor) },
      { label: "Book Appointment", onClick: () => onBook?.(doctor) },
    ],
  };

  return (
    <ExpandableCardDemoStandard
      // Some registries accept a prop like “item”, others spread props.
      // Try #1 first; if it doesn’t compile, switch to #2:
      item={cardData}
      // --- or ---
      // {...cardData}
    />
  );
}
