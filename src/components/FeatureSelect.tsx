import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Code } from 'lucide-react';

interface Feature {
  id: string;
  feature_name: string;
}

interface FeatureSelectProps {
  features: Feature[];
  selectedFeature?: string;
  onSelect: (featureId: string) => void;
}

export function FeatureSelect({
  features,
  selectedFeature,
  onSelect
}: FeatureSelectProps) {
  return (
    <Select value={selectedFeature} onValueChange={onSelect}>
      <SelectTrigger className="w-[200px] bg-card border-border focus:ring-2 focus:ring-primary/20">
        <Code className="w-4 h-4 mr-2 text-primary" />
        <SelectValue placeholder="Select feature..." />
      </SelectTrigger>
      <SelectContent>
        {features.map((feature) => (
          <SelectItem key={feature.id} value={feature.id}>
            {feature.feature_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
