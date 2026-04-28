export default function BackgroundBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-brand-primary opacity-10 blur-3xl animate-blob-float"
      />
      <div
        className="absolute top-1/2 -right-40 h-[600px] w-[600px] rounded-full bg-brand-secondary opacity-10 blur-3xl animate-blob-float"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute -bottom-40 left-1/3 h-[450px] w-[450px] rounded-full bg-brand-accent opacity-10 blur-3xl animate-blob-float"
        style={{ animationDelay: '4s' }}
      />
    </div>
  );
}
