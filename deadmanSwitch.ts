import * as openpgp from 'openpgp';
import * as cron from 'node-cron';
import * as fs from 'fs-extra';
import { join } from 'path';

interface DeadmanSwitch {
    lastCheckIn: Date;
    timeoutDays: number;
    encryptedMessage: string;
    recipientPublicKey: string;
}

class DeadmanSwitchManager {
    private configPath: string;
    private switch: DeadmanSwitch;

    constructor(configPath: string) {
        this.configPath = configPath;
        this.switch = this.loadConfig();
    }

    private loadConfig(): DeadmanSwitch {
        if (fs.existsSync(this.configPath)) {
            return fs.readJSONSync(this.configPath);
        }
        return {
            lastCheckIn: new Date(),
            timeoutDays: 30,
            encryptedMessage: '',
            recipientPublicKey: ''
        };
    }

    private saveConfig(): void {
        fs.writeJSONSync(this.configPath, this.switch);
    }

    async setMessage(message: string, recipientPublicKey: string): Promise<void> {
        const encrypted = await openpgp.encrypt({
            message: await openpgp.createMessage({ text: message }),
            encryptionKeys: await openpgp.readKey({ armoredKey: recipientPublicKey })
        });

        this.switch.encryptedMessage = encrypted.toString();
        this.switch.recipientPublicKey = recipientPublicKey;
        this.saveConfig();
    }

    checkIn(): void {
        this.switch.lastCheckIn = new Date();
        this.saveConfig();
        console.log('Successfully checked in at:', this.switch.lastCheckIn);
    }

    async checkStatus(): Promise<void> {
        const now = new Date();
        const lastCheck = new Date(this.switch.lastCheckIn);
        const diffDays = (now.getTime() - lastCheck.getTime()) / (1000 * 3600 * 24);

        if (diffDays > this.switch.timeoutDays) {
            console.log('Deadman switch activated! Releasing message...');
            await this.releaseMessage();
        }
    }

    private async releaseMessage(): Promise<void> {
        if (!this.switch.encryptedMessage) {
            console.log('No message to release');
            return;
        }

        const releasePath = join(__dirname, 'released_message.pgp');
        await fs.writeFile(releasePath, this.switch.encryptedMessage);
        console.log(`Message released and saved to ${releasePath}`);
    }

    setTimeoutDays(days: number): void {
        this.switch.timeoutDays = days;
        this.saveConfig();
    }
}

// Usage example
const main = async () => {
    const switch = new DeadmanSwitchManager('./deadman-config.json');
    
    // Set up daily check for the switch status
    cron.schedule('0 0 * * *', () => {
        switch.checkStatus();
    });

    // Example public key (replace with actual recipient's public key)
    const recipientPublicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
    ... (insert public key here)
    -----END PGP PUBLIC KEY BLOCK-----`;

    // Set up the encrypted message
    await switch.setMessage(
        'This is a secret message that will be released if I don\'t check in.',
        recipientPublicKey
    );

    // Set timeout to 30 days
    switch.setTimeoutDays(30);

    // Simulate check-in
    switch.checkIn();
};

main().catch(console.error);