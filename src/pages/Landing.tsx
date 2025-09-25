import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Brain, MessageSquare } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/sign-in');
  };

  const handleSignUp = () => {
    navigate('/sign-up');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F6F6F6' }}>
      <div className="flex min-h-screen">
        {/* Left Designer Side */}
        <div
          className="flex-1 relative overflow-hidden"
          style={{ backgroundColor: '#000000' }}
        >
          {/* Abstract Background Elements */}
          <div className="absolute inset-0">
            {/* Floating geometric shapes with color scheme */}
            <div
              className="absolute top-20 left-20 w-32 h-32 rounded-full blur-xl animate-pulse"
              style={{ backgroundColor: '#CFFFE2', opacity: 0.3 }}
            ></div>
            <div
              className="absolute top-40 right-32 w-24 h-24 rounded-lg rotate-45 animate-bounce"
              style={{ backgroundColor: '#A2D5C6', opacity: 0.4 }}
            ></div>
            <div
              className="absolute bottom-32 left-16 w-40 h-40 rounded-full animate-pulse delay-1000"
              style={{ backgroundColor: '#CFFFE2', opacity: 0.2 }}
            ></div>
            <div
              className="absolute bottom-20 right-20 w-28 h-28 rounded-lg rotate-12 animate-bounce delay-500"
              style={{ backgroundColor: '#F6F6F6', opacity: 0.1 }}
            ></div>

            {/* Gradient overlays */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-black/5 to-black/20"></div>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center h-full px-12 text-white">
            <div className="max-w-md text-center space-y-8">
              {/* Logo/Icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div
                    className="w-20 h-20 rounded-2xl backdrop-blur-sm flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(207, 255, 226, 0.2)' }}
                  >
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#CFFFE2' }}
                  >
                    <Sparkles
                      className="w-3 h-3"
                      style={{ color: '#000000' }}
                    />
                  </div>
                </div>
              </div>

              {/* Main heading */}
              <div className="space-y-4">
                <h1 className="text-4xl font-bold leading-tight">
                  Welcome to
                  <span className="block text-5xl" style={{ color: '#CFFFE2' }}>
                    DevTwin
                  </span>
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  Your intelligent coding companion powered by advanced AI
                </p>
              </div>

              {/* Feature highlights */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-white/80">
                  <MessageSquare
                    className="w-5 h-5"
                    style={{ color: '#A2D5C6' }}
                  />
                  <span>Interactive chat interface</span>
                </div>
                <div className="flex items-center space-x-3 text-white/80">
                  <Brain className="w-5 h-5" style={{ color: '#F6F6F6' }} />
                  <span>Smart code understanding</span>
                </div>
              </div>

              {/* Decorative elements */}
              {/* <div className="flex justify-center space-x-2 pt-4">
                <div className="w-2 h-2 bg-white/40 rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-white/40 rounded-full animate-ping delay-150"></div>
                <div className="w-2 h-2 bg-white/40 rounded-full animate-ping delay-300"></div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Right Content Side */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold" style={{ color: '#000000' }}>
                Get Started
              </h2>
              {/* <p style={{ color: '#A2D5C6' }}>
                Join thousands of developers using DevTwin to accelerate their
                coding workflow
              </p> */}
            </div>

            {/* Auth buttons */}
            <div className="space-y-4">
              <Button
                onClick={handleSignUp}
                className="w-full h-12 text-base font-medium text-white"
                style={{ backgroundColor: '#000000' }}
                tabIndex={0}
                aria-label="Create new account"
              >
                Create Account
              </Button>

              <Button
                onClick={handleSignIn}
                variant="outline"
                className="w-full h-12 text-base font-medium"
                style={{
                  borderColor: '#A2D5C6',
                  color: '#000000',
                  backgroundColor: 'transparent'
                }}
                tabIndex={0}
                aria-label="Sign in to existing account"
              >
                Sign In
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center text-sm" style={{ color: '#A2D5C6' }}>
              By continuing, you agree to our{' '}
              <button
                className="underline"
                style={{ color: '#000000' }}
                tabIndex={0}
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                className="underline"
                style={{ color: '#000000' }}
                tabIndex={0}
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
