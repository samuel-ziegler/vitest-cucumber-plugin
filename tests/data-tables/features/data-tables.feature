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

  Scenario: You should be able to have different types of characters in the table cells
    Given the following data:
      | id | value           |
      | 9  | ~!@#$%^&*()_+   |
      | 1  | Ֆունկցիոնալություն |
      | 5  | ?>":{}[]`~';/., |
      | 6  |                 |
      | 7  | control         |
      
    When the following ids are removed:
      | 7  |

    Then the data will contain the following:
      | id | value           |
      | 9  | ~!@#$%^&*()_+   |
      | 1  | Ֆունկցիոնալություն |
      | 5  | ?>":{}[]`~';/., |
      | 6  |                 |
