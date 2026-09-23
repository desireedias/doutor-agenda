"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import UpsertDoctorForm from "./upsert-doctor-form";

const AddDoctorButton = () => {
  return (
    <Dialog>
      <DialogTrigger render={<Button size="lg" />}>
        <Plus />
        Adicionar médicos
      </DialogTrigger>
      <UpsertDoctorForm />
    </Dialog>
  );
};

export default AddDoctorButton;
