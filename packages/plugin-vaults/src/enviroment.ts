import { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const vaultsEnvSchema = z
    .object({
        EVM_PROVIDER_URL_BASE: z.string().optional(),
        EVM_PROVIDER_URL_BASE_SEPOLIA: z.string().optional(),
        IS_TESTNET: z.string(),
    })
    .refine(
        (data) =>
            !!data.EVM_PROVIDER_URL_BASE || !!data.EVM_PROVIDER_URL_BASE_SEPOLIA,
        {
            message:
                "Either EVM_PROVIDER_URL_BASE or EVM_PROVIDER_URL_BASE_SEPOLIA must be provided",
            path: ["EVM_PROVIDER_URL_BASE", "EVM_PROVIDER_URL_BASE_SEPOLIA"],
        }
    );

export type vaultsConfig = z.infer<typeof vaultsEnvSchema>;

export async function validateVaultsConfig(
    runtime: IAgentRuntime
): Promise<vaultsConfig> {
    try {
        const config = {
            EVM_PROVIDER_URL_BASE_SEPOLIA: runtime.getSetting("EVM_PROVIDER_URL_BASE_SEPOLIA"),
            EVM_PROVIDER_URL_BASE: runtime.getSetting("EVM_PROVIDER_URL_BASE"),
            IS_TESTNET: runtime.getSetting("IS_TESTNET"),
        };
        console.log('config: ', config)
        return vaultsEnvSchema.parse(config);
    } catch (error) {
        console.log("error::::", error)
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Vaults API configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}