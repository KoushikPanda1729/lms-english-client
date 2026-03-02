import api from "@/lib/api";

export interface OnboardingQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  levelTag: string;
  sortOrder: number;
}

export interface CompleteOnboardingPayload {
  displayName: string;
  country: string;
  nativeLanguage: string;
  learningGoal: string;
  answers: { questionId: string; selectedIndex: number }[];
}

export const onboardingService = {
  async getQuestions(): Promise<OnboardingQuestion[]> {
    const { data } = await api.get("/onboarding/questions");
    return data.data as OnboardingQuestion[];
  },

  async complete(payload: CompleteOnboardingPayload): Promise<{ englishLevel: string }> {
    const { data } = await api.post("/onboarding/complete", payload);
    return data.data as { englishLevel: string };
  },
};
