import {
  Baby,
  Brush,
  CookingPot,
  Gem,
  Shirt,
  Sparkles,
  ToyBrick,
  Scissors,
  PencilRuler,
  type LucideIcon,
} from "lucide-react";

export type Category = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const categories: Category[] = [
  { id: "toys", title: "اسباب‌بازی", description: "بازی و سرگرمی برای سنین مختلف", icon: ToyBrick },
  { id: "stationery", title: "لوازم‌التحریر", description: "ابزار نوشتن، یادگیری و خلاقیت", icon: PencilRuler },
  { id: "haberdashery", title: "خرازی", description: "لوازم دوخت، هنر و کارهای دستی", icon: Scissors },
  { id: "mens-fashion", title: "پوشاک مردانه", description: "پوشاک و انتخاب‌های روزمرهٔ آقایان", icon: Shirt },
  { id: "womens-fashion", title: "پوشاک زنانه", description: "پوشاک و استایل برای موقعیت‌های گوناگون", icon: Shirt },
  { id: "beauty", title: "لوازم آرایشی و وسایل زنانه", description: "لوازم آرایشی و وسایل شخصی", icon: Brush },
  { id: "womens-essentials", title: "لباس زیر زنانه", description: "لباس زیر و اقلام ضروری بانوان", icon: Sparkles },
  { id: "kids-clothing", title: "پوشاک کودک", description: "پوشاک نوزاد و کودک", icon: Baby },
  { id: "accessories", title: "لوازم زینتی و اکسسوری", description: "جزئیات کوچک برای سلیقه‌های مختلف", icon: Gem },
  { id: "home-kitchen", title: "لوازم مصرفی خانه و آشپزخانه", description: "لوازم مصرفی روزمرهٔ خانه و آشپزخانه", icon: CookingPot },
];
