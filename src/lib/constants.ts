export interface StatItem {
  label: string;
  value: number;
  suffix: string;
}

export interface AchievementItem {
  icon: string;
  title: string;
  description: string;
}

export interface DriveCardItem {
  icon: string;
  title: string;
  statement: string;
  proof_label: string;
  project_slug: string;
}

export const DEFAULT_ABOUT_STATS: StatItem[] = [
  { label: 'Hours Coded', value: 1200, suffix: '+' },
  { label: 'Projects Built', value: 12, suffix: '' },
  { label: 'Bugs Squashed', value: 300, suffix: '+' },
  { label: 'APIs Integrated', value: 25, suffix: '+' },
];

export const DEFAULT_ACHIEVEMENTS: AchievementItem[] = [
  {
    icon: '🏆',
    title: 'Built First Full Stack App',
    description: 'Shipped a complete web application with frontend, backend, and database — from scratch.',
  },
  {
    icon: '🤖',
    title: 'Integrated AI APIs',
    description: 'Connected Claude, OpenAI, and custom ML models to production applications.',
  },
  {
    icon: '📊',
    title: 'Built Real-time Dashboard',
    description: 'Created live-updating analytics dashboards with WebSocket and Supabase Realtime.',
  },
  {
    icon: '🥇',
    title: 'Hackathon Winner',
    description: 'Won a campus-wide hackathon with the Smart Campus Sustainability System.',
  },
  {
    icon: '🚀',
    title: 'Shipped 10+ Apps',
    description: 'Delivered over 10 production-ready applications for clients and personal projects.',
  },
  {
    icon: '📦',
    title: 'Open Source Contributor',
    description: 'Contributed to popular open source projects and shared my own tools with the community.',
  },
];

export const DEFAULT_DRIVE_CARDS: DriveCardItem[] = [
  {
    icon: 'Palette',
    title: 'Design as Engineering',
    statement: 'I see design as a problem-solving discipline: every pixel and interaction serves user intent.',
    proof_label: 'Smart Campus Sustainability System',
    project_slug: 'smart-campus-sustainability',
  },
  {
    icon: 'Cpu',
    title: 'Pragmatic Innovation',
    statement: "I don't reinvent the wheel; I connect cutting-edge AI capabilities to concrete operational bottlenecks.",
    proof_label: 'Emergency Crowd Management',
    project_slug: 'emergency-crowd-management',
  },
  {
    icon: 'Users',
    title: 'Collaborative Leadership',
    statement: 'Experienced leading technical tracks, mentoring teammates, and shipping reliably under deadlines.',
    proof_label: 'Bus Tracking System',
    project_slug: 'bus-tracking-system',
  },
  {
    icon: 'Layers',
    title: 'Systematic Problem Solving',
    statement: 'Complex architectures excite me; I deconstruct edge cases and engineer resilient distributed flows.',
    proof_label: 'Real-time Analytics Dashboard',
    project_slug: 'portfolio-dashboard',
  },
];

/**
 * Calculates career years from career_start_date setting or earliest experience start date.
 * Supports formats like "YYYY-MM", "YYYY", etc.
 */
export function calculateCareerYears(
  careerStartDate?: string,
  experienceItems?: Array<{ start_date: string }>
): number {
  let targetDate: Date | null = null;

  if (careerStartDate && careerStartDate.trim()) {
    const parsed = new Date(careerStartDate.trim());
    if (!isNaN(parsed.getTime())) {
      targetDate = parsed;
    }
  }

  if (!targetDate && experienceItems && experienceItems.length > 0) {
    // Find the earliest valid start date
    const timestamps = experienceItems
      .map((e) => {
        const d = new Date(e.start_date.trim());
        return !isNaN(d.getTime()) ? d.getTime() : null;
      })
      .filter((t): t is number => t !== null);

    if (timestamps.length > 0) {
      targetDate = new Date(Math.min(...timestamps));
    }
  }

  // Safe fallback if no parseable dates found
  if (!targetDate) return 2;

  const now = new Date();
  const diffTime = Math.max(0, now.getTime() - targetDate.getTime());
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(1, Math.floor(diffYears));
}
