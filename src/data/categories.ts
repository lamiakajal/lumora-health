export const categories = [
  { id: "primary", label: "Primary and urgent care", tab: "Primary" },
  { id: "heart", label: "Heart and vascular", tab: "Heart" },
  { id: "brain", label: "Brain and nerves", tab: "Brain" },
  { id: "mind", label: "Mental health", tab: "Mind" },
  { id: "children", label: "Children", tab: "Children" },
  { id: "women", label: "Women's health", tab: "Women" },
  { id: "bones", label: "Bones, joints and sport", tab: "Bones" },
  { id: "specialist", label: "Specialist care", tab: "Specialists" },
  { id: "wellness", label: "Diagnostics and wellness", tab: "Wellness" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];
