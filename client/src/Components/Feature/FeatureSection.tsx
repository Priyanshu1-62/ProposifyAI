import { Zap, Brain, Shield } from 'lucide-react';
import FeatureCard from './FeatureCard';
const features = [
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Generate comprehensive proposals in seconds, not hours. Our AI understands your requirements and creates tailored content instantly.',
    },
    {
        icon: Brain,
        title: 'AI-Powered Intelligence',
        description: 'Leverage advanced machine learning to craft persuasive, context-aware proposals that resonate with your audience.',
      },
      {
        icon: Shield,
        title: 'Enterprise Security',
        description: 'Your data is protected with bank-level encryption and compliance with industry standards. Privacy is our priority.',
      },
];

function FeatureSection() {
  return (
    <section className='py-20 px-4 md:px-6 lg:px-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
        {features.map((feature, index) => {
          return <FeatureCard key={index} index={index} icon={feature.icon} title={feature.title} description={feature.description} />
        })}
      </div>
    </section>
  )
}

export default FeatureSection