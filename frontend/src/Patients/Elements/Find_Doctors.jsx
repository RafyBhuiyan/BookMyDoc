import React from 'react'
import Box from "@mui/material/Box";
import { Button, Card, CardContent,CardActions, Typography } from "@mui/material";
import CalendarMonthSharpIcon from '@mui/icons-material/CalendarMonthSharp';

export default function Find_Doctors(){
 const doctors = [
  {
    id: 1,
    name: "Dr. Ayesha Rahman",
    specialization: "Cardiologist",
    experience: "12 years",
    hospital: "Dhaka Medical College Hospital",
    contact: "+8801712345678",
    email: "ayesha.rahman@example.com",
    rating: 4.8,
    available: true,
  },
  {
    id: 2,
    name: "Dr. Tanvir Hossain",
    specialization: "Dermatologist",
    experience: "8 years",
    hospital: "Square Hospital, Dhaka",
    contact: "+8801811223344",
    email: "tanvir.hossain@example.com",
    rating: 4.5,
    available: false,
  },
  {
    id: 3,
    name: "Dr. Nabila Karim",
    specialization: "Pediatrician",
    experience: "10 years",
    hospital: "United Hospital, Gulshan",
    contact: "+8801912345678",
    email: "nabila.karim@example.com",
    rating: 4.9,
    available: true,
  },
  {
    id: 4,
    name: "Dr. Imran Chowdhury",
    specialization: "Orthopedic Surgeon",
    experience: "15 years",
    hospital: "Apollo Hospitals, Dhaka",
    contact: "+8801555667788",
    email: "imran.chowdhury@example.com",
    rating: 4.7,
    available: true,
  },
  {
    id: 5,
    name: "Dr. Farzana Ahmed",
    specialization: "Neurologist",
    experience: "9 years",
    hospital: "Ibn Sina Hospital, Dhanmondi",
    contact: "+8801611223344",
    email: "farzana.ahmed@example.com",
    rating: 4.6,
    available: false,
  },
];

  return (
    <div className="p-6">
      {/* Heading section */}
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold">Find Your Doctors</h1>
        <h2 className="text-2xl text-gray-400 py-1">
          Discover and book appointments with verified healthcare professionals
        </h2>
      </div>

      {/* Doctors grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <Card key={doc.id} sx={{ maxWidth: 400, mx: "auto" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {doc.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {doc.specialization} • {doc.experience}
              </Typography>
              <Typography variant="body2">{doc.hospital}</Typography>
              <Typography variant="body2" color="text.secondary">
                {doc.email} | {doc.contact}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                ⭐ {doc.rating} • {doc.available ? "Available" : "Not Available"}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                variant="contained"
                sx={{ px: 3, py: 1.5, fontSize: "0.9rem" }}
              >
                Book Appointment
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
};

