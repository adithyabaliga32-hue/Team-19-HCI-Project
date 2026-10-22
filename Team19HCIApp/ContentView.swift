import SwiftUI

private enum CoffeeStyle {
    static let green = Color(red: 0.13, green: 0.36, blue: 0.28)
    static let greenSoft = Color(red: 0.92, green: 0.95, blue: 0.91)
    static let cream = Color(red: 0.97, green: 0.96, blue: 0.93)
    static let muted = Color(red: 0.48, green: 0.51, blue: 0.48)
    static let line = Color(red: 0.90, green: 0.89, blue: 0.85)
}

private enum Screen: Equatable {
    case login, home, menu, profile, customize, orderSummary, groupSummary
}

private struct GroupMember: Identifiable {
    let id: Int
    let name: String
    var dietaryTag: String
    var drink: String
    var size: String
    var temperature: String
    var milk: String
    var whip: String
    var price: Double
    var added = false
}

private struct DrinkArtwork: View {
    let drinkName: String
    var size: CGFloat

    private var isColdBrew: Bool { drinkName.contains("Cold Brew") }
    private var isAmericano: Bool { drinkName.contains("Americano") }
    private var drinkColor: Color {
        isColdBrew ? Color(red: 0.42, green: 0.25, blue: 0.16) : Color(red: 0.46, green: 0.29, blue: 0.17)
    }

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: size * 0.2)
                .fill(isColdBrew ? Color(red: 0.91, green: 0.94, blue: 0.90) :
                    isAmericano ? Color(red: 0.94, green: 0.90, blue: 0.82) : CoffeeStyle.greenSoft)

            Circle()
                .fill(.white.opacity(0.35))
                .frame(width: size * 0.24)
                .offset(x: size * 0.3, y: -size * 0.3)

            if isAmericano {
                Ellipse()
                    .fill(Color(red: 0.80, green: 0.74, blue: 0.64))
                    .frame(width: size * 0.68, height: size * 0.14)
                    .offset(y: size * 0.31)
                Circle()
                    .stroke(Color.white, lineWidth: size * 0.09)
                    .frame(width: size * 0.28)
                    .offset(x: size * 0.25, y: -size * 0.02)
                VStack(spacing: 0) {
                    Ellipse().fill(Color.white).frame(width: size * 0.48, height: size * 0.12)
                    RoundedRectangle(cornerRadius: size * 0.12)
                        .fill(Color.white)
                        .frame(width: size * 0.46, height: size * 0.34)
                        .overlay(alignment: .top) {
                            Ellipse().fill(drinkColor).frame(height: size * 0.09)
                        }
                }
                .offset(x: -size * 0.05, y: -size * 0.02)
            } else if isColdBrew {
                Capsule().fill(CoffeeStyle.green)
                    .frame(width: size * 0.045, height: size * 0.44)
                    .rotationEffect(.degrees(34))
                    .offset(x: size * 0.12, y: -size * 0.2)
                VStack(spacing: 0) {
                    Capsule().fill(.white.opacity(0.9)).frame(width: size * 0.47, height: size * 0.07)
                    UnevenRoundedRectangle(
                        topLeadingRadius: size * 0.03,
                        bottomLeadingRadius: size * 0.12,
                        bottomTrailingRadius: size * 0.12,
                        topTrailingRadius: size * 0.03
                    )
                    .fill(drinkColor.opacity(0.82))
                    .frame(width: size * 0.39, height: size * 0.5)
                    .overlay {
                        VStack {
                            HStack(spacing: size * 0.04) {
                                iceCube(size * 0.12)
                                iceCube(size * 0.14)
                            }
                            iceCube(size * 0.12).offset(x: size * 0.08)
                        }
                        .offset(y: -size * 0.08)
                    }
                }
                .offset(y: size * 0.03)
            } else {
                VStack(spacing: 0) {
                    Capsule().fill(Color(red: 0.82, green: 0.80, blue: 0.75))
                        .frame(width: size * 0.44, height: size * 0.07)
                    RoundedRectangle(cornerRadius: size * 0.08)
                        .fill(.white)
                        .frame(width: size * 0.4, height: size * 0.51)
                        .overlay(alignment: .top) {
                            VStack(spacing: 0) {
                                Rectangle().fill(drinkColor).frame(height: size * 0.18)
                                RoundedRectangle(cornerRadius: size * 0.04)
                                    .fill(CoffeeStyle.green)
                                    .frame(height: size * 0.2)
                            }
                            .padding(.top, size * 0.05)
                            .padding(.horizontal, size * 0.02)
                        }
                }
                .offset(y: size * 0.03)
            }
        }
        .frame(width: size, height: size)
        .clipShape(RoundedRectangle(cornerRadius: size * 0.2))
        .accessibilityLabel("\(drinkName) illustration")
    }

    private func iceCube(_ dimension: CGFloat) -> some View {
        RoundedRectangle(cornerRadius: dimension * 0.2)
            .fill(Color(red: 0.93, green: 0.88, blue: 0.77))
            .frame(width: dimension, height: dimension)
            .overlay(RoundedRectangle(cornerRadius: dimension * 0.2).stroke(.white.opacity(0.8), lineWidth: 1))
    }
}

struct ContentView: View {
    @State private var screen: Screen = .login
    @State private var activeTab = "Home"
    @State private var email = ""
    @State private var password = ""
    @State private var members = [
        GroupMember(id: 0, name: "Person A", dietaryTag: "Vegan", drink: "Caffè Latte", size: "Grande", temperature: "Hot", milk: "Oat milk", whip: "Dairy whip", price: 5.45),
        GroupMember(id: 1, name: "Person B", dietaryTag: "Nut allergy", drink: "Cold Brew", size: "Grande", temperature: "Iced", milk: "Vanilla syrup", whip: "No topping", price: 4.25),
        GroupMember(id: 2, name: "Person C", dietaryTag: "None", drink: "Americano", size: "Grande", temperature: "Hot", milk: "No milk", whip: "No topping", price: 3.45)
    ]
    @State private var profileTags: Set<String> = ["Vegan", "Nut allergy"]
    @State private var draftTags = ["Vegan", "Nut allergy", "None"]
    @State private var showDietarySheet = false
    @State private var showConflict = false
    @State private var showConfirmation = false
    @State private var editingMember = 0
    @State private var isGroupFlow = false
    @State private var selectedSize = "Grande"
    @State private var selectedTemperature = "Hot"
    @State private var selectedMilk = "Oat milk"

    private var orderedMembers: [GroupMember] { members.filter(\.added) }
    private var subtotal: Double { orderedMembers.reduce(0) { $0 + $1.price } }

    var body: some View {
        VStack(spacing: 0) {
            ScrollView {
                VStack(alignment: .leading, spacing: 14) {
                    pageContent
                }
                .padding(.horizontal, 20)
                .padding(.top, 10)
                .padding(.bottom, 18)
            }
            .scrollIndicators(.hidden)

            if screen != .login {
                bottomActions
                tabBar
            }
        }
        .background(CoffeeStyle.cream.ignoresSafeArea())
        .preferredColorScheme(.light)
        .statusBarHidden(true)
        .persistentSystemOverlays(.hidden)
        .sheet(isPresented: $showDietarySheet) {
            dietarySheet
                .presentationDetents([.medium, .large])
                .presentationDragIndicator(.visible)
        }
        .alert("Switch to vegan whip?", isPresented: $showConflict) {
            Button("Switch to Vegan Whip") {
                members[editingMember].whip = "Vegan whip"
                screen = .orderSummary
            }
            Button("Keep dairy whip", role: .cancel) { screen = .orderSummary }
        } message: {
            Text("Your Vegan preference may conflict with dairy whipped cream. Please confirm ingredients and cross-contact risks with the barista.")
        }
        .alert("Order submitted", isPresented: $showConfirmation) {
            Button("Done", role: .cancel) {}
        }
    }

    @ViewBuilder
    private var pageContent: some View {
        switch screen {
        case .login: loginScreen
        case .home: homeScreen
        case .menu: menuScreen
        case .profile: profileScreen
        case .customize: customizeScreen
        case .orderSummary: individualSummary
        case .groupSummary: groupSummary
        }
    }

    private var loginScreen: some View {
        VStack(alignment: .leading, spacing: 0) {
            Spacer()
            Image(systemName: "cup.and.saucer.fill")
                .font(.system(size: 28))
                .foregroundStyle(.white)
                .frame(width: 64, height: 64)
                .background(CoffeeStyle.green, in: RoundedRectangle(cornerRadius: 20))
                .padding(.bottom, 27)
            Text("Welcome back")
                .font(.system(size: 27, weight: .bold))
            Text("Sign in to order your favorite drinks with your group.")
                .font(.subheadline)
                .foregroundStyle(CoffeeStyle.muted)
                .padding(.top, 8)
                .padding(.bottom, 27)

            VStack(alignment: .leading, spacing: 15) {
                VStack(alignment: .leading, spacing: 7) {
                    Text("Email address").font(.caption.bold())
                    TextField("you@example.com", text: $email)
                        .keyboardType(.emailAddress)
                        .textContentType(.emailAddress)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                        .padding(.horizontal, 14)
                        .frame(height: 48)
                        .background(.white, in: RoundedRectangle(cornerRadius: 12))
                        .overlay(RoundedRectangle(cornerRadius: 12).stroke(CoffeeStyle.line))
                }
                VStack(alignment: .leading, spacing: 7) {
                    Text("Password").font(.caption.bold())
                    SecureField("Enter your password", text: $password)
                        .textContentType(.password)
                        .padding(.horizontal, 14)
                        .frame(height: 48)
                        .background(.white, in: RoundedRectangle(cornerRadius: 12))
                        .overlay(RoundedRectangle(cornerRadius: 12).stroke(CoffeeStyle.line))
                }
                primaryButton("Sign in", icon: nil) {
                    guard !email.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
                          !password.isEmpty else { return }
                    screen = .home
                    activeTab = "Home"
                }
                .padding(.top, 4)
            }
            Spacer()
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var homeScreen: some View {
        VStack(alignment: .leading, spacing: 12) {
            header("Group order", subtitle: "Starbucks · UTD Student Union")
            HStack(spacing: 12) {
                Image(systemName: "person.2")
                    .font(.title2)
                    .foregroundStyle(CoffeeStyle.green)
                VStack(alignment: .leading, spacing: 3) {
                    Text("Your crew").font(.subheadline.bold())
                    Text("3 people · One order, one easy pickup.")
                        .font(.caption).foregroundStyle(CoffeeStyle.muted)
                }
                Spacer()
            }
            .padding(14)
            .background(CoffeeStyle.greenSoft, in: RoundedRectangle(cornerRadius: 17))

            Button { showDietarySheet = true } label: {
                HStack(spacing: 10) {
                    Image(systemName: "tag.fill")
                        .foregroundStyle(CoffeeStyle.green)
                        .padding(7)
                        .background(CoffeeStyle.greenSoft, in: Circle())
                    VStack(alignment: .leading, spacing: 3) {
                        Text("Set dietary tags").font(.caption.bold())
                        Text("Vegan · Nut allergy · No restrictions")
                            .font(.caption2).foregroundStyle(CoffeeStyle.muted)
                    }
                    Spacer()
                    Image(systemName: "chevron.right").foregroundStyle(CoffeeStyle.muted)
                }
                .padding(10)
                .background(.white, in: RoundedRectangle(cornerRadius: 14))
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(CoffeeStyle.line))
            }
            .buttonStyle(.plain)

            HStack {
                Text("Group members")
                Spacer()
                Text("3 people · \(orderedMembers.count) drinks")
                    .font(.caption.bold()).foregroundStyle(CoffeeStyle.green)
            }
            .font(.subheadline)

            ForEach(members.indices, id: \.self) { index in
                memberCard(index)
            }

            Text("Dietary labels are guidance, not a guarantee of allergen safety. Confirm ingredients and cross-contact risks with a barista.")
                .font(.system(size: 10))
                .foregroundStyle(CoffeeStyle.muted)
        }
    }

    private func memberCard(_ index: Int) -> some View {
        let member = members[index]
        return VStack(spacing: 9) {
            HStack(spacing: 9) {
                Image(systemName: "person")
                    .foregroundStyle(CoffeeStyle.green)
                    .frame(width: 34, height: 34)
                    .background(Color(red: 0.94, green: 0.90, blue: 0.82), in: Circle())
                VStack(alignment: .leading, spacing: 3) {
                    HStack(spacing: 5) {
                        Text(member.name).font(.caption.bold())
                        tagBadge(member.dietaryTag)
                    }
                    Text("\(member.drink) · \(member.size) · \(member.milk)")
                        .font(.caption2).foregroundStyle(CoffeeStyle.muted)
                }
                Spacer(minLength: 0)
            }
            Button {
                beginCustomization(for: index, groupFlow: false)
            } label: {
                Label("Customize drink", systemImage: "slider.horizontal.3")
                    .font(.caption.bold())
                    .foregroundStyle(CoffeeStyle.green)
                    .frame(maxWidth: .infinity, minHeight: 36)
                    .background(CoffeeStyle.greenSoft, in: Capsule())
                    .overlay(Capsule().stroke(CoffeeStyle.green.opacity(0.65)))
            }
            .buttonStyle(.plain)
        }
        .padding(11)
        .background(.white, in: RoundedRectangle(cornerRadius: 17))
    }

    private var profileScreen: some View {
        VStack(alignment: .leading, spacing: 14) {
            header("Dietary profile", subtitle: "A little care with every cup")
            HStack(spacing: 12) {
                Text("YO")
                    .font(.subheadline)
                    .frame(width: 44, height: 44)
                    .background(Color(red: 0.94, green: 0.90, blue: 0.82), in: Circle())
                VStack(alignment: .leading, spacing: 3) {
                    Text("Your preferences").font(.headline)
                    Text("Used for individual & group orders")
                        .font(.caption).foregroundStyle(CoffeeStyle.muted)
                }
            }
            HStack(alignment: .top, spacing: 9) {
                Image(systemName: "checkmark.shield")
                VStack(alignment: .leading, spacing: 5) {
                    Text("We’ll flag choices that may conflict.")
                        .font(.caption.bold())
                    Text("Your profile helps you choose.")
                        .font(.caption).foregroundStyle(CoffeeStyle.muted)
                }
            }
            .foregroundStyle(CoffeeStyle.green)
            .padding(13)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(CoffeeStyle.greenSoft, in: RoundedRectangle(cornerRadius: 16))

            Text("Dietary restrictions").font(.subheadline)
            ForEach(["Vegan", "Nut allergy", "Lactose intolerance", "None"], id: \.self) { tag in
                Button {
                    if profileTags.contains(tag) { profileTags.remove(tag) }
                    else { profileTags.insert(tag) }
                } label: {
                    HStack(spacing: 9) {
                        Image(systemName: profileTags.contains(tag) ? "checkmark.circle" : "circle")
                            .foregroundStyle(CoffeeStyle.green)
                        Text(tag)
                        Spacer()
                    }
                    .font(.subheadline)
                    .padding(11)
                    .background(profileTags.contains(tag) ? CoffeeStyle.greenSoft : .white,
                                in: RoundedRectangle(cornerRadius: 11))
                    .overlay(RoundedRectangle(cornerRadius: 11).stroke(
                        profileTags.contains(tag) ? CoffeeStyle.green.opacity(0.6) : CoffeeStyle.line))
                }
                .buttonStyle(.plain)
            }
            VStack(alignment: .leading, spacing: 10) {
                Label("Vegan — dairy & whip prompt", systemImage: "leaf")
                    .font(.caption.bold()).foregroundStyle(CoffeeStyle.green)
                Text("When ordering, you'll be prompted to switch whipped cream to vegan whip and select a plant-based milk.")
                    .font(.caption2).foregroundStyle(CoffeeStyle.muted)
                Divider()
                Label("Nut allergy — hazelnut warning", systemImage: "info.circle")
                    .font(.caption.bold()).foregroundStyle(CoffeeStyle.green)
                Text("Hazelnut and other nut modifiers are flagged in group orders.")
                    .font(.caption2).foregroundStyle(CoffeeStyle.muted)
            }
            .padding(13)
            .background(.white, in: RoundedRectangle(cornerRadius: 16))
        }
    }

    private var menuScreen: some View {
        VStack(alignment: .leading, spacing: 12) {
            header("Menu", subtitle: "Choose a drink for your group")
            ForEach(members.indices, id: \.self) { index in
                Button { beginCustomization(for: index, groupFlow: false) } label: {
                    HStack(spacing: 12) {
                        DrinkArtwork(drinkName: members[index].drink, size: 58)
                        VStack(alignment: .leading, spacing: 4) {
                            Text(members[index].drink).font(.subheadline.bold())
                            Text("From \(members[index].price, format: .currency(code: "USD")) · \(members[index].temperature)")
                                .font(.caption).foregroundStyle(CoffeeStyle.muted)
                        }
                        Spacer()
                        Text("Choose").font(.caption.bold()).foregroundStyle(CoffeeStyle.green)
                    }
                    .padding(13)
                    .background(.white, in: RoundedRectangle(cornerRadius: 16))
                }
                .buttonStyle(.plain)
            }
        }
    }

    private var customizeScreen: some View {
        let member = members[editingMember]
        return VStack(alignment: .leading, spacing: 12) {
            header("Customize", subtitle: "Starbucks · UTD Student Union")
            HStack(spacing: 12) {
                DrinkArtwork(drinkName: member.drink, size: 76)
                VStack(alignment: .leading, spacing: 4) {
                    Text(member.drink).font(.headline)
                    Text(member.price, format: .currency(code: "USD"))
                        .font(.subheadline.bold()).foregroundStyle(CoffeeStyle.green)
                    Text("\(member.size) · \(member.temperature) · \(member.milk)")
                        .font(.caption2).foregroundStyle(CoffeeStyle.muted)
                }
            }
            .padding(12)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(.white, in: RoundedRectangle(cornerRadius: 16))

            choiceSection("Size", options: ["Tall", "Grande", "Venti"], selection: $selectedSize)
            choiceSection("Temperature", options: ["Hot", "Iced"], selection: $selectedTemperature)
            choiceSection("Milk", options: ["Oat milk", "2% milk", "Almond milk"], selection: $selectedMilk)
            if member.dietaryTag == "Vegan" {
                Label("Vegan preference: choose plant-based milk and vegan whip. Confirm ingredients with the barista.", systemImage: "info.circle")
                    .font(.caption).foregroundStyle(CoffeeStyle.muted)
            }
            Spacer(minLength: 0)
        }
    }

    private var individualSummary: some View {
        let member = members[editingMember]
        return VStack(alignment: .leading, spacing: 12) {
            header("Order summary", subtitle: "\(member.drink) · Ready to review")
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Label(member.drink, systemImage: "cup.and.saucer")
                    Spacer()
                    Text(member.price, format: .currency(code: "USD")).bold()
                }
                .font(.subheadline)
                Divider()
                summaryLine("Size", "\(member.size) · 16 fl oz")
                summaryLine("Temperature", member.temperature)
                summaryLine("Milk", member.milk)
                summaryLine("Topping", member.whip)
            }
            .padding(14)
            .background(.white, in: RoundedRectangle(cornerRadius: 17))
            pickupCard
            priceCard(items: [member])
        }
    }

    private var groupSummary: some View {
        VStack(alignment: .leading, spacing: 11) {
            header("Group summary", subtitle: "\(orderedMembers.count) members · \(orderedMembers.count) drinks · One pickup")
            VStack(alignment: .leading, spacing: 12) {
                ForEach(orderedMembers) { member in
                    VStack(alignment: .leading, spacing: 6) {
                        HStack {
                            Label(member.name, systemImage: "person")
                            Spacer()
                            tagBadge(member.dietaryTag)
                        }
                        HStack {
                            Text("1 × \(member.drink)")
                            Spacer()
                            Text(member.price, format: .currency(code: "USD"))
                        }
                        .font(.subheadline)
                        Text("\(member.size) · \(member.temperature) · \(member.milk) · \(member.whip)")
                            .font(.caption).foregroundStyle(CoffeeStyle.muted)
                    }
                    if member.id != orderedMembers.last?.id { Divider() }
                }
            }
            .font(.caption)
            .padding(13)
            .background(.white, in: RoundedRectangle(cornerRadius: 17))
            Label("Dietary labels are not a guarantee of allergen safety. Shared equipment may cause cross-contact. Confirm ingredients and preparation with a barista.", systemImage: "info.circle")
                .font(.caption2).foregroundStyle(CoffeeStyle.muted)
            pickupCard
            priceCard(items: orderedMembers)
        }
    }

    private var pickupCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            Label {
                VStack(alignment: .leading, spacing: 3) {
                    Text("Starbucks UTD").font(.caption.bold())
                    Text("Student Union · Pickup counter").font(.caption2).foregroundStyle(CoffeeStyle.muted)
                    Text("Ready in 10 min").font(.caption2.bold()).foregroundStyle(CoffeeStyle.green)
                }
            } icon: {
                Image(systemName: "mappin.circle").foregroundStyle(CoffeeStyle.green)
            }
            Divider()
            Label {
                VStack(alignment: .leading, spacing: 3) {
                    Text("Visa ending 1234").font(.caption.bold())
                    Text("Payment method").font(.caption2).foregroundStyle(CoffeeStyle.muted)
                }
            } icon: {
                Image(systemName: "creditcard").foregroundStyle(CoffeeStyle.green)
            }
        }
        .padding(13)
        .background(.white, in: RoundedRectangle(cornerRadius: 17))
    }

    private func priceCard(items: [GroupMember]) -> some View {
        let sum = items.reduce(0) { $0 + $1.price }
        return VStack(spacing: 7) {
            summaryLine("Subtotal · \(items.count) drinks", sum.formatted(.currency(code: "USD")))
            summaryLine("Estimated tax", (sum * 0.0825).formatted(.currency(code: "USD")))
            Divider()
            HStack {
                Text("Total").font(.headline)
                Spacer()
                Text((sum * 1.0825).formatted(.currency(code: "USD"))).font(.headline)
            }
        }
        .padding(13)
        .background(.white, in: RoundedRectangle(cornerRadius: 17))
    }

    @ViewBuilder
    private var bottomActions: some View {
        if screen == .home {
            primaryButton("Start with Person A", icon: "arrow.right") {
                let next = members.firstIndex(where: { !$0.added }) ?? 0
                beginCustomization(for: next, groupFlow: true)
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 10)
        } else if screen == .customize {
            primaryButton("Add to cart · \(members[editingMember].price.formatted(.currency(code: "USD")))", icon: "bag") {
                members[editingMember].size = selectedSize
                members[editingMember].temperature = selectedTemperature
                members[editingMember].milk = selectedMilk
                members[editingMember].added = true
                if members[editingMember].dietaryTag == "Vegan", members[editingMember].whip != "Vegan whip" {
                    showConflict = true
                } else {
                    screen = .orderSummary
                }
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 10)
        } else if screen == .orderSummary {
            VStack(spacing: 4) {
                primaryButton(orderSummaryButtonTitle, icon: "arrow.right") {
                    if let next = groupNextMember {
                        beginCustomization(for: next, groupFlow: true)
                    } else if isGroupFlow {
                        screen = .groupSummary
                        activeTab = "Orders"
                    } else {
                        submitOrder()
                    }
                }
                Button("Cancel") { screen = .home; activeTab = "Home" }
                    .font(.caption.bold()).foregroundStyle(CoffeeStyle.green).padding(.top, 5)
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 8)
        } else if screen == .groupSummary {
            VStack(spacing: 4) {
                primaryButton("Pay & submit group · \((subtotal * 1.0825).formatted(.currency(code: "USD")))", icon: nil) {
                    submitOrder()
                }
                Button("Cancel") { screen = .home; activeTab = "Home" }
                    .font(.caption.bold()).foregroundStyle(CoffeeStyle.green).padding(.top, 5)
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 8)
        } else if screen == .profile {
            primaryButton("Save preferences", icon: nil) {
                activeTab = "Home"
                screen = .home
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 10)
        }
    }

    private var groupNextMember: Int? {
        guard isGroupFlow else { return nil }
        return members.indices.first(where: { !members[$0].added })
    }

    private var orderSummaryButtonTitle: String {
        guard isGroupFlow else {
            return "Pay & submit · \((members[editingMember].price * 1.0825).formatted(.currency(code: "USD")))"
        }
        if let next = groupNextMember {
            return "Continue with \(members[next].name)"
        }
        return "Review group order"
    }

    private var tabBar: some View {
        HStack(spacing: 0) {
            tab("Home", icon: "house")
            tab("Menu", icon: "cup.and.saucer")
            tab("Orders", icon: "receipt")
            tab("Profile", icon: "person")
        }
        .padding(.top, 9)
        .padding(.bottom, 5)
        .background(.white)
        .overlay(alignment: .top) { CoffeeStyle.line.frame(height: 0.5) }
    }

    private var dietarySheet: some View {
        VStack(alignment: .leading, spacing: 10) {
            Label("Set dietary tags", systemImage: "person.badge.plus")
                .font(.headline).foregroundStyle(CoffeeStyle.green)
            Text("Checks apply to each person's drink.")
                .font(.caption).foregroundStyle(CoffeeStyle.muted)
            ForEach(members.indices, id: \.self) { index in
                HStack {
                    Text(members[index].name).font(.subheadline.bold())
                    Spacer()
                    Menu {
                        ForEach(["Vegan", "Gluten-free", "Nut allergy", "None"], id: \.self) { tag in
                            Button(tag) { draftTags[index] = tag }
                        }
                    } label: {
                        Text(draftTags[index])
                            .font(.caption.bold()).foregroundStyle(CoffeeStyle.green)
                            .padding(.horizontal, 10).padding(.vertical, 6)
                            .background(CoffeeStyle.greenSoft, in: Capsule())
                    }
                }
                .padding(.vertical, 5)
                if index < members.count - 1 { Divider() }
            }
            Text("Ask your group member before selecting. These preferences apply to their drink only.")
                .font(.caption2).foregroundStyle(CoffeeStyle.muted)
            HStack {
                Button("Cancel") { showDietarySheet = false }
                    .buttonStyle(.bordered).tint(CoffeeStyle.green)
                Spacer()
                Button("Confirm tags") {
                    for index in members.indices { members[index].dietaryTag = draftTags[index] }
                    showDietarySheet = false
                }
                .buttonStyle(.borderedProminent).tint(CoffeeStyle.green)
            }
        }
        .padding(22)
    }

    private func header(_ title: String, subtitle: String) -> some View {
        HStack(spacing: 11) {
            Button {
                screen = .home
                activeTab = "Home"
            } label: {
                Image(systemName: "arrow.left")
                    .foregroundStyle(CoffeeStyle.green)
                    .frame(width: 34, height: 34)
                    .background(.white, in: Circle())
            }
            .buttonStyle(.plain)
            VStack(alignment: .leading, spacing: 3) {
                Text(title).font(.title3.bold())
                Text(subtitle).font(.caption2).foregroundStyle(CoffeeStyle.muted)
            }
            Spacer()
        }
        .padding(.bottom, 2)
    }

    private func tagBadge(_ tag: String) -> some View {
        Text(tag)
            .font(.system(size: 9, weight: .semibold))
            .foregroundStyle(tag == "Nut allergy" ? Color(red: 0.58, green: 0.37, blue: 0.16) : CoffeeStyle.green)
            .padding(.horizontal, 7)
            .padding(.vertical, 4)
            .background(tag == "Nut allergy" ? Color(red: 0.99, green: 0.94, blue: 0.87) : CoffeeStyle.greenSoft, in: Capsule())
    }

    private func choiceSection(_ title: String, options: [String], selection: Binding<String>) -> some View {
        VStack(alignment: .leading, spacing: 7) {
            Text(title).font(.caption.bold())
            HStack(spacing: 7) {
                ForEach(options, id: \.self) { option in
                    Button(option) { selection.wrappedValue = option }
                        .font(.caption)
                        .foregroundStyle(selection.wrappedValue == option ? CoffeeStyle.green : CoffeeStyle.muted)
                        .padding(.horizontal, 11)
                        .padding(.vertical, 8)
                        .background(selection.wrappedValue == option ? CoffeeStyle.greenSoft : .white, in: Capsule())
                        .overlay(Capsule().stroke(selection.wrappedValue == option ? CoffeeStyle.green.opacity(0.6) : CoffeeStyle.line))
                }
            }
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(.white, in: RoundedRectangle(cornerRadius: 16))
    }

    private func summaryLine(_ title: String, _ value: String) -> some View {
        HStack {
            Text(title).foregroundStyle(CoffeeStyle.muted)
            Spacer()
            Text(value)
        }
        .font(.caption)
    }

    private func primaryButton(_ title: String, icon: String?, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 8) {
                if let icon { Image(systemName: icon) }
                Text(title)
            }
            .font(.subheadline.bold())
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity, minHeight: 46)
            .background(CoffeeStyle.green, in: Capsule())
        }
        .buttonStyle(.plain)
    }

    private func tab(_ title: String, icon: String) -> some View {
        Button {
            activeTab = title
            switch title {
            case "Home": screen = .home
            case "Menu": screen = .menu
            case "Orders": screen = .groupSummary
            default:
                draftTags = members.map(\.dietaryTag)
                screen = .profile
            }
        } label: {
            VStack(spacing: 3) {
                Image(systemName: icon)
                    .font(.system(size: 17))
                    .overlay {
                        if title == "Orders" {
                            Text("$")
                                .font(.system(size: 7, weight: .bold))
                        }
                    }
                Text(title).font(.system(size: 9))
            }
            .foregroundStyle(activeTab == title ? CoffeeStyle.green : CoffeeStyle.muted)
            .frame(maxWidth: .infinity)
        }
        .buttonStyle(.plain)
    }

    private func beginCustomization(for index: Int, groupFlow: Bool) {
        editingMember = index
        isGroupFlow = groupFlow
        selectedSize = members[index].size
        selectedTemperature = members[index].temperature
        selectedMilk = members[index].milk
        screen = .customize
    }

    private func submitOrder() {
        for index in members.indices { members[index].added = false }
        isGroupFlow = false
        screen = .home
        activeTab = "Home"
        showConfirmation = true
    }
}

#Preview {
    ContentView()
}
