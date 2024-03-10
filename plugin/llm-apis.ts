import { Anthropic } from '@anthropic-ai/sdk';
import { ChatCompletionAssistantMessageParam } from 'openai/resources';
import { OpenAI } from 'openai';

interface LLMAPI {
    query: (messages: Array<string>, model: string, temperature: number) => Promise<string>;
    handleResponse: (response: Response) => ReadableStream;
}

class OpenAIAPI implements LLMAPI {
    private openai: OpenAI;

    constructor(apiKey: string) {
        this.openai = new OpenAI(apiKey);
    }

    async query(messages: Array<string>, model: string, temperature: number = 0.7): Promise<string> {
        try {
            const response = await this.openai.chat.completions.create({
                model: model,
                messages: messages,
                temperature: temperature,
                max_tokens: 1024,
            });
            return response.choices[0].text.trim();
        } catch (error) {
            console.error("Error querying OpenAI:", error);
            throw new Error("Failed to query OpenAI");
        }
    }

    handleResponse(response: Response): ReadableStream {
        if (!response.body) {
            throw new Error("Response body is null");
        }
        return response.body;
    }
}
