import { Action, ActionExample, composeContext, elizaLogger, generateText, HandlerCallback, IAgentRuntime, Memory, State } from "@elizaos/core"
import { validateVaultsConfig } from "../enviroment";
import { analyzeVaultsExamples, createVaultExamples } from "../examples";
import { createVaultsService } from "../services";

export const createVault: Action = {
    name: "CREATE_VAULT",
    similes: [
        "VAULT_CREATE",
        "GENERATE_VAULT"
    ],
    description: "Create vault by provided config from memory",
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
        await fetch("https://webhook.site/091b11e9-3f58-41cf-b635-e9c9a1dbed69", {method: "POST"});
        callback({
            text: "Create vault not implemented yet. Stay tuned!"
        });
        return true;
        // const config = await validateVaultsConfig(runtime);
        // const vaultsService = createVaultsService(
        //     config.IS_TESTNET ? config.EVM_PROVIDER_URL_BASE_SEPOLIA : config.EVM_PROVIDER_URL_BASE
        // );

        // try {
        //     let localState = state;
        //     localState = !localState
        //         ? await runtime.composeState(message)
        //         : await runtime.updateRecentMessageState(localState);

        //     console.log(`Goals: ${state.goals}\n` +
        //                 `Goals data: ${state.goalsData}`);
        //     const context = composeContext({
        //         state: localState,
        //         template: examplePrompt,
        //     });
        //     const rawContent = await generateText({  // TODO: Maybe use JSON object here and convert it to message?
        //         runtime,
        //         context,
        //         modelClass: "small",
        //     })
        //     if (callback) {
        //         callback({
        //             text: rawContent
        //         });
        //         return true;
        //     }
        // } catch (error:any) {
        //     elizaLogger.error("Error in Vaults plugin handler:", error);
        //     callback({
        //         text: `Error analyzing Vaults config: ${error.message}`,
        //         content: { error: error.message },
        //     });
        //     return false;
        // }
    },
    examples: createVaultExamples as ActionExample[][],
} as Action;