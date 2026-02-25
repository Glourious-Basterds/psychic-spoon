import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, Shield, Sparkles, UserPlus, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Background elements - Hyper Colors */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-red-600/20 blur-[150px] rounded-full" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-yellow-400/10 blur-[100px] rounded-full" />

      {/* Navbar */}
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between px-8 py-6 backdrop-blur-xl border-b border-white/5">
        <div className="marvel-logo scale-75 md:scale-90 origin-left">HASHI</div>
        <div className="hidden items-center gap-10 md:flex">
          <Link href="#features" className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-comic-yellow transition-colors">Abilities</Link>
          <Link href="#ip" className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-marvel-red transition-colors">IP Vault</Link>
          <Link href="#pricing" className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Hero Plans</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-bold text-white uppercase tracking-tighter">Login</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-marvel-red text-white hover:bg-red-700 comic-border border-none shadow-none uppercase font-black italic tracking-tighter px-6">Join Now</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center px-6 pt-52 pb-32 text-center font-sans">
        <div className="inline-flex items-center gap-2 rounded-lg border-2 border-white bg-black p-3 text-xs font-black uppercase tracking-widest text-white mb-10 transform -rotate-1 shadow-[5px_5px_0px_#fde802]">
          <Sparkles className="h-4 w-4 text-comic-yellow fill-comic-yellow" />
          New Multi-Verse Feature Active
        </div>

        <h1 className="marvel-font text-6xl font-black uppercase tracking-tight text-white sm:text-8xl md:text-9xl mb-8 leading-[0.85] drop-shadow-[10px_10px_0px_#e62429]">
          Assemble Your <br />
          <span className="text-comic-yellow italic">Creative</span> Universe
        </h1>

        <p className="max-w-3xl text-xl font-medium text-zinc-300 mb-12 leading-relaxed bg-black/40 backdrop-blur-sm p-6 rounded-2xl border-l-8 border-hero-blue italic transition-all hover:border-comic-yellow">
          Manage your Intellectual Property with the power of a Super-Hero.
          Hashi is the ultimate base of operations for high-stakes creative collaboration and elite production management.
        </p>

        <div className="flex flex-col gap-6 sm:flex-row">
          <Link href="/register">
            <Button size="lg" className="bg-marvel-red hover:bg-red-700 text-white font-black uppercase italic tracking-tighter text-2xl h-16 px-10 rounded-none shadow-[8px_8px_0px_white] active:translate-y-1 active:shadow-none transition-all">
              Ascend Now <ChevronRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="text-white border-4 border-white font-black uppercase h-16 px-10 rounded-none hover:bg-white hover:text-black transition-all">
              View Blueprint
            </Button>
          </Link>
        </div>

        {/* Features Preview - Comic Panels */}
        <div id="features" className="mt-40 grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="bg-white group rounded-none p-1 border-[4px] border-black shadow-[12px_12px_0px_#003399] transition-transform hover:-translate-y-2">
            <div className="bg-black p-8 h-full">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center bg-marvel-red transform -rotate-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="marvel-font text-3xl font-bold text-white mb-4 uppercase tracking-wider group-hover:text-comic-yellow transition-colors">Fortress Vault</h3>
              <p className="text-zinc-400 font-medium text-sm leading-relaxed mb-4">
                Secure your IP in a multi-layered encrypted bunker. Only authorized heroes pass here.
              </p>
              <div className="w-full h-1 bg-white/10" />
            </div>
          </div>

          <div className="bg-white group rounded-none p-1 border-[4px] border-black shadow-[12px_12px_0px_#e62429] transition-transform hover:-translate-y-2 lg:scale-105">
            <div className="bg-black p-8 h-full">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center bg-hero-blue transform rotate-12">
                <Zap className="h-8 w-8 text-white fill-white" />
              </div>
              <h3 className="marvel-font text-3xl font-bold text-white mb-4 uppercase tracking-wider group-hover:text-comic-yellow transition-colors">Blitz Cycles</h3>
              <p className="text-zinc-400 font-medium text-sm leading-relaxed mb-4">
                Execute production phases at god-speed. AI assistance that feels like psychic empowerment.
              </p>
              <div className="w-full h-1 bg-white/10" />
            </div>
          </div>

          <div className="bg-white group rounded-none p-1 border-[4px] border-black shadow-[12px_12px_0px_#fde802] transition-transform hover:-translate-y-2">
            <div className="bg-black p-8 h-full">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center bg-zinc-800 transform -rotate-12 border-2 border-white">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <h3 className="marvel-font text-3xl font-bold text-white mb-4 uppercase tracking-wider group-hover:text-comic-yellow transition-colors">Assemble Squad</h3>
              <p className="text-zinc-400 font-medium text-sm leading-relaxed mb-4">
                Recruitment made easy. Find the specific powers you need for your masterpiece projekt.
              </p>
              <div className="w-full h-1 bg-white/10" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white px-8 py-10 text-center font-black uppercase italic tracking-widest text-black">
        <p className="text-lg italic">Hashi Comics © 2026 • Excelsior!</p>
      </footer>
    </div>
  );
}
