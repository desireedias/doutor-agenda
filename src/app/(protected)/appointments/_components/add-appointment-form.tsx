import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";

import { addAppointment } from "@/actions/add-appointment";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

const formSchema = z.object({
  patientId: z.string().min(1, {
    message: "Paciente é obrigatório",
  }),
  doctorId: z.string().min(1, {
    message: "Médico é obrigatório",
  }),
  appointmentPrice: z.number().min(1, {
    message: "Valor da consulta é obrigatória",
  }),
  date: z.date({
    message: "Data é obrigatória",
  }),
  time: z.string().min(1, {
    message: "Horário é obrigatório",
  }),
});

interface AddAppointmentFormProps {
  isOpen: boolean;
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
  appointment?: typeof appointmentsTable.$inferSelect;
  onSuccess?: () => void;
}

const AddAppointmentForm = ({
  appointment,
  patients,
  doctors,
  isOpen,
  onSuccess,
}: AddAppointmentFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: appointment?.patientId ?? "",
      doctorId: appointment?.doctorId ?? "",
      appointmentPrice: 0,
      date: appointment?.date ?? undefined,
      time: "",
    },
  });

  const selectedPatientId = form.watch("patientId");
  const selectedDoctorId = form.watch("doctorId");

  // Atualizar o preço quando o médico for selecionado
  useEffect(() => {
    if (selectedDoctorId) {
      const selectedDoctor = doctors.find(
        (doctor) => doctor.id === selectedDoctorId,
      );
      if (selectedDoctor) {
        form.setValue(
          "appointmentPrice",
          selectedDoctor.appointmentPriceInCents / 100,
        );
      }
    }
  }, [selectedDoctorId, doctors, form]);

  useEffect(() => {
    if (isOpen) {
      form.reset({
        patientId: "",
        doctorId: "",
        appointmentPrice: 0,
        date: undefined,
        time: "",
      });
    }
  }, [isOpen, form, appointment]);

  const addAppointmentAction = useAction(addAppointment, {
    onSuccess: () => {
      toast.success("Agendamento criado com sucesso");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao criar o agendamento");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addAppointmentAction.execute({
      ...values,
      appointmentPriceInCents: values.appointmentPrice * 100,
    });
  };

  const isDateTimeEnabled = selectedDoctorId && selectedPatientId;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar agendamento</DialogTitle>
        <DialogDescription>
          Crie um novo agendamento para sua clínica
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FieldGroup>
          <Controller
            name="patientId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor={field.name}>Paciente</Label>

                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  items={patients.map((patient) => ({
                    value: patient.id,
                    label: patient.name,
                  }))}
                >
                  <SelectTrigger
                    id={field.name}
                    onBlur={field.onBlur}
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue placeholder="Selecione um paciente" />
                  </SelectTrigger>

                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="doctorId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor={field.name}>Médico</Label>

                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  items={doctors.map((doctor) => ({
                    value: doctor.id,
                    label: doctor.name,
                  }))}
                >
                  <SelectTrigger
                    id={field.name}
                    onBlur={field.onBlur}
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue placeholder="Selecione um médico" />
                  </SelectTrigger>

                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="appointmentPrice"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor={field.name}>Valor da consulta</Label>

                <NumericFormat
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value.floatValue);
                  }}
                  onBlur={field.onBlur}
                  customInput={Input}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  prefix="R$ "
                  placeholder="R$ 0,00"
                  allowNegative={false}
                  aria-invalid={fieldState.invalid}
                  disabled={!selectedDoctorId}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="date"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label>Data</Label>

                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!isDateTimeEnabled}
                        data-empty={!field.value}
                        className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                      />
                    }
                  >
                    <CalendarIcon />

                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="time"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor={field.name}>Horário</Label>

                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!selectedPatientId || !selectedDoctorId}
                >
                  <SelectTrigger
                    id={field.name}
                    onBlur={field.onBlur}
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue placeholder="Selecione um horário" />
                  </SelectTrigger>

                  <SelectContent>
                    {/* As opções serão implementadas depois */}
                    <SelectItem value="08:00">08:00</SelectItem>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="11:00">11:00</SelectItem>
                    <SelectItem value="12:00">12:00</SelectItem>
                    <SelectItem value="13:00">13:00</SelectItem>
                    <SelectItem value="14:00">14:00</SelectItem>
                    <SelectItem value="15:00">15:00</SelectItem>
                    <SelectItem value="16:00">16:00</SelectItem>
                    <SelectItem value="17:00">17:00</SelectItem>
                  </SelectContent>
                </Select>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <DialogFooter>
          <Button type="submit" disabled={addAppointmentAction.isPending}>
            {addAppointmentAction.isPending
              ? "Criando..."
              : "Criar agendamento"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default AddAppointmentForm;
