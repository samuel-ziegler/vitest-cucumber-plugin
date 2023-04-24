Feature: Scenario is an alias for Example
  Scenario Outline: This is the Scenario Outline keyword
    Given there are <start> cucumbers
    When I eat <eat> cucumbers
    Then I should have <left> cucumbers

    Examples:
      | start | eat | left |
      |    12 |   5 |    7 |
      |    20 |   5 |   15 |

  Scenario Template: This is the Scenario Template keyword
    Given there are <start> cucumbers
    When I eat <eat> cucumbers
    Then I should have <left> cucumbers

    Scenarios:
      | start | eat | left |
      |    12 |   5 |    7 |
      |    20 |   5 |   15 |
