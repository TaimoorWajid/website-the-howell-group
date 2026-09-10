import { NavigationIcon } from './navigation-icon.component';

export interface MegaMenuItem { title: string; description: string; route: string; icon: NavigationIcon; }
export interface MegaMenuSection { title: string; items: readonly MegaMenuItem[]; }
export interface MegaMenuFeature { image: string; alt: string; eyebrow: string; title: string; description?: string; route: string; cta: string; date?: string; }
export interface MegaMenuConfig { id: string; label: string; path: string; introduction: string; sections: readonly MegaMenuSection[]; feature: MegaMenuFeature; }
