Feature: Before Step hook
  Scenario: The Before Step hooks should fire
    Given nothing
    When nothing happens
    Then the "beforeStep" property is an array with the integer values:
      | 0 |
