// Mock data structure for Realry Platform Dashboard
// This structure is designed to be easily replaceable with API calls

export type PlanType = 'free' | 'paid' | null;

export interface PartnerPlans {
  shop: PlanType;
  creator: PlanType;
}

export interface AdMetrics {
  impressions: number;
  clicks: number;
  spend: number;
  revenue: number;
  ctr: number; // Click-through rate
  cpc: number; // Cost per click
}

export interface Product {
  id: string;
  name: string;
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

export interface ProductExposureMetrics {
  productViews: number;
  uniqueProducts: number;
  topProducts: Product[];
}

export interface Campaign {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'completed';
  clicks: number;
  conversions: number;
  revenue: number;
  roas: number;
  spend: number;
}

export interface CampaignMetrics {
  totalCampaigns: number;
  activeCampaigns: number;
  campaignPerformance: Campaign[];
}

export interface PerformanceRank {
  percentile: number; // 0-100, where 100 is best
  rank: number; // Absolute rank (e.g., 234 out of 1050)
  totalShops: number;
  category: string; // e.g., 'mid-size', 'small', 'large'
}

export interface WebsitePerformanceMetrics {
  // Core Metrics
  revenue: number;
  conversions: number;
  roas: number; // Return on Ad Spend
  performanceRank?: PerformanceRank;
  ads: AdMetrics;
  productExposure: ProductExposureMetrics;
  campaigns: CampaignMetrics;
  
  // Performance Funnel
  clicks: number;
  conversionRate: number; // CVR
  funnel: {
    clicks: number;
    conversions: number;
    cvr: number; // Conversion Rate = conversions / clicks
  };
  
  // Quality Signals
  aov: number; // Average Order Value
  trend: {
    current: number;
    previous: number;
    change: number; // Percentage change vs previous period
    direction: 'up' | 'down';
  };
}

export interface TopTierShopPerformance {
  metrics: WebsitePerformanceMetrics;
  shopName: string;
  // For benchmarking/inspiration
}

export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  visibleInFree: boolean; // Only some visible in free plan
  potentialGain: string; // e.g., "+45% CTR"
}

export interface CreatorPerformance {
  totalCreators: number;
  activeCollaborations: number;
  creatorRevenue: number;
  creatorConversions: number;
  topCreators: {
    id: string;
    name: string;
    revenue: number;
    conversions: number;
    growth: number;
  }[];
  aiSuggestions: AISuggestion[];
}

// Mock data for different plan combinations
export const mockPartnerPlans: PartnerPlans = {
  shop: 'paid', // Change to 'paid' or null to test different scenarios
  creator: 'paid', // Change to 'paid' or null to test different scenarios
};

/** Settings → Organization tab (mock until API exists) */
export interface OrganizationAssociatedEntity {
  id: string;
  shopName: string;
  email: string;
  displayName: string;
}

export const mockOrganizationSettings: {
  organizationName: string;
  associatedEntities: OrganizationAssociatedEntity[];
} = {
  organizationName: 'Uniqlo KR',
  associatedEntities: [
    {
      id: '1',
      shopName: 'Uniqlo KR',
      email: 'jane@company.com',
      displayName: 'Jane Doe',
    },
  ],
};

export const mockWebsitePerformance: WebsitePerformanceMetrics = {
  revenue: 47234,
  conversions: 1243,
  roas: 3.2,
  performanceRank: {
    percentile: 78, // Top 22% (100 - 78)
    rank: 234,
    totalShops: 1050,
    category: 'mid-size',
  },
  ads: {
    impressions: 125000,
    clicks: 8920,
    spend: 14750,
    revenue: 47234,
    ctr: 7.14,
    cpc: 1.65,
  },
  productExposure: {
    productViews: 45600,
    uniqueProducts: 234,
    topProducts: [
      { id: '1', name: 'Premium Wireless Headphones', views: 5600, clicks: 890, conversions: 124, revenue: 12400 },
      { id: '2', name: 'Smart Fitness Watch', views: 4800, clicks: 720, conversions: 98, revenue: 9800 },
      { id: '3', name: 'Portable Bluetooth Speaker', views: 4200, clicks: 650, conversions: 87, revenue: 8700 },
    ],
  },
  campaigns: {
    totalCampaigns: 12,
    activeCampaigns: 8,
    campaignPerformance: [
      { id: '1', name: 'Summer Sale 2024', type: 'Promotion', status: 'active', clicks: 2100, conversions: 245, revenue: 24500, roas: 4.2, spend: 5833 },
      { id: '2', name: 'New Product Launch', type: 'Product Ads', status: 'active', clicks: 1800, conversions: 198, revenue: 19800, roas: 3.8, spend: 5210 },
      { id: '3', name: 'Flash Deal Weekend', type: 'Flash Sales', status: 'completed', clicks: 1500, conversions: 165, revenue: 16500, roas: 3.5, spend: 4714 },
    ],
  },
  clicks: 8920,
  conversionRate: 13.9, // CVR
  funnel: {
    clicks: 8920,
    conversions: 1243,
    cvr: 13.9,
  },
  aov: 38.0,
  trend: {
    current: 47234,
    previous: 42000,
    change: 12.5,
    direction: 'up',
  },
};

export const mockTopTierShopPerformance: TopTierShopPerformance[] = [
  {
    shopName: 'Elite Fashion Co',
    metrics: {
      revenue: 125000,
      conversions: 3200,
      roas: 5.8,
      ads: {
        impressions: 300000,
        clicks: 25000,
        spend: 21500,
        revenue: 125000,
        ctr: 8.3,
        cpc: 0.86,
      },
      productExposure: {
        productViews: 150000,
        uniqueProducts: 500,
        topProducts: [],
      },
      campaigns: {
        totalCampaigns: 25,
        activeCampaigns: 18,
        campaignPerformance: [],
      },
      clicks: 25000,
      conversionRate: 12.8,
      funnel: {
        clicks: 25000,
        conversions: 3200,
        cvr: 12.8,
      },
      aov: 39.1,
      trend: {
        current: 125000,
        previous: 118000,
        change: 5.9,
        direction: 'up',
      },
    },
  },
  {
    shopName: 'Tech Innovations Pro',
    metrics: {
      revenue: 98000,
      conversions: 2450,
      roas: 5.2,
      ads: {
        impressions: 250000,
        clicks: 22000,
        spend: 18850,
        revenue: 98000,
        ctr: 8.8,
        cpc: 0.86,
      },
      productExposure: {
        productViews: 120000,
        uniqueProducts: 380,
        topProducts: [],
      },
      campaigns: {
        totalCampaigns: 20,
        activeCampaigns: 15,
        campaignPerformance: [],
      },
      clicks: 22000,
      conversionRate: 11.1,
      funnel: {
        clicks: 22000,
        conversions: 2450,
        cvr: 11.1,
      },
      aov: 40.0,
      trend: {
        current: 98000,
        previous: 92000,
        change: 6.5,
        direction: 'up',
      },
    },
  },
];

export const mockCreatorPerformance: CreatorPerformance = {
  totalCreators: 45,
  activeCollaborations: 12,
  creatorRevenue: 28450,
  creatorConversions: 456,
  topCreators: [
    { id: '1', name: 'Lifestyle Influencer', revenue: 8500, conversions: 128, growth: 23.5 },
    { id: '2', name: 'Fashion Blogger', revenue: 7200, conversions: 98, growth: 18.2 },
    { id: '3', name: 'Tech Reviewer', revenue: 6500, conversions: 87, growth: 15.8 },
    { id: '4', name: 'Beauty Expert', revenue: 6250, conversions: 143, growth: 31.2 },
  ],
  aiSuggestions: [
    {
      id: '1',
      title: 'Optimize Creator Content Timing',
      description: 'Post creator content during peak engagement hours (2-4 PM and 7-9 PM) to maximize visibility and conversions',
      impact: 'high',
      visibleInFree: true,
      potentialGain: '+45% Engagement',
    },
    {
      id: '2',
      title: 'Collaborate with Micro-Influencers',
      description: 'Partner with micro-influencers (10K-100K followers) for better engagement rates and ROI',
      impact: 'high',
      visibleInFree: true,
      potentialGain: '+38% Conversion Rate',
    },
    {
      id: '3',
      title: 'A/B Test Creator Content Formats',
      description: 'Test different content formats (video vs static, carousel vs single post) to find what resonates best',
      impact: 'high',
      visibleInFree: false,
      potentialGain: '+32% Conversions',
    },
    {
      id: '4',
      title: 'Segment Creator Audiences',
      description: 'Create personalized campaigns for different creator audience segments based on demographics and interests',
      impact: 'medium',
      visibleInFree: false,
      potentialGain: '+28% Revenue',
    },
    {
      id: '5',
      title: 'Leverage User-Generated Content',
      description: 'Encourage creators to generate UGC that can be repurposed across multiple channels',
      impact: 'medium',
      visibleInFree: false,
      potentialGain: '+25% Brand Awareness',
    },
    {
      id: '6',
      title: 'Implement Creator Affiliate Program',
      description: 'Set up an affiliate program to incentivize creators to drive more conversions',
      impact: 'high',
      visibleInFree: false,
      potentialGain: '+42% Creator Revenue',
    },
    {
      id: '7',
      title: 'Track Creator Content Performance',
      description: 'Use advanced analytics to track which creator content performs best and optimize future collaborations',
      impact: 'medium',
      visibleInFree: false,
      potentialGain: '+35% ROI',
    },
  ],
};

// Time series data for charts
/** StylMatch-style creator dashboard snapshot (aligned with partner.stylmatch.com/creator-dashboard) */
export interface CreatorDashboardOverview {
  summary: {
    revenue: number;
    /** Revenue-producing creators count */
    rpc: number;
    clicks: number;
    purchases: number;
    conversionRate: number;
    epc: number;
  };
  revenueByDay: { date: string; revenue: number }[];
  influencerRanking: { id: string; name: string; revenue: number }[];
}

export const mockCreatorDashboardOverview: CreatorDashboardOverview = {
  summary: {
    revenue: 28450,
    rpc: 28,
    clicks: 12500,
    purchases: 456,
    conversionRate: 3.65,
    epc: 2.28,
  },
  revenueByDay: [
    { date: 'Jan 8', revenue: 4200 },
    { date: 'Jan 9', revenue: 5800 },
    { date: 'Jan 10', revenue: 4900 },
    { date: 'Jan 11', revenue: 7100 },
    { date: 'Jan 12', revenue: 6400 },
    { date: 'Jan 13', revenue: 8200 },
    { date: 'Jan 14', revenue: 7800 },
  ],
  influencerRanking: [
    { id: '1', name: 'Lifestyle Influencer', revenue: 8500 },
    { id: '2', name: 'Fashion Blogger', revenue: 7200 },
    { id: '3', name: 'Tech Reviewer', revenue: 6500 },
    { id: '4', name: 'Beauty Expert', revenue: 6250 },
    { id: '5', name: 'Fitness Coach', revenue: 5800 },
    { id: '6', name: 'Home & Living', revenue: 5100 },
    { id: '7', name: 'Food & Dining', revenue: 4600 },
    { id: '8', name: 'Travel Creator', revenue: 4200 },
    { id: '9', name: 'Parenting Channel', revenue: 3800 },
    { id: '10', name: 'Gaming Streamer', revenue: 3400 },
  ],
};

export const mockRevenueData = [
  { date: 'Jan 8', revenue: 4200, revenueNew: 1680, revenueReturning: 2520, clicks: 890, conversions: 124, roas: 3.1 },
  { date: 'Jan 9', revenue: 5800, revenueNew: 2320, revenueReturning: 3480, clicks: 1200, conversions: 165, roas: 3.3 },
  { date: 'Jan 10', revenue: 4900, revenueNew: 1960, revenueReturning: 2940, clicks: 980, conversions: 142, roas: 3.0 },
  { date: 'Jan 11', revenue: 7100, revenueNew: 2840, revenueReturning: 4260, clicks: 1450, conversions: 198, roas: 3.5 },
  { date: 'Jan 12', revenue: 6400, revenueNew: 2560, revenueReturning: 3840, clicks: 1320, conversions: 178, roas: 3.4 },
  { date: 'Jan 13', revenue: 8200, revenueNew: 3280, revenueReturning: 4920, clicks: 1680, conversions: 225, roas: 3.6 },
  { date: 'Jan 14', revenue: 7800, revenueNew: 3120, revenueReturning: 4680, clicks: 1590, conversions: 210, roas: 3.5 },
];

export const mockPreviousPeriodData = [
  { date: 'Dec 1', revenue: 3800, clicks: 820, conversions: 110, roas: 2.9 },
  { date: 'Dec 2', revenue: 5200, clicks: 1100, conversions: 148, roas: 3.0 },
  { date: 'Dec 3', revenue: 4500, clicks: 900, conversions: 130, roas: 2.8 },
  { date: 'Dec 4', revenue: 6500, clicks: 1350, conversions: 180, roas: 3.2 },
  { date: 'Dec 5', revenue: 5800, clicks: 1200, conversions: 165, roas: 3.1 },
  { date: 'Dec 6', revenue: 7500, clicks: 1550, conversions: 210, roas: 3.4 },
  { date: 'Dec 7', revenue: 7000, clicks: 1450, conversions: 195, roas: 3.3 },
];

export type TeamMemberRole = 'OWNER' | 'ADMIN' | 'VIEWER';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamMemberRole;
  joined: string;
  isCurrentUser: boolean;
}

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Jane Doe (You)',
    email: 'janedoe@company.com',
    role: 'OWNER',
    joined: '2/12/2026',
    isCurrentUser: true,
  },
  {
    id: '2',
    name: 'Adam Yang',
    email: 'adam.yang@company.com',
    role: 'ADMIN',
    joined: '3/15/2026',
    isCurrentUser: false,
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    role: 'VIEWER',
    joined: '3/20/2026',
    isCurrentUser: false,
  },
];

export type InquiryStatus = 'new' | 'in-progress' | 'resolved' | 'closed';
export type InquiryPriority = 'high' | 'medium' | 'low';
export type InquiryType = 'product' | 'partnership' | 'support' | 'billing' | 'general';

export interface Inquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  type: InquiryType;
  status: InquiryStatus;
  priority: InquiryPriority;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export const mockRecentInquiries: Inquiry[] = [
  {
    id: 'INQ-001',
    customerName: 'Emily Chen',
    customerEmail: 'emily.chen@example.com',
    subject: 'Partnership opportunity for summer collection',
    message: 'Hi, I am interested in collaborating on your upcoming summer collection. Our brand has 500K+ followers and we specialize in sustainable fashion...',
    type: 'partnership',
    status: 'new',
    priority: 'high',
    createdAt: '2026-03-26T09:30:00Z',
    updatedAt: '2026-03-26T09:30:00Z',
  },
  {
    id: 'INQ-002',
    customerName: 'Michael Park',
    customerEmail: 'michael.p@retailco.com',
    subject: 'Bulk order pricing inquiry',
    message: 'We are looking to place a bulk order for approximately 500 units. Could you provide wholesale pricing and delivery timelines?',
    type: 'product',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2026-03-25T14:15:00Z',
    updatedAt: '2026-03-26T08:45:00Z',
    assignedTo: 'John Smith',
  },
  {
    id: 'INQ-003',
    customerName: 'Sarah Williams',
    customerEmail: 'swilliams@fashionblog.com',
    subject: 'Product sample request for review',
    message: 'I run a fashion review blog with 100K monthly readers. Would love to feature your products in our upcoming spring edition...',
    type: 'partnership',
    status: 'new',
    priority: 'medium',
    createdAt: '2026-03-25T11:20:00Z',
    updatedAt: '2026-03-25T11:20:00Z',
  },
  {
    id: 'INQ-004',
    customerName: 'David Lee',
    customerEmail: 'david.lee@techstart.io',
    subject: 'API integration support needed',
    message: 'We are having issues integrating your product feed API with our platform. Getting 403 errors on the /products endpoint...',
    type: 'support',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2026-03-24T16:45:00Z',
    updatedAt: '2026-03-25T10:30:00Z',
    assignedTo: 'Sarah Johnson',
  },
  {
    id: 'INQ-005',
    customerName: 'Jennifer Martinez',
    customerEmail: 'jmartinez@lifestyle.co',
    subject: 'Billing discrepancy on last invoice',
    message: 'There seems to be a charge on our March invoice that does not match our subscription plan. Invoice #INV-2026-0312...',
    type: 'billing',
    status: 'resolved',
    priority: 'medium',
    createdAt: '2026-03-23T09:00:00Z',
    updatedAt: '2026-03-24T14:20:00Z',
    assignedTo: 'Admin',
  },
  {
    id: 'INQ-006',
    customerName: 'Alex Thompson',
    customerEmail: 'alex.t@creatorstudio.com',
    subject: 'Creator program application',
    message: 'I would like to apply for your creator partnership program. I have experience with lifestyle and fashion content creation...',
    type: 'partnership',
    status: 'new',
    priority: 'medium',
    createdAt: '2026-03-26T07:15:00Z',
    updatedAt: '2026-03-26T07:15:00Z',
  },
  {
    id: 'INQ-007',
    customerName: 'Rachel Kim',
    customerEmail: 'rachel@boutiquestore.com',
    subject: 'Return policy clarification',
    message: 'Quick question about your B2B return policy for damaged items. What is the window for reporting and what documentation is needed?',
    type: 'general',
    status: 'resolved',
    priority: 'low',
    createdAt: '2026-03-22T13:30:00Z',
    updatedAt: '2026-03-22T15:45:00Z',
    assignedTo: 'John Smith',
  },
  {
    id: 'INQ-008',
    customerName: 'Tom Anderson',
    customerEmail: 'tanderson@megamart.com',
    subject: 'Exclusive product line discussion',
    message: 'Our retail chain is interested in discussing an exclusive product line for our stores. We operate 150+ locations nationwide...',
    type: 'partnership',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2026-03-21T10:00:00Z',
    updatedAt: '2026-03-25T16:00:00Z',
    assignedTo: 'Admin',
  },
];
