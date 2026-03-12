import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const ContextualHelpPanel = ({ userRole }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const helpCategories = [
    { id: 'all', label: 'All Topics', icon: 'Grid3x3' },
    { id: 'getting-started', label: 'Getting Started', icon: 'PlayCircle' },
    { id: 'features', label: 'Features', icon: 'Zap' },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: 'AlertCircle' },
    { id: 'best-practices', label: 'Best Practices', icon: 'Star' }
  ];

  const helpArticles = {
    voter: [
      { title: 'How to cast your first vote', category: 'getting-started', icon: 'Vote', description: 'Step-by-step guide to participating in elections' },
      { title: 'Understanding voting methods', category: 'features', icon: 'CheckSquare', description: 'Learn about Plurality, Ranked Choice, Approval, and Plus-Minus' },
      { title: 'Verifying your vote on blockchain', category: 'features', icon: 'ShieldCheck', description: 'How to check your vote was counted correctly' },
      { title: 'Earning XP and badges', category: 'features', icon: 'Trophy', description: 'Complete guide to the gamification system' },
      { title: 'Why can\'t I vote in an election?', category: 'troubleshooting', icon: 'HelpCircle', description: 'Common reasons and solutions' },
      { title: 'Maximizing your prize chances', category: 'best-practices', icon: 'Target', description: 'Tips for winning more prizes' }
    ],
    creator: [
      { title: 'Creating your first election', category: 'getting-started', icon: 'Plus', description: 'Complete walkthrough of the Election Studio' },
      { title: 'Setting up gamification', category: 'features', icon: 'Gift', description: 'How to add prizes and lottery tickets' },
      { title: 'Understanding analytics', category: 'features', icon: 'BarChart', description: 'Interpreting your election performance data' },
      { title: 'Monetization strategies', category: 'best-practices', icon: 'DollarSign', description: 'How to earn from participation fees and sponsorships' },
      { title: 'Why isn\'t my election getting votes?', category: 'troubleshooting', icon: 'TrendingDown', description: 'Boost engagement and visibility' },
      { title: 'Optimizing election titles', category: 'best-practices', icon: 'FileText', description: 'Best practices for compelling titles' }
    ],
    advertiser: [
      { title: 'Launching your first campaign', category: 'getting-started', icon: 'Megaphone', description: 'Guide to participatory advertising' },
      { title: 'Audience targeting options', category: 'features', icon: 'Target', description: 'Demographics, zones, and behavioral targeting' },
      { title: 'Understanding CPE pricing', category: 'features', icon: 'DollarSign', description: 'Cost Per Engagement model explained' },
      { title: 'Tracking ROI and conversions', category: 'features', icon: 'TrendingUp', description: 'Measuring campaign effectiveness' },
      { title: 'Low engagement rates?', category: 'troubleshooting', icon: 'AlertTriangle', description: 'Troubleshooting campaign performance' },
      { title: 'Optimizing creative assets', category: 'best-practices', icon: 'Image', description: 'Best practices for ad content' }
    ]
  };

  const faqItems = {
    voter: [
      { question: 'How do I earn XP?', answer: 'You earn XP by voting in elections, maintaining daily streaks, and participating in sponsored elections. Premium subscribers earn 2x XP.' },
      { question: 'Can I change my vote?', answer: 'No, votes are final once submitted and recorded on the blockchain. This ensures election integrity.' },
      { question: 'How are winners selected?', answer: 'Winners are selected using a cryptographically secure random number generator (RNG) displayed through a 3D slot machine animation.' }
    ],
    creator: [
      { question: 'How much does it cost to create elections?', answer: 'Free users can create limited elections. Premium Individual ($9.99/month) and Organization ($49.99/month) plans offer unlimited elections.' },
      { question: 'Can I edit an election after publishing?', answer: 'You can modify prizes and end dates, but core settings like voting method and candidates cannot be changed once published.' },
      { question: 'How do I get more voters?', answer: 'Share your election on social media, enable gamification with prizes, and optimize your title and description for discovery.' }
    ],
    advertiser: [
      { question: 'What is participatory advertising?', answer: 'It\'s an engagement-based ad model where users actively participate in elections related to your brand, creating deeper engagement than traditional ads.' },
      { question: 'How is CPE calculated?', answer: 'Cost Per Engagement (CPE) varies by zone ($0.50-$5.00) and is charged only when users complete your election, not just view it.' },
      { question: 'Can I target specific demographics?', answer: 'Yes, you can target by age, gender, location, gamification stats, and behavioral patterns for precise audience reach.' }
    ]
  };

  const articles = helpArticles?.[userRole] || [];
  const faqs = faqItems?.[userRole] || [];

  const filteredArticles = articles?.filter((article) => {
    const matchesSearch = article?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         article?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="HelpCircle" size={24} className="text-primary" />
          <h2 className="text-xl font-heading font-bold text-foreground">
            Contextual Help Center
          </h2>
        </div>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            icon="Search"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {helpCategories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => setSelectedCategory(category?.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === category?.id
                  ? 'bg-primary text-white' :'bg-gray-100 dark:bg-gray-800 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Icon name={category?.icon} size={16} />
              {category?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Help Articles */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Help Articles ({filteredArticles?.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles?.map((article, index) => (
            <div key={index} className="card p-5 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={article?.icon} size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{article?.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{article?.description}</p>
                  <span className="text-xs text-primary font-medium">Read more →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles?.length === 0 && (
          <div className="card p-12 text-center">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No articles found matching your search</p>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqs?.map((faq, index) => (
            <details key={index} className="card p-5 cursor-pointer group">
              <summary className="flex items-center justify-between font-semibold text-foreground">
                {faq?.question}
                <Icon name="ChevronDown" size={20} className="text-muted-foreground group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {faq?.answer}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="card p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
            <Icon name="MessageCircle" size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground mb-1">Still need help?</h3>
            <p className="text-sm text-muted-foreground">
              Can't find what you're looking for? Contact our support team for personalized assistance.
            </p>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContextualHelpPanel;