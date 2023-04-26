@goodstuff
Feature: Tags support for Scenario Outlines
  @good
  Scenario Outline:
    Given I have a '<item1>'
    When I get a '<item2>'
    Then I have the following items:
      | apple |
      | grape |

    @good
    Examples: Keep this!
      | item1 | item2 |
      | apple | grape |

    @skip
    Examples: Skip this!
      | item1 | item2  |
      | apple | bogus  |

    # This one should happen because goodstuff is inherited
    @yuck
    Examples: Keep this too!
      | item1 | item2 |
      | apple | grape |

  @skip
  Scenario Outline:
    Given I have a '<item1>'
    When I get a '<item2>'
    Then I have the following items:
      | apple |
      | grape |

    Examples: Skip me!
      | item1 | item2 |
      | bogus | grape |
