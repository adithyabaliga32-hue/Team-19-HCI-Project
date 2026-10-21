Team-19-HCI-Project

**Trash Taste — README**

Overview:
Trash Taste is a mobile coffee-ordering UI focused on helping customers notice and resolve conflicting drink customizations. Selecting a dairy alternative, such as oat milk, does not necessarily remove other dairy ingredients from a drink. The UI addresses this problem with a confirmation prompt that helps the customer review remaining dairy ingredients before continuing.

For example, after a customer selects oat milk for a drink with dairy whipped cream, the UI prompts:
You selected oat milk. Would you like to remove the dairy whipped cream or switch to vegan whip?

The customer selects an option and confirms the change. This makes the ingredient choice explicit instead of assuming that selecting alternative milk makes the entire drink dairy-free.

Trash Taste is the app name. Campus Cup and Starbucks are store names represented in the design. The Figma file provides the visual reference for the intended UI.
Requirements and Access
- A mobile phone with an internet connection.
- The final app link or launch instructions must be supplied with the implementation.

How the UI Functions
1. Select a Store and Drink
Open Trash Taste, choose a store, and select a drink to open its customization screen. The illustrated Starbucks example uses a Caffè Latte.
2. Customize the Drink
Review the available drink options, including milk and toppings. Select a dairy alternative, such as oat milk, while dairy whipped cream is still selected.
3. Review the Dairy Prompt
The intended interaction displays a prompt explaining that the milk selection and dairy whipped cream may not match the customer’s intended customization. The prompt asks whether the customer wants to remove the dairy whipped cream or switch to vegan whip.

Selecting alternative milk alone should not silently remove another ingredient: the customer confirms the desired change.
4. Confirm a Choice
Choose one of the following actions:
- Remove dairy whipped cream: Continue without the dairy whipped cream topping.
- Switch to vegan whip: Replace the dairy whipped cream with the vegan alternative.
The supplied customization designs also show an option to keep dairy whip. This allows a customer who intentionally wants that combination to retain it.
5. Review the Updated Drink
After confirming, review the customization screen to check the selected milk and topping. Add the drink to the order and review its details in the order summary.

Main Demonstration Scenario
1. Open Trash Taste and select Starbucks.
2. Select Caffè Latte.
3. Leave dairy whipped cream selected and change the milk to oat milk.
4. Review the dairy-ingredient prompt.
5. Select the vegan-whip alternative and confirm the change.
6. Check that the drink details reflect oat milk and vegan whip.
7. Add the drink to the order and review the summary.
8. Repeat the scenario using the option to remove dairy whipped cream. If implemented, also test the option to keep dairy whip.
Expected behavior: The UI draws attention to the remaining dairy topping and lets the customer explicitly choose how to proceed.
Supporting Screens
The visual design includes dietary preferences, individual order summaries, and group-order screens. These support the ordering experience, while the primary solution documented here is the dairy-alternative confirmation prompt. The final implementation should identify which supporting screens are interactive.

Scope and Limitations
- This project focuses on the dairy-alternative prompt described in Solution 1. Drink preparation estimates, drive-through synchronization, and kitchen staff tracking are separate solution ideas and are outside this README’s scope.
- The Figma screens describe the intended appearance and flow. Actual implemented behavior must be checked against the demonstration steps above.
- Selecting oat milk or removing dairy whipped cream does not establish that every ingredient in a drink is dairy-free. The demonstrated prompt addresses the specified milk-and-topping combination.
- Supported ingredient combinations, saved preferences, payment behavior, and real order submission must be documented according to the completed implementation.
- Any simulated controls, predefined example data, or incomplete interactions must be listed before submission.

Troubleshooting
Problem	Action
A change is not reflected in the drink details	Check that the choice was confirmed. Report the issue if the previous topping remains selected.
Content extends beyond the screen	Scroll through the customization screen in portrait orientation.


Final Submission Details
Before submission, make sure the application works on the specific phone.
