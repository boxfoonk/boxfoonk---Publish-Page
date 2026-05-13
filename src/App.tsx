import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, X, Languages, Github, Smartphone, Monitor, Code, Settings, Share2, MessageSquare, Twitter, Send, MapPin, Mail, ExternalLink, Cpu, Briefcase } from 'lucide-react';
import { cn } from './lib/utils';
import { translations } from './locales';
import InteractiveBackground from './components/InteractiveBackground';
import Toolbox from './components/Toolbox';

function HomePage({ lang, t }: { lang: 'zh' | 'en', t: any }) {
  const navigate = useNavigate();
  return (
    <motion.div
      key="home-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] opacity-20" />
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[100px] opacity-10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 flex flex-wrap justify-center">
              {`${t.hero_title} Publisher`.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.04,
                    ease: "easeOut"
                  }}
                  className="inline-block bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.0 }}
              className="text-lg md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 font-normal leading-relaxed"
            >
              {t.hero_subtitle}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap justify-center gap-4"
            >
              <a 
                href="#about"
                className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all transform hover:scale-105"
              >
                {lang === 'zh' ? '开始探索' : 'Get Started'}
              </a>
              <a 
                href="https://github.com/boxfoonk" 
                target="_blank"
                className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <Github size={20} /> GitHub
              </a>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-indigo-400 font-bold tracking-widest text-sm uppercase mb-4 block">
                  {t.about_subheading}
                </span>
                <h2 className="text-4xl md:text-5xl font-black mb-10 leading-tight">
                  {t.about_heading}
                </h2>
                <div className="space-y-6 text-zinc-100/90 text-lg leading-relaxed font-light drop-shadow-md">
                  <p>{t.about_p_1}</p>
                  <p>{t.about_p_2}</p>
                  <p>{t.about_p_3}</p>
                </div>
              </motion.div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                 <Cpu className="text-indigo-400" /> {t.skills_title}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { title: t.skill_android_title, desc: t.skill_android_desc, icon: Smartphone, color: "bg-green-500/10 text-green-400" },
                  { title: t.skill_pc_title, desc: t.skill_pc_desc, icon: Monitor, color: "bg-blue-500/10 text-blue-400" },
                  { title: t.skill_python_title, desc: t.skill_python_desc, icon: Code, color: "bg-yellow-500/10 text-yellow-400" },
                  { title: t.skill_cpp_title, desc: t.skill_cpp_desc, icon: Settings, color: "bg-red-500/10 text-red-400" },
                  { title: t.skill_java_title, desc: t.skill_java_desc, icon: Github, color: "bg-orange-500/10 text-orange-400" },
                ].map((skill, idx) => (
                  <motion.div
                    key={skill.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ 
                      duration: 0.6, 
                      delay: idx * 0.1,
                      ease: [0.215, 0.61, 0.355, 1]
                    }}
                    className="group p-6 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 hover:border-rose-500/50 hover:bg-white/[0.05] transition-all duration-500 shadow-xl shadow-black/40"
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn("mt-1 p-3 rounded-xl transition-all duration-500 group-hover:scale-110 shadow-lg", skill.color)}>
                        <skill.icon size={22} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1 group-hover:text-rose-300 transition-colors">{skill.title}</h4>
                        <p className="text-zinc-200/70 text-sm leading-relaxed">{skill.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-32 relative">
        <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-indigo-400 font-bold tracking-widest text-sm uppercase mb-4 block">
              {t.resources_subtitle}
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              {t.resources_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              { 
                title: t.toolbox_title, 
                desc: t.toolbox_desc, 
                icon: Briefcase, 
                onClick: () => {
                  navigate('/Toolbox');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                },
                color: "rose" 
              },
              { title: t.nas_title, desc: t.nas_desc, icon: Share2, footer: t.nas_code, link: "https://pan.baidu.com/s/1QhuVYJTA2LOEeAskfkKvFw?pwd=swyt", color: "purple" },
              { title: t.github_title, desc: t.github_desc, icon: Github, link: "https://github.com/boxfoonk", color: "blue" },
            ].map((res, idx) => (
              <motion.div
                key={res.title}
                onClick={() => {
                  if (res.onClick) res.onClick();
                  else if (res.link) window.open(res.link, '_blank');
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: idx * 0.2,
                  ease: "circOut"
                }}
                className="group relative p-8 rounded-[2.5rem] bg-black/40 backdrop-blur-3xl border border-white/10 overflow-hidden flex flex-col items-center text-center hover:-translate-y-4 transition-all duration-700 shadow-2xl shadow-black/80 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-rose-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="mb-6 p-4 rounded-2xl bg-white/5 group-hover:bg-rose-600/20 group-hover:scale-110 transition-all duration-500">
                  <res.icon size={32} className="text-zinc-300 group-hover:text-rose-400 transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">{res.title}</h3>
                <p className="text-zinc-300 mb-6 flex-grow leading-relaxed opacity-80">{res.desc}</p>
                {res.footer && (
                  <span className="px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold mb-6 ring-1 ring-rose-500/30">
                    {res.footer}
                  </span>
                )}
                <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider group-hover:text-rose-400 transition-all duration-300">
                  <span className="group-hover:mr-1 transition-all">{lang === 'zh' ? '立即探索' : 'Explore Now'}</span>
                  <ExternalLink size={14} className="group-hover:scale-125 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section for AEO Optimization */}
          <div className="max-w-4xl mx-auto mt-32">
             <div className="text-center mb-16">
                <span className="text-indigo-400 font-bold tracking-widest text-sm uppercase mb-4 block">
                  {t.faq_subtitle}
                </span>
                <h2 className="text-3xl md:text-4xl font-black mb-4">
                  {t.faq_title}
                </h2>
             </div>
             <div className="space-y-8">
                {[
                  { q: t.faq_1_q, a: t.faq_1_a },
                  { q: t.faq_2_q, a: t.faq_2_a },
                  { q: t.faq_3_q, a: t.faq_3_a },
                ].map((faq, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-8 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-lg shadow-black/40"
                  >
                    <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-3">
                       <span className="w-8 h-8 rounded-full bg-rose-600/20 text-rose-400 flex items-center justify-center text-xs font-bold">Q</span>
                       {faq.q}
                    </h3>
                    <p className="text-zinc-200 leading-relaxed pl-11 opacity-80">
                      {faq.a}
                    </p>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <span className="text-indigo-400 font-bold tracking-widest text-sm uppercase mb-4 block">
                {t.contact_subtitle}
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-10">
                {t.contact_title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { name: 'GitHub', icon: Github, handle: '@boxfoonk', link: 'https://github.com/boxfoonk' },
                  { name: 'X / Twitter', icon: Twitter, handle: '@boxfoonk', link: 'https://x.com/boxfoonk' },
                  { name: 'Telegram', icon: Send, handle: '@boxfoonk', link: 'https://t.me/boxfoonk' },
                  { name: 'Email', icon: Mail, handle: 'liaixl52@gmail.com', link: 'mailto:liaixl52@gmail.com' },
                ].map((item) => (
                  <a 
                    key={item.name}
                    href={item.link}
                    target="_blank"
                    className="p-6 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 hover:bg-white/[0.07] hover:border-rose-500/40 hover:shadow-2xl hover:shadow-rose-500/20 transition-all duration-500 flex flex-col gap-4 shadow-lg shadow-black/40"
                  >
                    <item.icon size={24} className="text-zinc-400" />
                    <div>
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{item.name}</p>
                      <p className="font-medium text-white">{item.handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-[40px] p-10 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-indigo-500 opacity-20">
                <MapPin size={120} weight="thin" />
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-6 text-white">{t.nav_contact}</h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <MapPin className="text-indigo-400 mt-1" />
                    <div>
                      <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">{lang === 'zh' ? '位置' : 'Location'}</p>
                      <p className="text-lg">Shenzhen, China</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="text-indigo-400 mt-1" />
                    <div>
                      <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">{lang === 'zh' ? '邮箱' : 'Email'}</p>
                      <p className="text-lg">liaixl52@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default function App() {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const t = translations[lang];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const shadowX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const shadowY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  const [isMouseInside, setIsMouseInside] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 300);
      mouseY.set(e.clientY - 300);
      setIsMouseInside(true);
    };
    
    const handleMouseLeave = () => setIsMouseInside(false);
    const handleMouseEnter = () => setIsMouseInside(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    // Auto-detect language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('zh')) {
      setLang('zh');
    } else {
      setLang('en');
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []); // Remove dependency on isMouseInside to avoid infinite re-renders/attach/detach

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Inject FAQ Schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": t.faq_1_q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t.faq_1_a
          }
        },
        {
          "@type": "Question",
          "name": t.faq_2_q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t.faq_2_a
          }
        },
        {
          "@type": "Question",
          "name": t.faq_3_q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t.faq_3_a
          }
        }
      ]
    });
    document.head.appendChild(script);

    // Update HTML lang attribute for SEO
    document.documentElement.lang = lang;

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [lang, t]);

  const toggleLang = () => setLang(prev => prev === 'zh' ? 'en' : 'zh');

  const navItems = [
    { name: t.nav_home, href: '#home' },
    { name: t.nav_about, href: '#about' },
    { name: t.nav_resources, href: '#resources' },
    { name: t.nav_contact, href: '#contact' },
  ];

  return (
    <div className="min-h-screen selection:bg-rose-500/30 selection:text-rose-200 overflow-x-hidden font-sans text-zinc-100 relative">
      <InteractiveBackground />
      
      {/* Dynamic Mouse Halo */}
      <AnimatePresence>
        {isMouseInside && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-[600px] h-[600px] pointer-events-none z-[1] rounded-full will-change-transform"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
              x: shadowX,
              y: shadowY,
              filter: 'blur(60px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* iOS-style Ultra-Vibrant Multi-color Mesh Gradient Background */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#0a0212]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#12042a] via-[#08021a] to-[#150525]" />
        
        <motion.div 
          animate={{ x: ['-5%', '5%', '-5%'], y: ['-5%', '3%', '-5%'], scale: [1, 1.05, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-25%] left-[-15%] w-[150%] h-[150%] rounded-full bg-indigo-600/10 mix-blend-screen overflow-hidden blur-[200px] will-change-transform" 
        />
        <motion.div 
          animate={{ x: ['5%', '-5%', '5%'], y: ['5%', '-3%', '5%'], scale: [1.05, 0.95, 1.05] }}
          transition={{ duration: 55, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-15%] right-[-10%] w-[140%] h-[140%] rounded-full bg-rose-600/08 mix-blend-screen overflow-hidden blur-[200px] will-change-transform" 
        />
        
        {/* Anti-banding Noise Layer (Dithering) */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-soft-light bg-[url('https://grainy-gradients.vercel.app/noise.svg')] scale-125" />
      </div>

      {/* Navigation */}
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700 border-b",
          scrolled 
            ? "bg-white/10 backdrop-blur-3xl py-3 border-white/20 shadow-xl" 
            : "bg-transparent py-6 border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold tracking-tighter flex items-center gap-3 group cursor-pointer"
            onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <div className="w-10 h-10 bg-white/20 backdrop-blur-3xl rounded-xl flex items-center justify-center p-1.5 overflow-hidden shadow-2xl ring-1 ring-white/30 group-hover:scale-110 transition-all duration-500">
               <img src="/favicon.ico" alt="boxfoonk Logo" className="w-full h-full object-contain" />
            </div>
            <span className="hidden sm:inline font-display text-white group-hover:text-rose-300 transition-colors tracking-tight">boxfoonk</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a 
                key={item.name} 
                href={item.href}
                onClick={() => { if (location.pathname !== '/') navigate('/'); }}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                {item.name}
              </a>
            ))}
            <Link 
              to="/Toolbox"
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                location.pathname === '/Toolbox' 
                  ? "bg-rose-500 border-rose-500 text-white" 
                  : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
              )}
            >
              {lang === 'zh' ? '工具箱' : 'Toolbox'}
            </Link>
            <button onClick={toggleLang} className="p-2 hover:bg-white/5 rounded-full transition-colors flex items-center gap-1 text-zinc-400 hover:text-white">
              <Languages size={18} />
              <span className="text-xs uppercase font-bold">{lang}</span>
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleLang} className="p-2 text-zinc-400"><Languages size={20} /></button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-zinc-400">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navItems.map((item) => (
                <a 
                  key={item.name} 
                  href={item.href}
                  onClick={() => { setIsMenuOpen(false); if (location.pathname !== '/') navigate('/'); }}
                  className="text-3xl font-bold text-zinc-200"
                >
                  {item.name}
                </a>
              ))}
              <Link to="/Toolbox" onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold text-rose-500">
                {lang === 'zh' ? '工具箱' : 'Toolbox'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route path="/" element={<HomePage lang={lang} t={t} />} />
            <Route path="/Toolbox" element={
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Toolbox onBack={() => navigate('/')} />
              </motion.div>
            } />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-zinc-500 text-sm font-medium">
             © {new Date().getFullYear()} {t.footer_text}
          </div>
          <div className="flex gap-8 text-xs font-bold text-zinc-600 uppercase tracking-[0.2em]">
            <a href="#home" className="hover:text-white transition-colors">{t.nav_home}</a>
            <a href="#about" className="hover:text-white transition-colors">{t.nav_about}</a>
            <a href="#resources" className="hover:text-white transition-colors">{t.nav_resources}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
