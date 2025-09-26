import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  FileText,
  Mic,
  Palette,
  Paperclip,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Upload,
  X
} from 'lucide-react';

interface Feature {
  id: string;
  feature_name: string;
  feature_description: string;
  created_at: string;
  updated_at: string;
  links: {
    figma?: string;
    github?: string;
    notion?: string;
    fireflies?: string;
  };
  summary?: string;
  files?: string[]; // Array of file URLs
  questions?: { 
    questions: (string | { question: string; answer?: string })[]
  };
}

interface Question {
  id: string;
  question: string;
  context?: string;
  answered: boolean;
  answer?: string;
}

const FeatureDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newInput, setNewInput] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [questionAnswer, setQuestionAnswer] = useState('');

  const [feature, setFeature] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch feature data
  useEffect(() => {
    const fetchFeature = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('project_features')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching feature:', error);
        setError('Failed to load feature details');
        setLoading(false);
        return;
      }

      if (data) {
        setFeature({
          ...data,
          links: {
            figma: data.figma_link || undefined,
            notion: data.notion_link || undefined
          },
          files: data.files || []
        });
      }
      setLoading(false);
    };

    fetchFeature();
  }, [id]);

  const handleBack = () => {
    navigate('/features');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => {
      const validTypes = [
        'image/jpeg',
        'image/png',
        'text/markdown',
        'text/plain',
        'application/pdf'
      ];
      const validExtensions = ['.jpg', '.jpeg', '.png', '.md', '.txt', '.pdf'];
      const hasValidType = validTypes.includes(file.type);
      const hasValidExtension = validExtensions.some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      );
      return hasValidType || hasValidExtension;
    });

    setAttachments((prev) => [...prev, ...validFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitInput = async () => {
    if (!newInput.trim() && attachments.length === 0) return;

    try {
      const fileUrls: string[] = [];
      
      // Upload files to Supabase Storage if there are any
      if (attachments.length > 0) {
        for (const file of attachments) {
          // Create a unique filename with timestamp
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `features/${id}/${fileName}`;
          
          // Upload file to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('docs')
            .upload(filePath, file);

          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            continue; // Skip this file and continue with others
          }

          // Get the public URL for the uploaded file
          const { data: urlData } = supabase.storage
            .from('docs')
            .getPublicUrl(filePath);

          if (urlData?.publicUrl) {
            fileUrls.push(urlData.publicUrl);
          }
        }
      }

      // Get current feature data to update the files array
      const { data: currentFeature, error: fetchError } = await supabase
        .from('project_features')
        .select('files')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching current feature:', fetchError);
        return;
      }

      // Update the files array with new URLs
      const existingFiles = currentFeature.files || [];
      const updatedFiles = [...existingFiles, ...fileUrls];

      // Update the feature in Supabase with new files and input text
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      // Add files if there are any
      if (fileUrls.length > 0) {
        updateData.files = updatedFiles;
      }

      // Add input text to summary or create a new field for additional notes
      if (newInput.trim()) {
        const currentSummary = feature?.summary || '';
        updateData.summary = currentSummary + (currentSummary ? '\n\n' : '') + `Additional Notes: ${newInput.trim()}`;
      }

      const { error: updateError } = await supabase
        .from('project_features')
        .update(updateData)
        .eq('id', id);

      if (updateError) {
        console.error('Error updating feature:', updateError);
        return;
      }

      console.log('Files and input submitted successfully');
      
      // Update local state
      setFeature(prev => prev ? {
        ...prev,
        files: updatedFiles,
        summary: updateData.summary || prev.summary
      } : null);

      // Reset form
      setNewInput('');
      setAttachments([]);
      
    } catch (error) {
      console.error('Unexpected error submitting files and input:', error);
    }
  };

  const handleQuestionClick = (questionId: string) => {
    setSelectedQuestion(questionId);
    const question = feature?.questions?.questions.find(
      (q) => q === questionId
    );
  };

  const handleSubmitAnswer = async () => {
    if (!selectedQuestion || !questionAnswer.trim() || !id) return;

    try {
      // Get the current feature data to update the questions object
      const { data: currentFeature, error: fetchError } = await supabase
        .from('project_features')
        .select('questions')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching current feature:', fetchError);
        return;
      }

      // Update the questions object to add the answer for the selected question
      const updatedQuestions = {
        ...currentFeature.questions,
        questions: currentFeature.questions.questions.map((question: string) => {
          if (question === selectedQuestion) {
            // Add answer property to the question
            return {
              question: question,
              answer: questionAnswer.trim()
            };
          }
          return question;
        })
      };

      // Update the feature in Supabase
      const { error: updateError } = await supabase
        .from('project_features')
        .update({ 
          questions: updatedQuestions,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating feature:', updateError);
        return;
      }

      console.log('Answer submitted successfully');
      
      // Update the local state to reflect the changes
      setFeature(prev => prev ? {
        ...prev,
        questions: updatedQuestions
      } : null);

      // Clear the form
      setSelectedQuestion(null);
      setQuestionAnswer('');
      
    } catch (error) {
      console.error('Unexpected error submitting answer:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const linkIcons = {
    figma: <Palette className="w-4 h-4" />,
    github: <Github className="w-4 h-4" />,
    notion: <FileText className="w-4 h-4" />,
    fireflies: <Mic className="w-4 h-4" />
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
                aria-label="Go back to features"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Features
              </Button>

              <div>
                <h1 className="text-2xl font-bold text-white">
                  {feature?.feature_name || 'Loading...'}
                </h1>
                <p style={{ color: '#A2D5C6' }}>Feature details and analysis</p>
              </div>
            </div>

            {/* Right side - Last updated */}
            <div className="flex items-center space-x-4">
              {feature && (
                <span className="text-sm" style={{ color: '#A2D5C6' }}>
                  Last updated{' '}
                  {new Date(feature.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Summary and Links */}
            <div className="lg:col-span-2 space-y-6">
              {/* Summary Data */}
              <Card
                className="p-6"
                style={{
                  backgroundColor: '#1a1a1a'
                }}
              >
                <h2 className="text-xl font-semibold text-white mb-4">
                  Summary
                </h2>
                <div className="space-y-4">
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: '#A2D5C6' }}
                  >
                    {feature?.summary || 'Loading...'}
                  </p>
                  <p className="text-xs" style={{ color: '#A2D5C6' }}>
                    Created on{' '}
                    {feature
                      ? new Date(feature.created_at).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }
                        )
                      : 'Loading...'}
                  </p>
                </div>
              </Card>

              {/* Reference Links */}
              <Card
                className="p-6"
                style={{
                  backgroundColor: '#1a1a1a'
                }}
              >
                <h2 className="text-xl font-semibold text-white mb-4">
                  Reference Links
                </h2>
                <div className="space-y-3">
                  {feature?.links ? (
                    Object.entries(feature.links).map(([key, url]) =>
                      url ? (
                        <div
                          key={key}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-800"
                        >
                          <div className="flex items-center space-x-3">
                            <div style={{ color: '#A2D5C6' }}>
                              {linkIcons[key as keyof typeof linkIcons]}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white capitalize">
                                {key === 'fireflies'
                                  ? 'Fireflies Minutes'
                                  : key}
                              </p>
                              <p className="text-xs text-gray-400 truncate max-w-xs">
                                {url}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              window.open(url, '_blank', 'noopener,noreferrer')
                            }
                            className="text-white hover:text-opacity-80"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : null
                    )
                  ) : (
                    <p className="text-sm text-gray-400">Loading links...</p>
                  )}
                </div>
              </Card>

              {/* Uploaded Files Section */}
              {feature?.files && feature.files.length > 0 && (
                <Card
                  className="p-6"
                  style={{
                    backgroundColor: '#1a1a1a'
                  }}
                >
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Uploaded Files
                  </h2>
                  <div className="space-y-3">
                    {feature.files.map((fileUrl, index) => {
                      const fileName = fileUrl.split('/').pop() || `File ${index + 1}`;
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-800"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-4 h-4" style={{ color: '#A2D5C6' }} />
                            <div>
                              <p className="text-sm font-medium text-white">
                                {fileName}
                              </p>
                              <p className="text-xs text-gray-400 truncate max-w-xs">
                                {fileUrl}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              window.open(fileUrl, '_blank', 'noopener,noreferrer')
                            }
                            className="text-white hover:text-opacity-80"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

              {/* Add More Data Section */}
              <Card
                className="p-6"
                style={{
                  backgroundColor: '#1a1a1a'
                }}
              >
                <h2 className="text-xl font-semibold text-white mb-4">
                  Add More Information
                </h2>

                <div className="space-y-4">
                  <Textarea
                    placeholder="Add additional context, notes, or updates about this feature..."
                    value={newInput}
                    onChange={(e) => setNewInput(e.target.value)}
                    className="bg-gray-800 border-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-opacity-20 min-h-32 resize-none"
                    style={
                      {
                        borderColor: '#A2D5C6',
                        '--tw-ring-color': '#A2D5C6'
                      } as React.CSSProperties
                    }
                  />

                  {/* Attachments */}
                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white">
                        Attachments:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-md"
                          >
                            <span className="text-xs text-white truncate max-w-32">
                              {file.name}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                              className="p-0 h-4 w-4 text-gray-400 hover:text-white"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        id="file-upload"
                        multiple
                        accept=".jpg,.jpeg,.png,.md,.txt,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById('file-upload')?.click()
                        }
                        className="text-white border-gray-600 hover:bg-gray-700"
                      >
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attach Files
                      </Button>
                      <span className="text-xs text-gray-400">
                        JPG, PNG, PDF, MD files supported
                      </span>
                    </div>

                    <Button
                      onClick={handleSubmitInput}
                      disabled={!newInput.trim() && attachments.length === 0}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Questions */}
            <div className="space-y-6">
              <Card
                className="p-6"
                style={{
                  backgroundColor: '#1a1a1a'
                }}
              >
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <HelpCircle
                    className="w-5 h-5 mr-2"
                    style={{ color: '#A2D5C6' }}
                  />
                  Analysis Questions
                </h2>
                <p className="text-sm mb-6" style={{ color: '#A2D5C6' }}>
                  AI-identified gaps and questions based on your PRD, commits,
                  and documentation.
                </p>

                {/* Show answered questions count */}
                {feature?.questions.questions.some(q => typeof q === 'object' && q.answer && q.answer.trim()) && (
                  <div className="mb-4 p-3 bg-green-900/20 border border-green-600 rounded-lg">
                    <p className="text-sm text-green-400">
                      ✅ {feature.questions.questions.filter(q => typeof q === 'object' && q.answer && q.answer.trim()).length} question(s) answered
                    </p>
                  </div>
                )}

                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {feature?.questions.questions.map((question, index) => {
                      // Handle both string questions and question objects
                      const questionText = typeof question === 'string' ? question : question.question;
                      const questionAnswer = typeof question === 'object' ? question.answer : null;
                      const hasAnswer = questionAnswer && questionAnswer.trim();
                      
                      return (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            hasAnswer
                              ? 'bg-green-900/20 border-green-600'
                              : selectedQuestion === questionText
                              ? 'bg-blue-900/20 border-blue-600'
                              : 'bg-gray-800 border-gray-600 hover:border-gray-500'
                          }`}
                          onClick={() => handleQuestionClick(questionText)}
                        >
                          <h3 className="text-sm font-medium text-white mb-2">
                            {questionText}
                          </h3>

                          {hasAnswer && (
                            <div className="mt-3 p-3 bg-gray-700/50 rounded border-l-2 border-green-500">
                              <p className="text-xs text-white">
                                <strong>Answer:</strong> {questionAnswer}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>

                {/* Answer Input */}
                {selectedQuestion && (
                  <div
                    className="mt-6 p-4 bg-gray-800 rounded-lg border"
                    style={{ borderColor: '#A2D5C6' }}
                  >
                    <h3 className="text-sm font-medium text-white mb-3">
                      Answer Question
                    </h3>
                    <Textarea
                      placeholder="Provide your answer to help fill this gap..."
                      value={questionAnswer}
                      onChange={(e) => setQuestionAnswer(e.target.value)}
                      className="bg-gray-700 border-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-opacity-20 mb-3"
                      style={
                        {
                          borderColor: '#A2D5C6',
                          '--tw-ring-color': '#A2D5C6'
                        } as React.CSSProperties
                      }
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={!questionAnswer.trim()}
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Submit Answer
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedQuestion(null);
                          setQuestionAnswer('');
                        }}
                        variant="outline"
                        size="sm"
                        className="text-black hover:text-white border-gray-600 hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureDetail;
