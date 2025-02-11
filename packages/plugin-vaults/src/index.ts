import { Plugin } from "@elizaos/core";
import { analyzeVaultAndAddContext } from "./actions/analyzeVault";
import { createVault } from "./actions/vaultCreate";

export const vaultsPlugin: Plugin = {
    name: "vaults",
    description: "Plugin for interacting with vaults",
    actions: [
        analyzeVaultAndAddContext,
        createVault,
    ],
    // evaluators analyze the situations and actions taken by the agent. they run after each agent action
    // allowing the agent to reflect on what happened and potentially trigger additional actions or modifications
    evaluators: [],
    // providers supply information and state to the agent's context, help agent access necessary data
    providers: [],
};
export default vaultsPlugin;