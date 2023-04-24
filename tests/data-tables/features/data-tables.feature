Feature: Data Tables
  Scenario: You should be able to use Data Tables with Given, When and Then statements
    Given the following data:
      | id | value |
      | 9  | nine  |
      | 1  | one   |
      | 5  | five  |
      | 6  | six   |
      | 2  | two   |
      | 4  | four  |
      | 8  | eight |
      | 3  | three |
      
    When the following ids are removed:
      | 5  |
      | 4  |
      | 9  |

    Then the data will contain the following:
      | id | value |
      | 1  | one   |
      | 6  | six   |
      | 2  | two   |
      | 8  | eight |
      | 3  | three |
