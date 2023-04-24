Feature: Scenario is an alias for Example
  Example: This example just uses steps
  Given I have a "apple"
  Given I have a "grape"
  Given I have a "cherry"
  When I get a "orange"
  When I get a "pear"
  Then I have the following items:
    | apple  |
    | grape  |
    | cherry |
    | orange |
    | pear   |
  Then I don't have a "pizza"

  Example: This example uses step aliases
  Given I have a "apple"
  And I have a "grape"
  * I have a "cherry"
  When I get a "orange"
  And I get a "pear"
  Then I have the following items:
    | apple  |
    | grape  |
    | cherry |
    | orange |
    | pear   |
  But I don't have a "pizza"
