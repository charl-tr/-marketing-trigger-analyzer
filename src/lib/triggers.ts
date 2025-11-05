export interface Trigger {
  id: string;
  name: string;
  description: string;
  color: string;
}

export const triggers: Trigger[] = [
  {
    id: 'urgency',
    name: 'Urgency',
    description: 'Encourages immediate action',
    color: '#FF6B6B'
  },
  {
    id: 'scarcity',
    name: 'Scarcity',
    description: 'Highlights rarity or limited availability',
    color: '#4ECDC4'
  },
  {
    id: 'social_proof',
    name: 'Social Proof',
    description: 'Uses social validation and peer influence',
    color: '#45B7D1'
  },
  {
    id: 'authority',
    name: 'Authority',
    description: 'Establishes credibility and expertise',
    color: '#96CEB4'
  },
  {
    id: 'fear',
    name: 'Fear',
    description: 'Creates anxiety about negative outcomes',
    color: '#FF9FF3'
  },
  {
    id: 'exclusivity',
    name: 'Exclusivity',
    description: 'Creates sense of privilege and exclusiveness',
    color: '#00D2D3'
  },
  {
    id: 'storytelling',
    name: 'Storytelling',
    description: 'Uses narratives to persuade',
    color: '#FF9F43'
  },
  {
    id: 'contrast',
    name: 'Contrast',
    description: 'Creates contrast between options',
    color: '#C44569'
  },
  {
    id: 'call_to_action',
    name: 'Call to Action',
    description: 'Encourages specific action',
    color: '#2ED573'
  },
  {
    id: 'loss_aversion',
    name: 'Loss Aversion',
    description: 'Creates fear of missing out',
    color: '#FF3838'
  },
  {
    id: 'commitment',
    name: 'Commitment & Consistency',
    description: 'Encourages commitment to decisions',
    color: '#9B59B6'
  },
  {
    id: 'greed',
    name: 'Greed',
    description: 'Appeals to desire for gain',
    color: '#F39C12'
  }
];

export function getTriggerById(id: string): Trigger | undefined {
  return triggers.find(trigger => trigger.id === id);
}

export function getTriggerByName(name: string): Trigger | undefined {
  return triggers.find(trigger => trigger.name === name);
}