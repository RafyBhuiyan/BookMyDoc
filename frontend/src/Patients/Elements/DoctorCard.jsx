import { Link } from "react-router-dom";

export function DoctorCard({ doctor }) {
  return (
    <div className="border rounded-2xl p-4 shadow-sm bg-white">
      <h3 className="text-lg font-semibold text-black">{doctor.name || doctor.full_name}</h3>
      <p className="text-sm text-gray-600">{doctor.specialization}</p>

      <Link
        to={`/doctors/${doctor.id}`} // no ?date -> loads ALL upcoming slots
        className="mt-3 inline-block px-3 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700"
      >
        View & Book
      </Link>
    </div>
  );
}
