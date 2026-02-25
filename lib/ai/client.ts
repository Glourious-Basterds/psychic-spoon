import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export const SYSTEM_PROMPT = (projectTitle: string) => `Sei un assistente di produzione per il progetto "${projectTitle}".
Il tuo compito è supportare il coordinamento e l'organizzazione del lavoro.
Non generare contenuto narrativo, creativo o di storia a meno che il project leader non lo abbia esplicitamente richiesto in questa sessione.
Rispondi sempre in italiano.`;

export async function callClaude(prompt: string, projectTitle: string = 'Hashi') {
    const message = await anthropic.messages.create({
        model: 'claude-opus-4-5',
        max_tokens: 2048,
        system: SYSTEM_PROMPT(projectTitle),
        messages: [{ role: 'user', content: prompt }],
    });
    const content = message.content[0];
    return content.type === 'text' ? content.text : '';
}

export const prompts = {
    summarizeMeeting: (transcript: string) =>
        `Sintetizza questa trascrizione di riunione in un elenco chiaro di:\n1. Decisioni prese\n2. Action items con responsabile se menzionato\n3. Punti aperti da risolvere\n\nTrascrizione:\n${transcript}`,

    reviewFeedback: (feedbacks: string[]) =>
        `Sintetizza questi commenti di revisione in una review strutturata con punti di forza, aree di miglioramento e prossimi passi:\n\n${feedbacks.join('\n---\n')}`,

    suggestWorkflow: (projectData: { format: string; description: string; teamSize: number }) =>
        `Suggerisci una struttura di workflow per questo progetto:\nFormato: ${projectData.format}\nDescrizione: ${projectData.description}\nDimensione team: ${projectData.teamSize} persone\n\nFornisci le fasi di produzione con durate stimate e milestone chiave.`,

    projectReport: (projectData: string) =>
        `Genera un report di chiusura progetto in italiano con: attività completate, contributi dei membri, note di produzione, e lessons learned.\n\nDati progetto:\n${projectData}`,
};
