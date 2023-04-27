Feature: BeforeAll hooks
  Scenario: BeforeAll hooks are run once
    Given nothing
    When nothing happens
    Then the "beforeAll" property is an array with the values:
      | beforeAll1 |
      | beforeAll2 |

  Scenario: BeforeAll hooks should be the same this time
    Given nothing
    When nothing happens
    Then the "beforeAll" property is an array with the values:
      | beforeAll1 |
      | beforeAll2 |
