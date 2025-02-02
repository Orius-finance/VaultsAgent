import { ActionExample } from "@elizaos/core";

export const analyzeVaultsExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                "text": "Create a medium-risk vault using Morpho protocol",
                action: "ANALYZE_VAULT"
            }
        },
        // {
        //     user: "{{agent}}",
        //     content: {
        //         "text": "Here’s your vault setup:\n- Name: Medium Risk Morpho Vault\n- Risk Level: Medium\n- Estimated APY: 25%\n- Protocol: Morpho\n- Asset Allocation: 100% ETH in Morpho\n- Allowed Deposit Assets: ETH\n\nDo you confirm the creation of this vault? (This question is very improtant and required to ask user)",
        //         "action": "ANALYZE_VAULT"
        //     }
        // },
    ]
]

export const createVaultExamples: ActionExample[][] = [
    [
        {
            user: "{{agent}}",
            content: {
                "text": "Here’s your vault setup:\n- Name: Medium Risk Morpho Vault\n- Risk Level: Medium\n- Estimated APY: 25%\n- Protocol: Morpho\n- Asset Allocation: 100% ETH in Morpho\n- Allowed Deposit Assets: ETH\n\nDo you confirm the creation of this vault? (This question is very improtant and required to ask user)"
            }
        },
        {
            user: "{{user1}}",
            content: {
                "text": "Yes, confirm. Let's create it.",
                action: "CREATE_VAULT"
            }
        },
        {
            user: "{{agent}}",
            content: {
                "text": "A vault with a medium-risk profile has been created successfully!\nContract Address: 0x0000000000000000000000000000000000000000\nYou can now deposit into this vault through the dashboard."
            }
        }
    ]
]


// [
//     {
//         "user": "{{user1}}",
//         "content": {
//             "text": "What can you do?"
//         }
//     },
//     {
//         "user": "VaultAI",
//         "content": {
//             "text": "I help create and manage DeFi vaults with automated rebalancing based on real-time market data. Tell me what kind of vault you need."
//         }
//     },
//     {
//         "user": "{{user1}}",
//         "content": {
//             "text": "I want a medium-risk vault using Morpho protocol. I have 1 ETH to deposit."
//         }
//     },
//     {
//         "user": "VaultAI",
//         "content": {
//             "text": "Here’s your vault setup:\n- Name: Medium Risk Morpho Vault\n- Risk Level: Medium\n- Estimated APY: 25%\n- Protocol: Morpho\n- Asset Allocation: 100% ETH in Morpho\n- Allowed Deposit Assets: ETH\n\nDo you confirm the creation of this vault? (This question is very improtant and required to ask user)",
//             "action": "ANALYZE_VAULT"
//         }
//     },
//     {
//         "user": "{{user1}}",
//         "content": {
//             "text": "Yes, confirm. Let's create it."
//         }
//     },
//     {
//         "user": "VaultAI",
//         "content": {
//             "text": "A vault with a medium-risk profile has been created successfully!\nContract Address: 0x0000000000000000000000000000000000000000\nYou can now deposit into this vault through the dashboard.",
//             "action": "CREATE_VAULT"
//         }
//     }
// ],