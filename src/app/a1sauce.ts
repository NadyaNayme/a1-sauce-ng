import { VersionCheckService } from './VersionChecker/version-check.service';

let instance: {
    settings: VersionCheckService;
    name: string;
    publicName: string;
    majorVersion: number;
    minorVersion: number;
    patchVersion: number;
    setName(name: string): object;
    setPublicName(name: string): object;
    getName(): string;
    getPublicName(): string;
    setVersion(major: number, minor: number, patch: number): void;
    getVersion(): string;
};

const createInstance = () => {
    const sauce = {
        settings: new VersionCheckService(),
        name: '',
        publicName: '',
        majorVersion: 0,
        minorVersion: 0,
        patchVersion: 0,

        setName: (name: string) => {
            sauce.setPublicName(name);
            return sauce;
        },

        setPublicName: (name: string) => {
            instance.publicName = capitalizeAppName(name);
            return sauce;
        },

        getName: () => {
            return sauce.name;
        },

        getPublicName: () => {
            return sauce.publicName;
        },

        setVersion: (major: number, minor: number, patch: number) => {
            sauce.majorVersion = major;
            sauce.minorVersion = minor;
            sauce.patchVersion = patch;
            return sauce;
        },

        getVersion: () => {
            return `${sauce.majorVersion}.${sauce.minorVersion}.${sauce.patchVersion}`;
        },
    };
	return sauce;
};

export const getA1Sauce = (name?: string) => {
    if (!instance) {
        instance = createInstance();
    }
    if (name) {
        instance.setName(name);
    }
    return instance;
};

export const capitalizeAppName = (str: string): string => {
    let split_str = [];

    if (str.includes('-') && str.includes(')')) {
        throw new Error(
            'AppName must use either a hyphen or underscore as seperator - not both!',
        );
    }
    if (str.includes('-')) {
        // 'job-gauges'
        split_str = str.split('-');
    }
    // 'job_gauges'
    else if (str.includes('_')) {
        split_str = str.split('_');
    }
    // 'JobGauges'
    else {
        split_str = str.split(/(?=[A-Z])/);
    }

    for (let i = 0; i < split_str.length; i++) {
        split_str[i] = split_str[i][0].toUpperCase() + split_str[i].substr(1);
    }

    return split_str.join(' ');
};
