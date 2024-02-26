interface AppConfig {
    apiBaseUrl: string;
  }

export const loadAppConfig = async (): Promise<AppConfig> => {
    // Adjust the path to be relative to the base URL of the served site
    const response = await fetch('/config.json');
    if (!response.ok) {
      throw new Error('Failed to load app configuration.');
    }
    return response.json();
  };