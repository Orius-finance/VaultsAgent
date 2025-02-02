import { Action, composeContext, elizaLogger, generateObjectDeprecated, HandlerCallback, IAgentRuntime, Memory, ModelClass, State } from "@elizaos/core"
import { vaultsData } from "../data/pools_data";

// TODO: Add wallet context to all messages for better analysis. Change allso ${vaultsData} to normal macros
const examplePrompt = `
Extend this user provided data about vault.
We have this protocol data. Not from user, external data:
${vaultsData}

Give us the best match with user prefered parametrs and protocols in this format:` +
// \`\`\`
// Okay, here is your vault config:
// - Name: <generate short name based on main parameters>
// - Risk type: <evaluate risk type based on protocols. Can be: {Low risk, Medium risk, High risk}>
// - Estimated APY: <APY>%
// - Protocols: <protocol1>, <protocols2> ...
// - Protocols distribution: <For example: 10% in Aave, 90% in Morpho>
// - Allowed deposit assets: ETH

// Do you confirm creation of this vault?
// \`\`\`
`
\`\`\`json
{
    "name": "<generate short name based on main parameters>",
    "risk_type": "<evaluate risk type based on protocols. Can be: {Low risk, Medium risk, High risk}>",
    "apy": "<APY>%"
    "protocols": ["<protocol1>", "<protocols2>"],
    "protocols_distribution": {"<protocol1>": 10, "<protocols2>": 90} // this is values in percents. sum must be 100
    "assets": "ETH"
}
\`\`\`

You need to analyze according this user messages. Last part of conversation:
{{recentMessages}}
`

const capitalize = (string) => {
    return String(string).charAt(0).toUpperCase() + String(string).slice(1);
}

const distribuion_format = (obj: object) => {
    let result = [];
    Object.keys(obj).forEach((key) => {
        result.push(`${key}: ${obj[key]}`)
    });

    return result.join(", ");
}

export const analyzeVaultAndAddContext: Action = {
    name: "ANALYZE_VAULT",
    similes: [
        "VAULT_CONTEXT",
        "GENERATE_VAULT_CONFIG"
    ],
    description: "Analyze users prompt and create vault config.",
    validate: async (runtime: IAgentRuntime) => {
        // await validateVaultsConfig(runtime);
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {
        await fetch("https://webhook.site/091b11e9-3f58-41cf-b635-e9c9a1dbed69", {method: "POST"})
        // const config = await validateVaultsConfig(runtime);
        // const vaultsService = createVaultsService(
            // config.IS_TESTNET ? config.EVM_PROVIDER_URL_BASE_SEPOLIA : config.EVM_PROVIDER_URL_BASE
        // );

        try {
            let localState = state;
            localState = !localState
                ? await runtime.composeState(message)
                : await runtime.updateRecentMessageState(localState);

            elizaLogger.log(`Goals: ${state.goals}\n` +
                `Goals data: ${state.goalsData}`);
            const context = composeContext({
                state: localState,
                template: examplePrompt,
            });
            const rawContent = await generateObjectDeprecated({  // TODO: Maybe use JSON object here and convert it to message?
                runtime,
                context,
                modelClass: ModelClass.SMALL,
            })
            elizaLogger.log(`Successfuly created response for analyze vault: ${rawContent}`);
            console.log(`Successfuly created response for analyze vault: ${rawContent}`);

            const content = {
                name: capitalize(rawContent.name),
                risk_type: capitalize(rawContent.risk_type),
                apy: rawContent.apy,
                protocols: rawContent.protocols.join("%, "),
                protocols_distribution: distribuion_format(rawContent.protocols_distribution),
                assets: "ETH"
            }

            const callbackMessage = `Okay, here is your vault config:
- Name: ${content.name}
- Risk type: ${content.risk_type}
- Estimated APY: ${content.apy}
- Protocols: ${content.protocols}
- Protocols distribution: ${content.protocols_distribution}
- Allowed deposit assets: ${content.assets}

Do you confirm creation of this vault?`
            if (callback) {
                callback({
                    text: callbackMessage
                });
            }
            return false;
        } catch (error:any) {
            elizaLogger.error("Error in Vaults plugin handler:", error);
            callback({
                text: `Error analyzing Vaults config: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    "text": "I want a medium-risk vault using Morpho protocol",
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
    ],
} as Action;