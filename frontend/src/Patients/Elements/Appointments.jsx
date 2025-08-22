import React from 'react'
import { Button, Card, CardContent,CardActions, Typography } from "@mui/material";

const Appointments = () => {
    const appointments=[
        {
            name:"Dr. Sarah Johnson",
            specialization:"cardiology",
            Date:"25/09/25",
            Time:"06:00 PM"

        }
        

    ];
  return (
        <div className="p-6">
      {/* Heading section */}
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold">My Appointments</h1>
        <h2 className="text-2xl text-gray-400 py-1">
          Manage your upcoming and past appointments
        </h2>
      </div>

      {/* Doctors grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((appointments) => (
          <Card  sx={{ maxWidth: 400, mx: "auto" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {appointments.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {appointments.specialization}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {appointments.Date} at {appointments.Time}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                variant="contained"
                sx={{ px: 1.5, py: 1.5, fontSize: "0.9rem" }}
              >
                Reschedule
              </Button>
             <Button
                fullWidth
                variant="contained"
                sx={{ px: 1.5, py: 1.5, fontSize: "0.9rem" }}
              >
                Cancel
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Appointments;