// PLEASE NOTE THAT THIS IS A HAPPY/CORRECT PATH WHERE A USER IS SUGGESTED TO
// MAKE ALL THE CORRECT CHOICES (NO MISSCLICKS, NO TYPOS, ETC.)
// A CASE WHERE THE SELECTED RESTAURANT IS NOT IN OPERATING HOURS AT THE TIME IS ALSO MISSING
// CHECKING THE CART OF SELECTED ITEM NAME AND PRICE WHILE USING ALIASES IS ALSO MISSING

describe("User Journey", () => {
  it("a user can go through the ordering process of a burger up until the login", () => {
    // search input is visible and finds the right address by typing in the correct text
    cy.visit("https://wolt.com/lt/ltu");
    cy.get('[data-localization-key="gdpr-consents.banner.accept-button"]')
      .should("exist")
      .click();
    cy.getByDataTestId("address-picker-input.input")
      .should("exist")
      .type("Kauno Dokas");
    cy.get('[role="dialog"]').should("exist").contains("Kauno Dokas").click();

    //  correct address is present in the content page, food category can be picked
    cy.location("pathname").should("eq", "/lt/discovery");
    cy.getByDataTestId("header.address-select-button.address-text")
      .should("exist")
      .contains("Jonavos gatvė 7");
    cy.getByDataTestId("MainDiscoveryContent")
      .find('a[aria-label="Burgeriai, "]')
      .should("exist")
      .click();

    // correct category is present, a restaurant can be chosen from a list
    cy.location("pathname").should("eq", "/lt/discovery/category/burgers");
    cy.getByDataTestId("VenueVerticalListGrid")
      .should("exist")
      .getByDataTestId("venueCard.mcdonalds-karaliaus-mindaugo-pr")
      .should("exist")
      .click();

    // picked restaurant items are present, an item can be chosen, shopping cart works as intended
    cy.location("pathname").should(
      "eq",
      "/lt/ltu/kaunas/restaurant/mcdonalds-karaliaus-mindaugo-pr"
    );
    cy.getByDataTestId("productCatalog.productCategoryScreen")
      .should("exist")
      .within(() => {
        cy.getByDataTestId("horizontal-item-card-header")
          .contains(/^McRoyal®$/)
          .parents('button[data-test-id="horizontal-item-card-button"]')
          .as("selectedItem")
          .click();
      });
    cy.getByDataTestId("product-modal.price")
      .should("exist")
      .invoke("text")
      .as("burgerPrice");
    cy.getByDataTestId("product-modal.submit").should("exist").click();
    cy.getByDataTestId("cart-view-button").find("div").contains("4,70").click();
    cy.getByDataTestId("modal-background").should("exist");
  });
});
