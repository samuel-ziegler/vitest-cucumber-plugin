# This is a comment
Feature: Is it Friday yet?
  Everybody wants to know when it's Friday

  # This is also a comment
  Scenario: Sunday isn't Friday
    Given today is Sunday
    # Another comment in between steps
    When I ask whether it's Friday yet
    Then I should be told "Nope"
