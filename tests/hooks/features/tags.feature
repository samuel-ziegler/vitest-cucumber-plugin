@hooks
Feature: Hooks can be selectively used with tags
  Scenario: The Before hooks should have been run
    Given nothing
    When nothing happens
    Then the "beforeTags" property is an array with the values:
      | beforeTags |

  # Disable the Before hook for this Scenario
  @nobefore
  Scenario:
    Given nothing
    When nothing happens
    Then the "beforeTags" property is an empty array
