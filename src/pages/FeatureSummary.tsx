import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Code,
  Database,
  Shield,
  Zap,
  Globe,
  Settings,
  Users,
  FileText,
  ArrowLeft,
  Clock
} from 'lucide-react';

interface Feature {
  id: string;
  feature_name: string;
  description: string;
  created_at: string;
  updated_at: string;
  icon?: React.ReactNode;
  background?: string;
}

const FeatureSummary = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch features on mount
  useEffect(() => {
    const fetchFeatures = async () => {
      const { data, error } = await supabase
        .from('project_features')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching features:', error);
        return;
      }

      // Map data to include icons and backgrounds
      const featuresWithUI =
        data?.map((feature) => ({
          ...feature,
          icon: getFeatureIcon(feature.feature_name),
          background: getFeatureBackground(feature.id)
        })) || [];

      setFeatures(featuresWithUI);
      setLoading(false);
    };

    fetchFeatures();
  }, []);

  // Helper function to assign icons based on feature name
  const getFeatureIcon = (name: string) => {
    const normalizedName = name.toLowerCase();
    if (normalizedName.includes('auth'))
      return <Shield className="w-6 h-6" style={{ color: '#000000' }} />;
    if (normalizedName.includes('chat'))
      return <Users className="w-6 h-6" style={{ color: '#000000' }} />;
    if (normalizedName.includes('api'))
      return <Database className="w-6 h-6" style={{ color: '#000000' }} />;
    if (normalizedName.includes('code'))
      return <Code className="w-6 h-6" style={{ color: '#000000' }} />;
    if (normalizedName.includes('monitor'))
      return <Zap className="w-6 h-6" style={{ color: '#000000' }} />;
    if (normalizedName.includes('language'))
      return <Globe className="w-6 h-6" style={{ color: '#000000' }} />;
    if (normalizedName.includes('admin'))
      return <Settings className="w-6 h-6" style={{ color: '#000000' }} />;
    return <FileText className="w-6 h-6" style={{ color: '#000000' }} />;
  };

  // Helper function to assign background gradients
  const getFeatureBackground = (id: string) => {
    const gradients = [
      'linear-gradient(135deg, #D6A99D 0%, #FBF3D5 100%)',
      'linear-gradient(135deg, #FBF3D5 0%, #D6DAC8 100%)',
      'linear-gradient(135deg, #D6DAC8 0%, #9CAFAA 100%)',
      'linear-gradient(135deg, #9CAFAA 0%, #D6A99D 100%)',
      'linear-gradient(135deg, #D6A99D 0%, #D6DAC8 100%)',
      'linear-gradient(135deg, #FBF3D5 0%, #9CAFAA 100%)',
      'linear-gradient(135deg, #D6DAC8 0%, #FBF3D5 100%)',
      'linear-gradient(135deg, #9CAFAA 0%, #FBF3D5 100%)'
    ];
    return gradients[parseInt(id) % gradients.length];
  };

  const mockFeatures: Feature[] = [
    {
      id: '1',
      name: 'User Authentication System',
      description:
        'Complete authentication flow with JWT tokens, password reset, and email verification',
      lastUpdated: 'January 15, 2024',
      icon: <Shield className="w-6 h-6" style={{ color: '#000000' }} />,
      background: 'linear-gradient(135deg, #D6A99D 0%, #FBF3D5 100%)'
    },
    {
      id: '2',
      name: 'Real-time Chat Interface',
      description:
        'WebSocket-based chat system with message history, typing indicators, and file sharing',
      lastUpdated: 'January 20, 2024',
      icon: <Users className="w-6 h-6" style={{ color: '#000000' }} />,
      background: 'linear-gradient(135deg, #FBF3D5 0%, #D6DAC8 100%)'
    },
    {
      id: '3',
      name: 'API Rate Limiting',
      description:
        'Implement rate limiting middleware to prevent API abuse and ensure fair usage',
      lastUpdated: 'January 10, 2024',
      icon: <Database className="w-6 h-6" style={{ color: '#000000' }} />,
      background: 'linear-gradient(135deg, #D6DAC8 0%, #9CAFAA 100%)'
    },
    {
      id: '4',
      name: 'Code Syntax Highlighting',
      description:
        'Advanced syntax highlighting with theme support and language detection',
      lastUpdated: 'January 18, 2024',
      icon: <Code className="w-6 h-6" style={{ color: '#000000' }} />,
      background: 'linear-gradient(135deg, #9CAFAA 0%, #D6A99D 100%)'
    },
    {
      id: '5',
      name: 'Performance Monitoring',
      description:
        'Real-time performance metrics dashboard with alerts and historical data',
      lastUpdated: 'January 5, 2024',
      icon: <Zap className="w-6 h-6" style={{ color: '#000000' }} />,
      background: 'linear-gradient(135deg, #D6A99D 0%, #D6DAC8 100%)'
    },
    {
      id: '6',
      name: 'Multi-language Support',
      description:
        'Internationalization system with dynamic language switching',
      lastUpdated: 'January 8, 2024',
      icon: <Globe className="w-6 h-6" style={{ color: '#000000' }} />,
      background: 'linear-gradient(135deg, #FBF3D5 0%, #9CAFAA 100%)'
    },
    {
      id: '7',
      name: 'Admin Dashboard',
      description:
        'Comprehensive admin panel for user management, analytics, and system configuration',
      lastUpdated: 'January 22, 2024',
      icon: <Settings className="w-6 h-6" style={{ color: '#000000' }} />,
      background: 'linear-gradient(135deg, #D6DAC8 0%, #FBF3D5 100%)'
    },
    {
      id: '8',
      name: 'Documentation System',
      description:
        'Auto-generated API documentation with interactive examples and testing interface',
      lastUpdated: 'January 12, 2024',
      icon: <FileText className="w-6 h-6" style={{ color: '#000000' }} />,
      background: 'linear-gradient(135deg, #9CAFAA 0%, #FBF3D5 100%)'
    }
  ];

  const filteredFeatures = features.filter((feature) => {
    const matchesSearch =
      feature.feature_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (feature.description || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleBack = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#000000' }}>
      {/* Header */}
      <div
        className="px-6 py-10"
        style={{ backgroundColor: '#000000', borderColor: '#A2D5C6' }}
      >
        <div className="w-full px-4">
          <div className="flex items-center justify-between w-full">
            {/* Left side - Back button and title */}
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-white hover:text-opacity-80 transition-colors"
                tabIndex={0}
                aria-label="Go back to main app"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to DevTwin
              </Button>

              <div>
                <h1 className="text-2xl font-bold text-white">
                  Feature Summary
                </h1>
                <p style={{ color: '#A2D5C6' }}>
                  Overview of all project features and their current status
                </p>
              </div>
            </div>

            {/* Right side - Search and count */}
            <div className="flex items-center space-x-4">
              {/* Compact Search */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  style={{ color: '#A2D5C6' }}
                />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 border-2 focus:ring-2 focus:ring-opacity-20 bg-gray-800 text-white placeholder-gray-400"
                  style={
                    {
                      borderColor: '#A2D5C6',
                      '--tw-ring-color': '#A2D5C6'
                    } as React.CSSProperties
                  }
                  tabIndex={0}
                  aria-label="Search features"
                />
              </div>

              {/* Feature count */}
              <div
                className="text-sm whitespace-nowrap"
                style={{ color: '#A2D5C6' }}
              >
                {filteredFeatures.length} of {features.length} features
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-2">
              {filteredFeatures.map((feature) => (
                <Card
                  key={feature.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 p-6 relative cursor-pointer"
                  style={{ background: feature.background }}
                  onClick={() => navigate(`/features/${feature.id}`)}
                >
                  {/* Icon */}
                  <div className="absolute top-4 right-4">{feature.icon}</div>

                  {/* Content */}
                  <div className="pr-12">
                    <h3
                      className="font-bold text-lg mb-4 leading-tight"
                      style={{ color: '#000000' }}
                    >
                      {feature.feature_name}
                    </h3>

                    <p
                      className="text-sm leading-relaxed mb-4"
                      style={{ color: '#000000' }}
                    >
                      {feature.description}
                    </p>

                    {/* Updated Date */}
                    <div
                      className="flex items-center text-xs"
                      style={{ color: '#000000', opacity: 0.7 }}
                    >
                      <Clock
                        className="w-3 h-3 mr-1"
                        style={{ color: '#000000', opacity: 0.7 }}
                      />
                      Updated{' '}
                      {new Date(feature.updated_at).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default FeatureSummary;
