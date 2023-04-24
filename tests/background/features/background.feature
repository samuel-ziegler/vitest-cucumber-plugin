Feature: The Background keyword behaviors
  The Background keyword allow you to add context to scenarios that follow it.

  # This is the background.
  Background: Set up some background data
    It's the cool thing to do.
    
    Given I have a "orange"
    And I have a "grape"
    
  Scenario: What's the scenario?
    Given I have a "apple"
    When I get a "pea"
    Then I have the following items:
      | orange |
      | grape  |
      | apple  |
      | pea    |

  Scenario: It's another scenario!
    When I get a "pea"
    Then I have the following items:
      | orange |
      | grape  |
      | pea    |
