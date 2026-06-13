import type { FeatureCardProps } from "../../Models/FeatureCardProps"

function FeatureCard({index, icon, title, description}: FeatureCardProps) {
  return (
    <div>{title}</div>
  )
}

export default FeatureCard