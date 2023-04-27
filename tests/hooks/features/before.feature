Feature: Before hooks
  Scenario: The Before hooks should have been run
    Given nothing
    When nothing happens
    Then the "before" property is an array with the values:
      | before1 |
      | before2 |
      
  Scenario: The After hooks should have cleared out the before property
    Given nothing
    When nothing happens
    Then the "before" property is an array with the values:
      | before1 |
      | before2 |
