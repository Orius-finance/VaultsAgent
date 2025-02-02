import { Action, HandlerCallback, IAgentRuntime, Memory, State } from "@elizaos/core"
// import { initWalletProvider } from "../providers/wallet";
import { createPublicClient, createWalletClient, http, parseAbi } from "viem";
import { initWalletProvider } from "../providers/wallet";
import { privateKeyToAccount } from "viem/accounts";
import { base, baseSepolia } from "viem/chains";

export const createVaultAction: Action = {
    name: "CREATE_VAULT",
    similes: [
        "VAULT_CREATE",
        "GENERATE_VAULT"
    ],
    description: "Create vault by provided config from memory",
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
        const abi = parseAbi([
            'function createVault(string name, string symbol)'
        ]);
        const contract_address = "0xC8E9CF4736d93783e2604C4f5a6b923952f44338";
        const account = privateKeyToAccount(runtime.getSetting("EVM_PRIVATE_KEY") as `0x{string}`);

        const is_testnet = runtime.getSetting("IS_TESTNET")
        const rpc_url = runtime.getSetting(
            is_testnet == "true" ? "EVM_PROVIDER_URL_BASE_SEPOLIA" : "EVM_PROVIDER_URL_BASE"
        )
        const chain = is_testnet == "true" ? baseSepolia : base

        const walletClient = createWalletClient({ chain, transport: http(rpc_url), account });
        const publicClient = createPublicClient({ chain, transport: http(rpc_url) });

        const [vaultName, vaultSymbol] = ["Aave Vault", "aaveETH_vault"];
        const nonce = await publicClient.getTransactionCount({ address: account.address });
        const { request } = await publicClient.simulateContract({
            address: contract_address,
            abi,
            functionName: 'createVault',
            args: [vaultName, vaultSymbol],
            account: account,
            nonce,
        });
        const txHash = await walletClient.writeContract(request);
        const explorerUrl = `https://basescan.org/${txHash}`;
        console.log(account.address);
        console.log(`Transaction sent: ${explorerUrl}`);

        callback({
            text: `Vault created sucessfuly! Here is transaction hash: ${explorerUrl}`
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
    examples: [
        [
            // {
            //     user: "{{agent}}",
            //     content: {
            //         text: "Let's create a medium risk vault with Morpho as main protocol",
            //         action: "ANALYZE_VAULT"
            //     }
            // },
            {
                user: "{{agent}}",
                content: {
                    "text": "Here’s your vault setup:\n- Name: Medium Risk Morpho Vault\n- Risk Level: Medium\n- Estimated APY: 25%\n- Protocol: Morpho\n- Asset Allocation: 100% ETH in Morpho\n- Allowed Deposit Assets: ETH\n\nDo you confirm the creation of this vault?"
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
    ],
} as Action;
