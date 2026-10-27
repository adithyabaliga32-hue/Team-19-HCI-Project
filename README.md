ServeFlow
**Team 19 | HCI Project**

Overview and Purpose
ServeFlow is a mobile beverage-ordering interface focused on identifying and resolving ingredient conflicts during customization. It helps customers communicate dietary preferences clearly before submitting an order, reducing the need for staff to clarify ambiguous modifications and remake drinks.

The central solution is a contextual confirmation prompt. For example, selecting oat milk while dairy whipped cream remains selected prompts the customer to switch to vegan whip. The interface also uses dietary tags to identify conflicting ingredients when ordering for multiple people.

The project demonstrates this solution through three tasks: a quick order from the saved Oat Latte, a moderate drink customization, and a complex group order. Home lets customers choose Starbucks, Dunkin’, or Dutch Bros, and Menu shows sample drinks for the selected restaurant. Menu items and prices are illustrative prototype data. Some menu art uses images supplied by the user; remaining drink artwork is original prototype illustration. The Profile tab lets a customer manage dietary preferences. Individual group-member tags drive the group-order conflict checks, and the saved-order badges reflect the Profile selections. The Figma screens provide the visual reference for ServeFlow’s implementation.

Requirements and Setup
- A mobile phone with an internet connection.
- The final application link or installation package supplied by the project team.
The delivery method, supported browsers or operating systems, installation requirements, and test credentials have not yet been provided. Complete the following before submission:
Setup detail	Information to provide
Application access	Final application URL or installation package
Installation requirements	Exact setup steps, or confirmation that no additional software is required
Supported environment	Supported browsers/devices and any required settings
Test credentials	User ID and password, or confirmation that no login is required
Demonstration data	How to access the saved Oat Latte and the group-order participants


How the UI Functions
Customers select beverages, review dietary information, customize ingredients, and check their order before payment. When a supported customization conflicts with dietary preferences or another ingredient selection, the UI displays a prompt or warning and offers an alternative.

For example:
You selected oat milk. Would you like to switch to vegan whip?

Selecting Switch to Vegan Whip resolves the illustrated dairy-topping conflict. In the group task, dietary tags belong to individual participants so ingredient checks can apply to the correct person.
Task 1: Simple — Order a Saved Beverage
Goal: Quickly order a saved beverage and review its dietary tags without browsing menus or rechecking individual ingredients.
1. Open ServeFlow and sign in with demonstration details.
2. Select Quick order in the Your usual card on Home.
3. Review the order summary and the displayed verified allergen-safe tags.
4. Confirm payment and submit the order.
Expected result: The saved drink can be ordered through a short flow without repeating customization.
Task 2: Moderate — Customize a Beverage and Resolve a Conflict
Goal: Customize a beverage while using ingredient-conflict detection to review and resolve an incompatible topping.
1. Browse the beverage menu and select a specialty drink, such as Caffè Latte.
2. Select the beverage size and temperature.
3. Change the default milk base to oat milk.
4. Review the conflict message asking whether to switch to vegan whip.
5. Select Switch to Vegan Whip.
6. Add the customized drink to the cart.
7. Review the order summary to confirm the modifications, then proceed to checkout.
Expected result: The drink summary reflects oat milk and vegan whip, and the customer has explicitly resolved the dairy-topping conflict.
Task 3: Complex — Place a Group Order with Different Dietary Needs
Goal: Coordinate an order for friends or family with different dietary needs, such as vegan preferences and nut allergies.
1. Start a group order in ServeFlow.
2. Set dietary tags for each participant. For the demonstration, set Person A to vegan and Person B to nut allergy.
3. Configure Drink 1 for Person A by switching the milk base to oat milk.
4. Respond to the prompt flagging dairy whipped cream by selecting Switch to Vegan Whip.
5. Add Person A’s drink to the shared group cart.
6. Select and customize Drink 2 for Person B, such as a cold brew.
7. Attempt to select hazelnut syrup and review the allergen block or warning associated with Person B’s nut-allergy tag.
8. Switch to the demonstrated compatible alternative, vanilla syrup, and add the drink to the group cart.
9. Configure Drink 3 for Person C and add it to the group cart.
10. Review the group order summary. Verify each participant’s drink, customizations, and displayed dietary badges, such as the nut-free badge.
11. Confirm the pickup location and estimated preparation-time window.
12. Proceed to payment and submit the finalized group order to the queue.
Expected result: Each drink is assigned to the correct participant, supported conflicts have been addressed, and the group summary shows the intended customizations and dietary tags.
Scope and Limitations
- The scope is the first solution: ingredient-conflict prompts and dietary-aware ordering, demonstrated through the three tasks above.
- The group task includes a pickup location and an estimated preparation-time window. Separate kitchen tracking displays and drive-through synchronization are outside this implementation scope.
- The supplied materials describe intended behavior. Confirm working interactions, navigation labels, and supported ingredient combinations against the completed implementation.
- The task designs use “verified allergen-safe” tags and badges. Their presence in the UI does not establish real ingredient verification or cross-contact controls. Document the source and limits of these labels in the completed prototype.
- Oat milk alone does not make an entire beverage dairy-free. The demonstrated prompt addresses the remaining dairy whipped cream.
- Payment processing, order-queue submission, saved favorites, preference persistence, and preparation estimates may be simulated in a prototype. The current saved Oat Latte and Profile preferences are in-memory demonstration data; identify the actual behavior before submission.
- Record any incomplete controls, predefined choices, or restrictions on adding group participants.
Troubleshooting
Problem	Action
The application does not open	Check the internet connection and follow the supplied launch instructions.
The saved Oat Latte is missing	Check that the demonstration account or sample data has been loaded.
The vegan-whip prompt does not appear	Select oat milk while dairy whipped cream is still included in the drink.
The hazelnut warning does not appear	Confirm that the drink belongs to Person B and that Person B has the nut-allergy tag.
A change is missing from the summary	Confirm the customization before adding the drink, then review the correct participant’s item.
Content extends below the screen	Scroll within the mobile interface in portrait orientation.


Before Submission
Complete the setup details, supply the final application access instructions, and test all three tasks from beginning to end. State which payment, order submission, dietary-label, and preparation-estimate behaviors are simulated or incomplete
