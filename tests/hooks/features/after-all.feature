Feature: AfterAll hooks
  Scenario: AfterAll hooks should not have been run yet
    Given nothing
    When nothing happens
    Then the "afterAll" property does not exist
