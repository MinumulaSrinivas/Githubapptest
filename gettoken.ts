import { getInput } from "@actions/core";
import { getOctokit } from "@actions/github";
import { createAppAuth } from '@octokit/auth-app';
import { request } from '@octokit/request';

const inputName = getInput("name");
greet(inputName);
function greet(name: string) {
    console.log(`'Hello ${name}'`);
}
export const fetchInstallationToken = async ({ appId,
                                                installationId,
                                                owner,
                                                permissions,
                                                privateKey,
                                                repo,
                                                apiUrl,
    }: Readonly<{
        appId: string;
        installationId?: number;
        owner: string;
        permissions?: Record<string, string>;
        privateKey: string;
        repo: string;
        apiUrl: string;
    }>): Promise<string> => {
        const app = createAppAuth({
            appId,
            privateKey,
            request: request.defaults({
                baseUrl: apiUrl,
            }),
        });
        if (installationId == undefined) {
            const authApp = await app({ type: "app" });
            const octokit = getOctokit(authApp.token);
            try {
                ({
                    data: { id: installationId },

                } = await octokit.rest.apps.getRepoInstallation({ owner, repo }));
            } catch (error) {
                throw new Error("Could not get the repo installation. is the app installed on this repo?");
            }
        }
        const installation = await app({
            installationId,
            permissions,
            type: "installation",
        });
        console.log(`'Hello'`);
        return installation.token;
    };
