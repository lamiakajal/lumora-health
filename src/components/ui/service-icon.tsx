import { HeartPulseIcon, ShieldCheckIcon, StethoscopeIcon, VideoIcon } from "@/components/ui/icons-medical";
import {
  ActivityIcon,
  BoltIcon,
  BoneIcon,
  BrainIcon,
  EarIcon,
  EyeIcon,
  FlaskIcon,
  HeartIcon,
  MessageIcon,
  ScanIcon,
  SmileIcon,
  SparklesIcon,
} from "@/components/ui/icons-services";
import type { ServiceIconName } from "@/data/services";

const icons = {
  stethoscope: StethoscopeIcon,
  bolt: BoltIcon,
  video: VideoIcon,
  heart: HeartIcon,
  "heart-pulse": HeartPulseIcon,
  smile: SmileIcon,
  sparkles: SparklesIcon,
  flask: FlaskIcon,
  brain: BrainIcon,
  eye: EyeIcon,
  bone: BoneIcon,
  ear: EarIcon,
  scan: ScanIcon,
  activity: ActivityIcon,
  message: MessageIcon,
  shield: ShieldCheckIcon,
} as const;

export function ServiceIcon({ name, className }: { name: ServiceIconName; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} />;
}
