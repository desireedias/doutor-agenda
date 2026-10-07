"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { doctorsTable, patientsTable } from "@/db/schema";

import AddAppointmentForm from "./add-appointment-form";

interface AppointmentButtonProps {
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
}

const AppointmentButton = ({ patients, doctors }: AppointmentButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger render={<Button size="lg" />}>
        <PlusIcon className="h-4 w-4" />
        Adicionar Agendamento
      </DialogTrigger>
      <AddAppointmentForm
        isOpen={isDialogOpen}
        patients={patients}
        doctors={doctors}
        onSuccess={() => setIsDialogOpen(false)}
      />
    </Dialog>
  );
};

export default AppointmentButton;
