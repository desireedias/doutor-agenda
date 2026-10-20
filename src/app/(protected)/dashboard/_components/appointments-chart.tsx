"use client";

import "dayjs/locale/pt-br";

import dayjs from "dayjs";
import { DollarSign } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrencyInCents } from "@/helpers/currency";

dayjs.locale("pt-br");

interface DailyAppointment {
  date: string;
  appointments: number;
  revenue: number | null;
}

interface AppoitmentsChartProps {
  dailyAppointmentsData: DailyAppointment[];
}

const chartConfig = {
  appointments: {
    label: "Agendamentos",
    color: "var(--chart-1)",
  },
  revenue: {
    label: "Faturamento",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function AppointmentsChart({
  dailyAppointmentsData,
}: AppoitmentsChartProps) {
  // 1. Gera a espinha dorsal de 21 dias (10 atrás + hoje + 10 à frente)
  const chartDays = Array.from({ length: 21 }).map((_item, index) =>
    dayjs()
      .subtract(10 - index, "days")
      .format("YYYY-MM-DD"),
  );

  // 2. Preenche os dias vazios com zero
  const chartData = chartDays.map((date) => {
    const dataForDay = dailyAppointmentsData.find((item) => item.date === date);
    return {
      date: dayjs(date).format("DD/MM"),
      fullDate: date,
      appointments: dataForDay?.appointments || 0,
      revenue: Number(dataForDay?.revenue || 0),
    };
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <DollarSign className="text-muted-foreground h-5 w-5" />
        <div>
          <CardTitle>Agendamentos e Faturamento</CardTitle>
          <CardDescription>
            Visão detalhada dos últimos 10 dias até os próximos 10 dias
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-62.5 w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
          >
            {/* Definição dos Gradientes baseados nas variáveis do chartConfig */}
            <defs>
              <linearGradient id="fillAppointments" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-appointments)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-appointments)"
                  stopOpacity={0.05}
                />
              </linearGradient>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            {/* Eixo Y da Esquerda: Quantidade de Agendamentos */}
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
            />

            {/* Eixo Y da Direita: Valor do Faturamento */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCurrencyInCents(value)}
            />

            {/* Tooltip com Formatação Customizada e Ícones em PT-BR */}
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    if (name === "revenue") {
                      return (
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-xs bg-(--color-revenue)" />
                          <span className="text-muted-foreground">
                            Faturamento:
                          </span>
                          <span className="text-foreground font-semibold">
                            {formatCurrencyInCents(Number(value))}
                          </span>
                        </div>
                      );
                    }
                    return (
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-xs bg-(--color-appointments)" />
                        <span className="text-muted-foreground">
                          Agendamentos:
                        </span>
                        <span className="text-foreground font-semibold">
                          {value}
                        </span>
                      </div>
                    );
                  }}
                  labelFormatter={(_label, payload) => {
                    if (payload && payload[0]) {
                      return dayjs(payload[0].payload?.fullDate).format(
                        "DD/MM/YYYY (dddd)",
                      );
                    }
                    return _label;
                  }}
                />
              }
            />

            {/* Áreas Independentes (Eixos Y Duplos - Sem empilhar) */}
            <Area
              yAxisId="left"
              dataKey="appointments"
              type="monotone"
              fill="url(#fillAppointments)"
              stroke="var(--color-appointments)"
              strokeWidth={2}
            />
            <Area
              yAxisId="right"
              dataKey="revenue"
              type="monotone"
              fill="url(#fillRevenue)"
              stroke="var(--color-revenue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
