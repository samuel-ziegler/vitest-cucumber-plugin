@goodstuff @moregoodstuff
Feature: Tags support

  @skip
  Scenario: What's the scenario?
    Given I have a "apple"
    When I get a "pea"
    Then I have the following items:
      | bogus |
      | pea   |

  @yuck
  Scenario: It's another scenario!
    Given I have a "apple"
    When I get a "pea"
    Then I have the following items:
      | apple |
      | bogus |

  @good
  Scenario: It's another scenario!
    Given I have a "apple"
    When I get a "pea"
    Then I have the following items:
      | apple  |
      | pea    |
