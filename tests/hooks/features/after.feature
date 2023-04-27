Feature: After hooks
  Scenario: After hooks should not have been run yet
    Given nothing
    When nothing happens
    Then the "after" property does not exist
