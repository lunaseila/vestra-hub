import Map "mo:core/Map";
import OnboardingTypes "../types/ch_onboarding";

module {
  public type OnboardingSubmission = OnboardingTypes.OnboardingSubmission;
  public type OnboardingStorage = Map.Map<Nat, OnboardingSubmission>;
  public type AppState = { var nextOnboardingId : Nat };

  public func submitOnboarding(
    storage : OnboardingStorage,
    state : AppState,
    userId : Text,
    country : Text,
    intent : Text,
    industry : Text,
    experienceLevel : Text,
    projectDescription : Text,
    createdAt : Int,
  ) : OnboardingSubmission {
    // Upsert: find existing entry by userId and remove it
    let existing = storage.entries().filter(func((k, v)) { v.userId == userId }).toArray();
    for ((k, _) in existing.values()) {
      storage.remove(k);
    };
    let id = state.nextOnboardingId;
    state.nextOnboardingId += 1;
    let submission : OnboardingSubmission = {
      id;
      userId;
      country;
      intent;
      industry;
      experienceLevel;
      projectDescription;
      createdAt;
    };
    storage.add(id, submission);
    submission;
  };

  public func getOnboardingByUser(storage : OnboardingStorage, userId : Text) : ?OnboardingSubmission {
    storage.values().find(func(s) { s.userId == userId });
  };
};
