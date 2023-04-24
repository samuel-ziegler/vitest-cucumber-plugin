Feature: Tags support for Scenario Outlines
  @good
  Scenario Outline:
    Given I have a '<item1>'
    When I get a '<item2>'
    Then I have the following items:
      | apple |
      | grape |

    @good
    Examples:
      | item1 | item2 |
      | apple | grape |

    @skip
    Examples:
      | item1 | item2  |
      | apple | bogus  |

  @skip
  Scenario Outline:
    Given I have a '<item1>'
    When I get a '<item2>'
    Then I have the following items:
      | apple |
      | grape |

    Examples:
      | item1 | item2 |
      | bogus | grape |
