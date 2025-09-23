"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, Maximize2, Check, ArrowRight, ArrowLeft, Play, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const metadata = {
  title: "Interactive Prototype Research",
  description: "Experience our interactive learning app prototype and share your valuable feedback through our comprehensive user research survey.",
  openGraph: {
    title: "Interactive Prototype Research - Survey Question Platform",
    description: "Participate in cutting-edge user experience research. Test interactive prototypes and help shape the future of digital products.",
    images: ["/og-prototype.png"],
  },
  twitter: {
    title: "Interactive Prototype Research",
    description: "Experience interactive prototypes and share your UX insights",
  },
};

export default function PrototypePage() {
  const [currentStep, setCurrentStep] = useState(0); // 0: intro, 1: prototype, 2: survey
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [hasExperienced, setHasExperienced] = useState(false);
  const [prototypeMinimized, setPrototypeMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const figmaUrl = "https://www.figma.com/proto/Cogsoy1LFtPZq0EHKwX9mi/learning-app?content-scaling=fixed&kind=proto&node-id=217-6764&page-id=217%3A6636&scaling=fixed&starting-point-node-id=217%3A6764";

  const questions = [
    {
      id: 1,
      text: "How would you rate the overall user experience of this learning application?",
      options: [
        { id: "excellent", text: "Excellent - Smooth and intuitive" },
        { id: "good", text: "Good - Minor improvements needed" },
        { id: "average", text: "Average - Needs optimization" }
      ]
    },
    {
      id: 2,
      text: "How intuitive did you find the navigation and user interface?",
      options: [
        { id: "very-intuitive", text: "Very intuitive - Easy to understand" },
        { id: "somewhat-intuitive", text: "Somewhat intuitive - Minor confusion" },
        { id: "not-intuitive", text: "Not intuitive - Difficult to navigate" }
      ]
    },
    {
      id: 3,
      text: "Would you recommend this learning app to others?",
      options: [
        { id: "definitely", text: "Definitely - Great experience" },
        { id: "probably", text: "Probably - Good with improvements" },
        { id: "unlikely", text: "Unlikely - Needs major changes" }
      ]
    }
  ];

  const steps = [
    { title: "Welcome", desc: "Learn about the process" },
    { title: "Experience", desc: "Try the interactive prototype" },
    { title: "Survey", desc: "Share your feedback" }
  ];

  const handleFullscreen = () => {
    const iframe = document.getElementById("figma-prototype") as HTMLIFrameElement;
    if (iframe?.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  const handleStartExperience = () => {
    setCurrentStep(1);
    setHasExperienced(true);
  };

  const handleContinueToSurvey = () => {
    setCurrentStep(2);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestion?.id] || "";
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const answeredQuestions = Object.keys(answers).length;
  const allQuestionsAnswered = answeredQuestions === questions.length;

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!allQuestionsAnswered) return;

    setIsSubmitted(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
      setIsSubmitted(false);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setCurrentStep(0);
      setHasExperienced(false);
    }, 3000);
  };

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto advance to survey if user has experienced prototype
  useEffect(() => {
    if (currentStep === 1 && hasExperienced) {
      const timer = setTimeout(() => {
        if (currentStep === 1) {
          setPrototypeMinimized(true);
        }
      }, 10000); // Show option to continue after 10 seconds
      return () => clearTimeout(timer);
    }
  }, [currentStep, hasExperienced]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Fixed Header with Progress */}
      <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b z-40">
        <div className="px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <Progress value={(currentStep / 2) * 100} className="h-1.5 mb-3" />
            <div className="flex justify-between text-xs">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center transition-colors ${
                    index <= currentStep ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                    index < currentStep ? "bg-primary text-primary-foreground" :
                    index === currentStep ? "bg-primary/20 text-primary border-2 border-primary" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {index < currentStep ? <Check className="w-3 h-3" /> : index + 1}
                  </div>
                  <span className="font-medium">{step.title}</span>
                  <span className="text-muted-foreground hidden sm:block">{step.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4"
            >
              <Card className="max-w-2xl w-full text-center shadow-xl border-2">
                <CardContent className="p-6 lg:p-8 space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mx-auto"
                  >
                    <Play className="w-6 h-6 text-primary-foreground" />
                  </motion.div>
                  <div className="space-y-3">
                    <h1 className="text-2xl lg:text-3xl font-bold">Interactive Prototype Research</h1>
                    <p className="text-muted-foreground text-base leading-relaxed max-w-xl mx-auto">
                      Welcome to our user experience research! You&apos;ll experience an interactive learning app prototype and then share your feedback.
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-left space-y-2 max-w-md mx-auto">
                    <p className="font-medium text-base flex items-center gap-2">
                      <span className="text-lg">📋</span> Research Process:
                    </p>
                    <div className="space-y-1.5 text-sm">
                      <p className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold">1</span>
                        Experience interactive prototype (2-3 minutes)
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold">2</span>
                        Answer simple questions (1 minute)
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold">3</span>
                        Complete research
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleStartExperience}
                    className="w-full max-w-sm mx-auto h-11 text-base font-medium"
                    size="default"
                  >
                    Start Experience
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 1: Prototype Experience */}
          {currentStep === 1 && (
            <motion.div
              key="prototype"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="px-4"
            >
              {/* Desktop Layout - Side by side */}
              <div className="hidden lg:flex max-w-7xl mx-auto gap-6 h-[calc(100vh-6rem)] p-6">
                {/* Prototype Section */}
                <Card className="flex-1 overflow-hidden shadow-xl border-2 flex flex-col">
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h2 className="text-lg font-bold">Learning App Interactive Prototype</h2>
                        <p className="text-xs text-muted-foreground">Explore all features and interactions</p>
                      </div>
                      <div className="flex gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleFullscreen}
                          className="flex items-center gap-1.5 transition-all hover:scale-105 h-8 px-3 text-xs"
                        >
                          <Maximize2 className="h-3 w-3" />
                          Fullscreen
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="transition-all hover:scale-105 h-8 px-3 text-xs"
                        >
                          <a
                            href={figmaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Open in Figma
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-0 flex-1">
                    <div className="relative h-full">
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/95 z-10">
                          <div className="text-center space-y-4">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
                            <p className="text-sm text-muted-foreground">Loading interactive prototype...</p>
                          </div>
                        </div>
                      )}
                      <iframe
                        id="figma-prototype"
                        src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(figmaUrl)}`}
                        className="w-full h-full transition-opacity duration-500"
                        allowFullScreen
                        loading="lazy"
                        onLoad={() => setIsLoading(false)}
                        title="Learning App Prototype"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Survey Panel */}
                <Card className="w-72 shadow-xl border-2 bg-gradient-to-b from-background to-muted/10 flex flex-col">
                  <CardContent className="p-3 space-y-3 flex-1 flex flex-col overflow-hidden">
                    {/* Progress & Header */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold">Survey</h3>
                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                          {answeredQuestions}/{questions.length}
                        </span>
                      </div>
                      <Progress value={(answeredQuestions / questions.length) * 100} className="h-1.5" />
                    </div>

                    {/* Current Question */}
                    <div className="flex-1 space-y-3 min-h-0 overflow-y-auto">
                      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-2.5 border border-primary/20">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                            {currentQuestionIndex + 1}
                          </span>
                          <span className="text-xs font-medium text-primary">Question {currentQuestionIndex + 1}</span>
                        </div>
                        <p className="text-xs font-medium leading-relaxed">{currentQuestion?.text}</p>
                      </div>

                      <RadioGroup value={selectedAnswer} onValueChange={handleAnswerChange}>
                        <div className="space-y-1.5">
                          {currentQuestion?.options.map((option, index) => (
                            <motion.div
                              key={option.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Label
                                htmlFor={option.id}
                                className={`flex items-start space-x-1.5 p-2 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-muted/50 text-xs ${
                                  selectedAnswer === option.id
                                    ? "border-primary bg-primary/5 shadow-sm"
                                    : "border-border hover:border-primary/50"
                                }`}
                              >
                                <RadioGroupItem
                                  value={option.id}
                                  id={option.id}
                                  className="mt-0.5 w-3 h-3"
                                />
                                <span className="leading-relaxed">{option.text}</span>
                              </Label>
                            </motion.div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-2">
                      <div className="flex gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePrevQuestion}
                          disabled={currentQuestionIndex === 0}
                          className="flex-1 h-8 text-xs"
                        >
                          <ArrowLeft className="w-3 h-3 mr-1" />
                          Previous
                        </Button>
                        {!isLastQuestion ? (
                          <Button
                            size="sm"
                            onClick={handleNextQuestion}
                            disabled={!selectedAnswer}
                            className="flex-1 h-8 text-xs"
                          >
                            Next
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={handleSubmit}
                            disabled={!allQuestionsAnswered || isSubmitted}
                            className="flex-1 h-8 text-xs"
                          >
                            {isSubmitted ? (
                              <>
                                <Check className="w-3 h-3 mr-1" />
                                Submitting...
                              </>
                            ) : (
                              "Submit"
                            )}
                          </Button>
                        )}
                      </div>

                      {!allQuestionsAnswered && (
                        <p className="text-xs text-muted-foreground text-center">
                          Answer all questions to submit
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden max-w-6xl mx-auto space-y-4">
                {/* Prototype Card */}
                <Card className={`overflow-hidden shadow-xl border-2 transition-all duration-500 ${
                  prototypeMinimized ? "h-32" : ""
                }`}>
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h2 className="text-base font-bold">Learning App Prototype</h2>
                        <p className="text-xs text-muted-foreground">Explore all features</p>
                      </div>
                      <div className="flex gap-1.5">
                        {prototypeMinimized && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPrototypeMinimized(false)}
                            className="flex items-center gap-1.5 h-8 px-3 text-xs"
                          >
                            <ChevronUp className="h-3 w-3" />
                            Expand
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleFullscreen}
                          className="flex items-center gap-1.5 transition-all hover:scale-105 h-8 px-3"
                        >
                          <Maximize2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="transition-all hover:scale-105 h-8 px-3"
                        >
                          <a
                            href={figmaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-0">
                    <div className={`relative transition-all duration-500 ${
                      prototypeMinimized ? "h-0 overflow-hidden" : "h-[70vh]"
                    }`}>
                      {isLoading && !prototypeMinimized && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/95 z-10">
                          <div className="text-center space-y-4">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
                            <p className="text-sm text-muted-foreground">Loading interactive prototype...</p>
                          </div>
                        </div>
                      )}
                      <iframe
                        id="figma-prototype"
                        src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(figmaUrl)}`}
                        className="w-full h-full transition-opacity duration-500"
                        allowFullScreen
                        loading="lazy"
                        onLoad={() => setIsLoading(false)}
                        title="Learning App Prototype"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Continue Button - Shows after minimized or immediately on mobile */}
                <AnimatePresence>
                  {(prototypeMinimized || isMobile) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      className="sticky bottom-4 z-30"
                    >
                      <Card className="shadow-xl border-2 border-primary/20 bg-gradient-to-r from-background to-primary/5">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="space-y-0.5">
                              <p className="font-medium text-sm">Finished exploring?</p>
                              <p className="text-xs text-muted-foreground">Continue to answer a few simple questions</p>
                            </div>
                            <Button
                              onClick={handleContinueToSurvey}
                              className="shrink-0 h-9 px-4 text-sm"
                            >
                              Continue Survey
                              <ArrowRight className="w-3 h-3 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Step 2: Survey */}
          {currentStep === 2 && (
            <motion.div
              key="survey"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4"
            >
              <Card className="max-w-3xl w-full shadow-xl border-2">
                <CardContent className="p-6 lg:p-10 space-y-8">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-white font-bold text-lg">?</span>
                    </div>
                    <h2 className="text-2xl font-bold">User Experience Feedback</h2>
                    <p className="text-muted-foreground text-base">Your opinion is very important to us</p>
                  </div>

                  <div className="space-y-6">
                    {/* Progress */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Question {currentQuestionIndex + 1} of {questions.length}</span>
                        <span className="text-xs text-muted-foreground">{answeredQuestions}/{questions.length} answered</span>
                      </div>
                      <Progress value={(answeredQuestions / questions.length) * 100} className="h-1.5" />
                    </div>

                    <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/20">
                      <p className="text-base font-medium leading-relaxed text-center">{currentQuestion?.text}</p>
                    </div>

                    <RadioGroup value={selectedAnswer} onValueChange={handleAnswerChange}>
                      <div className="space-y-4">
                        {currentQuestion?.options.map((option, index) => (
                          <motion.div
                            key={option.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + index * 0.1 }}
                            className="group"
                          >
                            <Label
                              htmlFor={option.id}
                              className={`flex items-start space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:bg-muted/50 hover:scale-[1.01] ${
                                selectedAnswer === option.id
                                  ? "border-primary bg-primary/5 shadow-lg scale-[1.01]"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <RadioGroupItem
                                value={option.id}
                                id={option.id}
                                className="mt-0.5 transition-all duration-200 w-4 h-4"
                              />
                              <span className="text-sm leading-relaxed group-hover:text-foreground transition-colors">
                                {option.text}
                              </span>
                            </Label>
                          </motion.div>
                        ))}
                      </div>
                    </RadioGroup>

                    <div className="flex gap-4 pt-6">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="flex items-center gap-2 h-9 px-4 text-sm"
                      >
                        <ArrowLeft className="h-3 w-3" />
                        Back to Experience
                      </Button>

                      <div className="flex-1 flex gap-2">
                        <Button
                          variant="outline"
                          onClick={handlePrevQuestion}
                          disabled={currentQuestionIndex === 0}
                          className="flex items-center gap-2 h-9 text-sm"
                        >
                          <ArrowLeft className="h-3 w-3" />
                          Previous
                        </Button>

                        {!isLastQuestion ? (
                          <Button
                            onClick={handleNextQuestion}
                            disabled={!selectedAnswer}
                            className="flex-1 h-9 text-sm font-medium"
                          >
                            Next Question
                            <ArrowRight className="h-3 w-3 ml-2" />
                          </Button>
                        ) : (
                          <Button
                            onClick={handleSubmit}
                            disabled={!allQuestionsAnswered || isSubmitted}
                            className="flex-1 h-9 text-sm font-medium transition-all duration-200 hover:scale-[1.02] disabled:scale-100"
                          >
                            {isSubmitted ? (
                              <motion.div
                                className="flex items-center gap-2"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                <Check className="h-4 w-4" />
                                Submitting...
                              </motion.div>
                            ) : (
                              "Submit All Answers"
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {!allQuestionsAnswered && (
                      <p className="text-xs text-muted-foreground text-center bg-muted/50 rounded-lg p-2">
                        Please answer all {questions.length} questions to submit your feedback
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Thank You Overlay */}
      <AnimatePresence>
        {showThankYou && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="text-center space-y-8 max-w-lg"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-28 h-28 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl"
              >
                <Check className="h-14 w-14 text-white" />
              </motion.div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Thank You for Participating!</h3>
                <p className="text-muted-foreground text-base leading-relaxed">Your valuable feedback will help us improve our product</p>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3"
              >
                The page will automatically reset in a few seconds...
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}