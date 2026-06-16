import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import type { FeatureCardProps } from "../../Models/FeatureCardProps"
import { useState } from 'react';

function FeatureCard({index, icon: Icon, title, description}: FeatureCardProps) {

  const [scrollVelocity, setScrollVelocity] = useState<number>(0);

  const y = useMotionValue(0);
  const scale = useTransform(y, [-300, 0, 300], [0.95, 1, 0.95]);
  const opacity = useTransform(y, [-300, -100, 0, 100, 300], [0.3, 0.8, 1, 0.8, 0.3]);
  
  const springConfig = { stiffness: 100, damping: 20 };
  const scaleSpring = useSpring(scale, springConfig);
  const opacitySpring = useSpring(opacity, springConfig);
  return (
    <motion.div
      style={{
        scale: scaleSpring,
        opacity: opacitySpring,
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -8 }}
      className="relative group"
    >
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-white/20 transition-all duration-300">
        <motion.div
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 sm:mb-6"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          animate={{
            rotate: scrollVelocity > 1 ? [0, 10, 0] : 0,
          }}
        >
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </motion.div>

        <h3 className="text-xl sm:text-2xl mb-3 text-white group-hover:text-blue-300 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>

    </motion.div>
  )
}

export default FeatureCard