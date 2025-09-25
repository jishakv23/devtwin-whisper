import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  ExternalLink,
  Github,
  FileText,
  Mic,
  Palette
} from 'lucide-react';

const AddFeature = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    links: {
      figma: '',
      github: '',
      notion: '',
      fireflies: ''
    }
  });

  const handleBack = () => {
    navigate('/features');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLinkChange = (linkType: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      links: {
        ...prev.links,
        [linkType]: value
      }
    }));
  };

  const handleSave = () => {
    // Here you would typically save the feature data
    console.log('Saving feature:', formData);
    // Navigate back to features list
    navigate('/features');
  };

  const linkFields = [
    {
      key: 'figma',
      label: 'Figma Design',
      placeholder: 'https://figma.com/file/...',
      icon: <Palette className="w-4 h-4" style={{ color: '#A2D5C6' }} />
    },
    {
      key: 'github',
      label: 'GitHub Repository',
      placeholder: 'https://github.com/username/repo',
      icon: <Github className="w-4 h-4" style={{ color: '#A2D5C6' }} />
    },
    {
      key: 'notion',
      label: 'Notion Documentation',
      placeholder: 'https://notion.so/...',
      icon: <FileText className="w-4 h-4" style={{ color: '#A2D5C6' }} />
    },
    {
      key: 'fireflies',
      label: 'Fireflies Meeting Minutes',
      placeholder: 'https://fireflies.ai/...',
      icon: <Mic className="w-4 h-4" style={{ color: '#A2D5C6' }} />
    }
  ];

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
                aria-label="Go back to feature summary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Features
              </Button>

              <div>
                <h1 className="text-2xl font-bold text-white">
                  Add New Feature
                </h1>
                <p style={{ color: '#A2D5C6' }}>
                  Create a new feature with details and resource links
                </p>
              </div>
            </div>

            {/* Right side - Save button */}
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6"
              tabIndex={0}
              aria-label="Save new feature"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Feature
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <Card
              className="p-6"
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #A2D5C6'
              }}
            >
              <h2 className="text-xl font-semibold text-white mb-6">
                Basic Information
              </h2>

              <div className="space-y-6">
                {/* Feature Name */}
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-white mb-2 block"
                  >
                    Feature Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter feature name..."
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-gray-800 border-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-opacity-20"
                    style={
                      {
                        borderColor: '#A2D5C6',
                        '--tw-ring-color': '#A2D5C6'
                      } as React.CSSProperties
                    }
                    tabIndex={0}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-white mb-2 block"
                  >
                    Brief Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this feature does and its purpose..."
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange('description', e.target.value)
                    }
                    className="bg-gray-800 border-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-opacity-20 min-h-32 resize-none"
                    style={
                      {
                        borderColor: '#A2D5C6',
                        '--tw-ring-color': '#A2D5C6'
                      } as React.CSSProperties
                    }
                    tabIndex={0}
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Resource Links */}
            <Card
              className="p-6"
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #A2D5C6'
              }}
            >
              <h2 className="text-xl font-semibold text-white mb-6">
                Resource Links
              </h2>

              <div className="space-y-6">
                {linkFields.map((field) => (
                  <div key={field.key}>
                    <Label
                      htmlFor={field.key}
                      className="text-sm font-medium text-white mb-2 flex items-center"
                    >
                      {field.icon}
                      <span className="ml-2">{field.label}</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id={field.key}
                        placeholder={field.placeholder}
                        value={
                          formData.links[
                            field.key as keyof typeof formData.links
                          ]
                        }
                        onChange={(e) =>
                          handleLinkChange(field.key, e.target.value)
                        }
                        className="bg-gray-800 border-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-opacity-20 pr-10"
                        style={
                          {
                            borderColor: '#A2D5C6',
                            '--tw-ring-color': '#A2D5C6'
                          } as React.CSSProperties
                        }
                        tabIndex={0}
                      />
                      <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Preview Section */}
          <Card
            className="mt-8 p-6"
            style={{ backgroundColor: '#1a1a1a', border: '1px solid #A2D5C6' }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">Preview</h2>

            {formData.name || formData.description ? (
              <div
                className="relative p-6 rounded-lg"
                style={{
                  background:
                    'linear-gradient(135deg, #D6A99D 0%, #FBF3D5 100%)'
                }}
              >
                <div className="absolute top-4 right-4">
                  <FileText className="w-6 h-6" style={{ color: '#000000' }} />
                </div>

                <div className="pr-12">
                  <h3
                    className="font-bold text-lg mb-4 leading-tight"
                    style={{ color: '#000000' }}
                  >
                    {formData.name || 'Feature Name'}
                  </h3>

                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: '#000000' }}
                  >
                    {formData.description ||
                      'Feature description will appear here...'}
                  </p>

                  <div
                    className="flex items-center text-xs"
                    style={{ color: '#000000', opacity: 0.7 }}
                  >
                    <span>Updated just now</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12" style={{ color: '#A2D5C6' }}>
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>
                  Fill in the basic information to see a preview of your feature
                  card
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddFeature;
