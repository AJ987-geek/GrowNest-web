import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Brain, Bell, ChevronRight, Star, Check, ArrowRight, Zap, Users, Activity, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const features = [
  {
    icon: Activity,
    title: 'Health Tracking',
    description: 'Monitor your child\'s height, weight, BMI, and overall health metrics in real-time with beautiful charts.',
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: Heart,
    title: 'Nutrition Monitoring',
    description: 'Track daily calorie intake, protein, and vitamins. Get AI-powered meal recommendations tailored for your child.',
    gradient: 'from-rose-500 to-rose-600',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
  },
  {
    icon: Shield,
    title: 'Vaccination Reminders',
    description: 'Never miss a vaccine. Get timely reminders with a complete schedule tracker and missed vaccine alerts.',
    gradient: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: Brain,
    title: 'AI Parenting Support',
    description: 'Get instant answers to parenting questions from our medical-grade AI assistant, available 24/7.',
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: TrendingUp,
    title: 'Growth Analytics',
    description: 'Visualize your child\'s growth trajectory with WHO growth charts and personalized milestone tracking.',
    gradient: 'from-teal-500 to-teal-600',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
  },
  {
    icon: Users,
    title: 'Parent Community',
    description: 'Connect with thousands of parents, share experiences, and get peer support in our moderated community.',
    gradient: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
];

const steps = [
  { step: '01', title: 'Create Your Account', desc: 'Sign up in under 2 minutes. Add your parental information and preferences.' },
  { step: '02', title: 'Add Your Child\'s Profile', desc: 'Enter your child\'s age, weight, height, and medical history securely.' },
  { step: '03', title: 'Get Personalized Insights', desc: 'Our AI analyzes your child\'s data and provides tailored health recommendations.' },
  { step: '04', title: 'Track & Improve Together', desc: 'Monitor progress, get alerts, and celebrate milestones with your family.' },
];

const testimonials = [
  { name: 'Sarah M.', role: 'Mom of 2, California', rating: 5, text: 'GrowNest AI has completely transformed how I manage my kids\' health. The vaccination reminders alone are worth it!' },
  { name: 'David K.', role: 'Dad of 1, New York', rating: 5, text: 'As a first-time dad, the AI assistant is incredibly helpful. I can ask any question at 3 AM and get a real, accurate answer.' },
  { name: 'Priya R.', role: 'Mom of 3, Texas', rating: 5, text: 'The nutrition tracking helped me identify that my daughter was iron-deficient. The AI suggested foods that really helped.' },
];

const faqs = [
  { q: 'Is my child\'s health data secure?', a: 'Absolutely. We use AES-256 encryption, are HIPAA-compliant, and never share data with third parties. Your family\'s privacy is our highest priority.' },
  { q: 'Is the AI assistant medically accurate?', a: 'Our AI is trained on peer-reviewed pediatric medical literature and follows AAP (American Academy of Pediatrics) guidelines. However, it\'s designed to support, not replace, your pediatrician.' },
  { q: 'Can I track multiple children?', a: 'Yes! You can add up to 6 children per account, each with their own dedicated profile, health records, and vaccination schedule.' },
  { q: 'Is GrowNest AI free to use?', a: 'We offer a free plan with core features. Premium plans unlock unlimited AI chat, advanced analytics, and priority support starting at $9.99/month.' },
  { q: 'Does it work for newborns?', a: 'Yes! GrowNest AI supports children from birth to 10 years, with age-appropriate milestones, vaccination schedules, and feeding guides for every stage.' },
];

const stats = [
  { value: '50K+', label: 'Active Families' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '2M+', label: 'Vaccines Tracked' },
  { value: '24/7', label: 'AI Support' },
];

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900" />
        {/* Decorative blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-200/30 dark:bg-teal-900/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/40 border border-primary-200 dark:border-primary-800 mb-6 animate-fade-in">
              <Zap className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">Powered by Medical-Grade AI</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight animate-slide-up text-balance">
              Your Child's Health
              <br />
              <span className="gradient-text">Companion Powered</span>
              <br />
              by AI
            </h1>

            <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in">
              Track health metrics, monitor nutrition, stay on top of vaccinations,
              and get instant AI parenting support — all in one beautiful platform
              built exclusively for parents of children aged 0–10.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in">
              <Link to="/register" className="btn-primary text-base px-8 py-4 shadow-xl shadow-primary-200 dark:shadow-primary-900/30">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#how-it-works" className="btn-outline text-base px-8 py-4">
                See How It Works
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              {['HIPAA Compliant', 'No Credit Card Required', 'Free Forever Plan', 'Setup in 2 min'].map(badge => (
                <span key={badge} className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Dashboard preview mockup */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
              <div className="bg-gradient-to-br from-primary-600 to-teal-600 p-1 rounded-2xl">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[['👶 Age', '5 yrs 4 mo'], ['⚖️ BMI', '15.9 Healthy'], ['💊 Next Vaccine', 'MMR in 58d'], ['🥗 Nutrition', '87/100']].map(([label, value]) => (
                      <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-500 mb-1">{label}</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="h-24 bg-gradient-to-r from-primary-100 to-teal-100 dark:from-primary-900/30 dark:to-teal-900/30 rounded-xl flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">📊 Interactive Growth Charts & Analytics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-gradient-to-r from-primary-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-black text-white mb-1">{s.value}</p>
                <p className="text-primary-100 text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge badge-info mb-3">Everything You Need</span>
            <h2 className="section-title">Built for Modern Parents</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Every feature designed with pediatric experts to give your child the best possible start.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="card-hover p-6 group">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge badge-success mb-3">Simple Setup</span>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get started in minutes, not hours.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-teal-200 dark:from-primary-800 dark:to-teal-800 z-0" />
                )}
                <div className="card p-6 relative z-10 h-full hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-black text-sm mb-4 shadow">{s.step}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge badge-warning mb-3">Loved by Parents</span>
            <h2 className="section-title">What Parents Are Saying</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="card-hover p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="card overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 animate-slide-up">
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden gradient-bg p-12 text-center shadow-2xl">
            <div className="absolute inset-0 opacity-10">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="absolute w-2 h-2 rounded-full bg-white"
                  style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} />
              ))}
            </div>
            <div className="relative">
              <h2 className="text-4xl font-black text-white mb-4">Start Your Child's Health Journey Today</h2>
              <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">Join 50,000+ parents who trust GrowNest AI to keep their children healthy and happy.</p>
              <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-50 transition shadow-xl text-base">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
