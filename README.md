ServeFlow

**Team 19 | HCI Project**

Purpose:
ServeFlow is being developed to improve communication between customers, front-line workers, and kitchen staff during busy food and beverage service. The project investigates how campus dining and catering staff handle allergen information, special dietary requests, and food safety requirements during high-volume service.

Interviews identified ambiguous drink modifications, staff interruptions to clarify dietary requests, guessed wait times, and remakes that waste food and beverages. ServeFlow addresses these problems through three connected features: dietary customization prompts, item-specific preparation estimates with drive-through coordination, and kitchen progress tracking with a front-line display.

Campus Cup and Starbucks are stores represented in ServeFlow’s customer-facing design. The Figma designs guide the appearance of the application; they are not the final application itself.
Three Core Solutions
1. Dietary Customization Prompts
When a customer selects a dairy alternative, the UI checks the demonstrated combination for remaining dairy ingredients and asks the customer to confirm a choice. For example:
You selected oat milk. Would you like to remove the dairy whipped cream or switch to vegan whip?

Confirmation controls let the customer resolve the combination before continuing. The design also includes an option to keep dairy whip when that is intentional. This makes the choice explicit and reduces the need for staff to stop preparation to clarify the order.
2. Item Preparation Estimates and Drive-Through Coordination
The application is intended to display an estimated preparation time for each drink or food item and synchronize order information with the drive-through workflow. Customers can use this information to plan pickup, while staff can coordinate order readiness and handoff. The goal is to reduce unnecessary waiting and help customers pay and collect their orders efficiently.
3. Kitchen Progress Tracking and Front-Line Display
Kitchen staff use an interface to record what they are preparing and its current preparation stage. An estimation algorithm uses these updates to estimate readiness. A larger display presents that information to front-line workers so they can communicate informed wait estimates instead of guessing when an item will be available.

Together, these features aim to clarify orders before preparation, communicate progress during preparation, and improve pickup coordination.
Requirements and Setup
Intended Devices
- Customers: A mobile phone with an internet connection; portrait orientation for the illustrated ordering layout.
- Kitchen staff: A device capable of opening the preparation-tracking interface.
- Front-line staff: A larger screen or TV connected to a device that can display preparation progress and estimates.
Launch and Access Details
The final delivery method and technical requirements have not yet been supplied. Complete the following information before submitting the runnable application:
Setup detail	Information to supply
Application access	Final application URL or installation package
Installation	Exact installation steps, or confirmation that the application runs in a browser without additional software
Supported environment	Supported browsers, operating systems, and required settings
Test access	Customer and staff test credentials, if authentication is required
Staff display	Steps to open the kitchen interface and larger front-line display
Shared data	Any connection or configuration required to synchronize customer, kitchen, and front-line views


The Figma design link is a visual reference and does not replace these launch instructions.
Operating Instructions
These instructions describe the intended application workflow. Verify control names and navigation against the completed implementation.
Customer: Customize a Drink and Resolve a Dietary Conflict
1. Open ServeFlow and select a store, such as Campus Cup or Starbucks.
2. Browse the menu and select a drink. The illustrated Starbucks example uses Caffè Latte.
3. Review the size, temperature, milk, syrup, topping, and quantity options.
4. Select oat milk while dairy whipped cream remains selected.
5. Read the prompt identifying the remaining dairy topping.
6. Choose to remove dairy whipped cream or switch to vegan whip, then confirm. If keeping dairy whip is intentional, use the corresponding option where available.
7. Review the updated customization details and add the drink to the order.
8. Check the order summary before continuing.
Customer: Review Preparation Estimates and Coordinate Pickup
1. Review the estimated preparation time for each ordered drink or food item.
2. Use the displayed readiness information to plan pickup.
3. For a drive-through order, follow the application’s pickup instructions as the order information is synchronized with the drive-through workflow.
4. Complete the available payment and collection steps when the order is ready.
Kitchen Staff: Update Preparation Progress
1. Open the kitchen tracking interface.
2. Select or enter the item currently being prepared.
3. Record its current preparation stage.
4. Update the stage as preparation progresses.
5. Mark the item ready when preparation is complete.
Front-Line Staff: Check Readiness and Communicate Wait Times
1. Open the front-line display on the designated larger screen or TV.
2. Review the preparation stages and estimated readiness times generated from kitchen updates.
3. Use the displayed information to answer customer questions and coordinate pickup or drive-through handoff.
4. Check updated estimates as kitchen staff report progress.
Supporting Ordering Features
The customer-facing designs also include dietary profiles, individual order summaries, and group ordering. In the group example, Person A has a latte dairy conflict, Person B reviews a hazelnut conflict and vanilla cold-brew alternative, and Person C selects an Americano. These screens support the ordering experience alongside the three core solutions.
Scope and Implementation Limitations
- All three solutions above are part of the planned application. The available materials describe the design and rationale; they do not verify which interactions are already implemented.
- Preparation times are estimates. The completed implementation should explain how estimates are calculated and refreshed, and how delayed or missing kitchen updates are handled.
- Drive-through synchronization requires a defined connection between the ordering and staff workflows. Document whether the prototype uses simulated data or an actual integration.
- Dietary prompts address supported ingredient combinations. A milk substitution alone does not establish that every ingredient in a drink is dairy-free.
- Document any simulated payments, sample menu data, unsaved preferences, incomplete controls, or limits on simultaneous users in the final implementation.
- Food safety motivates the broader project, but the supplied three solutions do not specify a temperature-logging feature.
Troubleshooting
Problem	Action
The application will not open	Check the internet connection and follow the final launch instructions supplied with the project.
The dietary prompt does not appear	Try the demonstration combination: oat milk with dairy whipped cream still selected.
A customization does not change	Confirm the prompt choice, then review the drink details again.
Preparation estimates appear outdated	Check the kitchen item’s latest stage and whether the shared connection is active.
Kitchen progress is missing from the front-line display	Check that the update was saved and that both views refer to the same item or order.
Drive-through status does not update	Check the order’s pickup workflow and the synchronization configuration documented for the implementation.


Verification Before Submission
Test the dietary prompt from selection through order summary. Then update an item’s preparation stage in the kitchen view and verify that the estimate and front-line display reflect the change. Check the drive-through pickup workflow. Complete the setup table and replace planned behavior with confirmed implementation details wherever necessary.
