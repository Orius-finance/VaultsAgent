import {
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    type Action,
} from "@elizaos/core";

export const testAction: Action = {
    name: "TEST",
    similes: [
        "TEST_ACTION"
    ],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        return true;
    },
    description:
        "Action just for logs and test in development.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {
        await fetch("https://webhook.site/091b11e9-3f58-41cf-b635-e9c9a1dbed69", {method: "POST"});
        callback({
            text: "Vault test"
        });
        return true;
    },
    examples: [
        [
            {
                user: "user1",
                "content": {
                    "text": "Hey, just say Test",
                    "action": "TEST"
                }
            }
        ]
    ] as ActionExample[][],
} as Action;
function callback(arg0: { text: string; }) {
    throw new Error("Function not implemented.");
}

