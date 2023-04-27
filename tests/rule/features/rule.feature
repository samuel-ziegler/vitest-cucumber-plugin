Feature: Is it Friday yet?
  Everybody wants to know when it's Friday

  Rule: The Sunday case
    Scenario: Sunday isn't Friday
      Given today is Sunday
      When I ask whether it's Friday yet
      Then I should be told "Nope"

  Rule: The Friday case
    Scenario: Friday is Friday
      Given today is Friday
      When I ask whether it's Friday yet
      Then I should be told "TGIF"
