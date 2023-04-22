Feature: Is Friday Friday?
  Everybody wants to know when it's Friday

  Scenario: Friday is Friday
    Given today is Friday
    When I ask whether it's Friday yet
    Then I should be told "TGIF"
