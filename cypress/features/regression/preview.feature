Feature: Preview default component
  I want to test Preview component

  @positive
  Scenario Outline: Change Preview children to <children>
    When I open basic "Preview Test" component in noIFrame with "preview" json from "commonComponents" using "<nameOfObject>" object name
    Then Preview children is set to <children>
    Examples:
      | children                     | nameOfObject             |
      | mp150ú¿¡üßä                  | childrenOtherLanguage    |
      | !@#$%^*()_+-=~[];:.,?{}&"'<> | childrenSpecialCharacter |
