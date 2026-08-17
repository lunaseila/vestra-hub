import Map "mo:core/Map";
import Time "mo:core/Time";
import OnboardingTypes "../types/ch_onboarding";
import OnboardingLib "../lib/ch_onboarding";

mixin (
  onboardings : Map.Map<Nat, OnboardingTypes.OnboardingSubmission>,
  chOnbState : { var nextOnboardingId : Nat },
) {
  public shared ({ caller }) func submitOnboarding(
    country : Text,
    intent : Text,
    industry : Text,
    experienceLevel : Text,
    projectDescription : Text,
  ) : async OnboardingTypes.OnboardingSubmission {
    OnboardingLib.submitOnboarding(
      onboardings,
      chOnbState,
      caller.toText(),
      country,
      intent,
      industry,
      experienceLevel,
      projectDescription,
      Time.now(),
    );
  };

  public query func getOnboardingByUser(userId : Text) : async ?OnboardingTypes.OnboardingSubmission {
    OnboardingLib.getOnboardingByUser(onboardings, userId);
  };
};
