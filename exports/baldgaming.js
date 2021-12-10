// made for baldgaming, who the fuck would've thonk
const StaffRanks = {
    Minecraft: "918818187586469888",
    DarkRP: "918818115364724757",
    Global: "918818069965574154",
    Janitor: "914900820695351297", // 914900820695351297 - janitor
    Admin: "914900554692587520",
    Owner: "914900362639577088"
}

exports.BaldGaming = {
    StaffRanks: StaffRanks, // i hate this more than you can know...
    AccessLevels: {
        mod: [StaffRanks["Janitor"], StaffRanks["Admin"], StaffRanks["Owner"]],
        admin: [StaffRanks["Admin"], StaffRanks["Owner"]],
        owner: [StaffRanks["Owner"]]
    }
}