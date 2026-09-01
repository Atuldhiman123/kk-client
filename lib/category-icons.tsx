import {
  RiseOutlined,
  SolutionOutlined,
  HeartOutlined,
  CrownOutlined,
  MedicineBoxOutlined,
  ReadOutlined,
  PropertySafetyOutlined,
  GlobalOutlined,
  TeamOutlined,
  SmileOutlined,
  DollarCircleOutlined,
  HomeOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';

const ICONS: Record<string, ReactNode> = {
  career: <SolutionOutlined />,
  marriage: <CrownOutlined />,
  love: <HeartOutlined />,
  business: <RiseOutlined />,
  health: <MedicineBoxOutlined />,
  education: <ReadOutlined />,
  property: <PropertySafetyOutlined />,
  'foreign-settlement': <GlobalOutlined />,
  'kundli-matching': <TeamOutlined />,
  'child-birth': <SmileOutlined />,
  finance: <DollarCircleOutlined />,
  'family-problems': <HomeOutlined />,
};

export function categoryIcon(slug: string): ReactNode {
  return ICONS[slug] ?? <SafetyCertificateOutlined />;
}
