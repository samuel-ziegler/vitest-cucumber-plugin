@skip
Feature: Skip this entire feature
  Scenario: It's another scenario!
    Given I have a "apple"
    When I get a "pea"
    Then I have the following items:
      | apple |
      | bogus |
      
