"use client";

import { MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deleteAppointment } from "@/actions/delete-appointment";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppointmentsTableActionsProps {
  appointment: {
    id: string;
    patient: {
      name: string;
    };
  };
}

const AppointmentsTableActions = ({
  appointment,
}: AppointmentsTableActionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteAppointmentAction = useAction(deleteAppointment, {
    onSuccess: () => {
      toast.success("Agendamento deletado com sucesso.");
      setIsDeleteDialogOpen(false);
    },

    onError: () => {
      toast.error("Erro ao deletar agendamento.");
    },
  });

  const handleDeleteAppointmentClick = () => {
    if (!appointment) return;

    deleteAppointmentAction.execute({
      id: appointment.id,
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
          <MoreVerticalIcon className="h-4 w-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>{appointment.patient.name}</DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)}>
            <TrashIcon />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja deletar esse agendamento?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Essa ação não pode ser revertida. Isso irá deletar o agendamento
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDeleteAppointmentClick}
              disabled={deleteAppointmentAction.status === "executing"}
            >
              {deleteAppointmentAction.status === "executing"
                ? "Deletando..."
                : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AppointmentsTableActions;
