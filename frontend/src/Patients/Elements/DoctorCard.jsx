import { Link } from "react-router-dom";

export function DoctorCard({ doctor }) {
  return (
    <div
      className="
        p-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg
        transition-transform duration-300 ease-out
        hover:scale-105 hover:shadow-2xl hover:bg-white/20
      "
    >
      <h3
        className="
          text-lg font-bold text-white transition-colors duration-300
          hover:text-indigo-400
        "
      >
        {doctor.name || doctor.full_name}
      </h3>
      <p
        className="
          text-sm text-indigo-300 mt-1 transition-colors duration-300
          hover:text-indigo-400
        "
      >
        {doctor.specialization}
      </p>

      <Link
        to={`/doctors/${doctor.id}`}
        className="
          mt-4 inline-block px-4 py-2 rounded-xl text-white text-sm
          hover:bg-indigo-500  hover:text-black transition-all duration-300
        "
      >
        View & Book
      </Link>
    </div>
  );
}
