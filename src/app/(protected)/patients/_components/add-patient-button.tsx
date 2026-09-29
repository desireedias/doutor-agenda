"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import UpsertPatientForm from "./upsert-patient-form";

const AddPatientButton = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  return (
    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
      <DialogTrigger render={<Button size="lg" />}>
        <Plus />
        Adicionar paciente
      </DialogTrigger>
      <UpsertPatientForm
        onSuccess={() => setDialogIsOpen(false)}
        isOpen={dialogIsOpen}
      />
    </Dialog>
  );
};

export default AddPatientButton;
