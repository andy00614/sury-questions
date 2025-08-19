"use client";

import { useState } from "react";
import SurveyWelcome from "./survey-welcome";
import SurveyForm from "./survey-form";

type AppState = 'welcome' | 'survey';

export default function SurveyApp() {
  const [appState, setAppState] = useState<AppState>('welcome');

  const handleStartSurvey = () => {
    setAppState('survey');
  };

  if (appState === 'welcome') {
    return <SurveyWelcome onStart={handleStartSurvey} />;
  }

  return <SurveyForm />;
}