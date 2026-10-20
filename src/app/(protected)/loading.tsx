import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <LoaderCircle className="text-primary h-8 w-8 animate-spin" />

      <p className="text-muted-foreground text-sm">Carregando página...</p>
    </div>
  );
};

export default Loading;
