type ErrorStateProps = {
  message: string;
};

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
      <p className="font-medium text-red-300">{message}</p>
    </div>
  );
}