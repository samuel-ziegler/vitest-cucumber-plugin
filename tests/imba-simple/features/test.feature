Feature: Imba component tests example
  Scenario: Initial state
    Given I have a test component
    When I do nothing
    Then the test component text is "Hello World!"

  Scenario: Button pressed
    Given I have a test component
    When I push the button
    Then the test component text is "Button pressed!"
