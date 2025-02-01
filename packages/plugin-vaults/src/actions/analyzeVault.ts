import { Action, ActionExample, composeContext, elizaLogger, generateText, HandlerCallback, IAgentRuntime, Memory, State } from "@elizaos/core"
import { validateVaultsConfig } from "../enviroment";
import { analyzeVaultsExamples } from "../examples";
import { createVaultsService } from "../services";

// TODO: Add wallet context to all messages for better analysis
const examplePrompt = `
Extend this user provided data about vault.
We have this protocol data. Not from user, external data:
[
    {
        "name": "Aave",
        "tvl": 40000000,
    }
]

Give us the best match with user prefered parametrs and protocols in this format:
\`\`\`
Okay, here is your vault config:
- Name: <generate short name based on main parameters>
- Risk type: <evaluate risk type based on protocols. Can be: {Low risk, Medium risk, High risk}>
- Estimated APY: <APY>%
- Protocols: <protocol1>, <protocols2> ...
- Protocols distribution: <For example: 10% in Aave, 90% in Morpho>
- Allowed deposit assets: ETH

Do you confirm creation of this vault?
\`\`\`

You need to analyze according this user messages. Last part of conversation:
{{recentMessages}}
`

export const analyzeVaultAndAddContext: Action = {
    name: "ANALYZE_VAULT",
    similes: [
        "VAULT_CONTEXT",
        "GENERATE_VAULT_CONFIG"
    ],
    description: "Analyze users prompt and create vault config.",
    validate: async (runtime: IAgentRuntime) => {
        await validateVaultsConfig(runtime);
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {

        const config = await validateVaultsConfig(runtime);
        const vaultsService = createVaultsService(
            config.IS_TESTNET ? config.EVM_PROVIDER_URL_BASE_SEPOLIA : config.EVM_PROVIDER_URL_BASE
        );

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
            const rawContent = await generateText({  // TODO: Maybe use JSON object here and convert it to message?
                runtime,
                context,
                modelClass: "small",
            })
            elizaLogger.log(`Successfuly created response for analyze vault: ${rawContent}`);
            // const MarsRoverData = await nasaService.getMarsRoverPhoto();
            if (callback) {
                callback({
                    text: rawContent
                });
                return true;
            }
        } catch (error:any) {
            elizaLogger.error("Error in Vaults plugin handler:", error);
            callback({
                text: `Error analyzing Vaults config: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: analyzeVaultsExamples as ActionExample[][],
} as Action;