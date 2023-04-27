Feature: Doc Strings
  Scenario: You should be able to use Doc Strings with Given, When and Then statements
    Given the following doc string:
      """markdown
      This is some cool text.

        It is fun.
      """
      
    When the following doc string is appended:
          ```
          This is more fun.
          ```

    Then final doc string will look like this:
   """
   This is some cool text.

     It is fun.
   This is more fun.
   """
