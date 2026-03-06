export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto flex flex-col items-center justify-center">
      <h1 className="font-display text-5xl mb-6">SEA-Up Creative</h1>
      <p className="font-body text-lg text-muted mb-12 text-center max-w-2xl">
        An AI-powered creative platform for people with intellectual disabilities.
      </p>

      <div className="flex gap-4">
        <button className="bg-signal text-ink font-semibold text-sm tracking-wide px-6 h-[48px] min-w-[48px] hover:bg-signal/90 active:scale-[0.98] transition-all duration-150">
          Make Art
        </button>
      </div>
    </main>
  );
}
