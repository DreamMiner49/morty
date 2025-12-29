// Utility functions for saving/loading scenarios to/from localStorage

const STORAGE_KEY = 'housing-calculator-scenarios';

// Get all saved scenarios
export const getAllScenarios = () => {
  try {
    const scenarios = localStorage.getItem(STORAGE_KEY);
    return scenarios ? JSON.parse(scenarios) : [];
  } catch (error) {
    console.error('Error loading scenarios:', error);
    return [];
  }
};

// Save a new scenario
export const saveScenario = (name, scenarioData) => {
  try {
    const scenarios = getAllScenarios();
    const newScenario = {
      id: Date.now().toString(),
      name,
      data: scenarioData,
      savedAt: new Date().toISOString(),
    };
    scenarios.push(newScenario);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
    return newScenario;
  } catch (error) {
    console.error('Error saving scenario:', error);
    throw error;
  }
};

// Load a specific scenario by ID
export const loadScenario = (id) => {
  try {
    const scenarios = getAllScenarios();
    return scenarios.find((scenario) => scenario.id === id);
  } catch (error) {
    console.error('Error loading scenario:', error);
    return null;
  }
};

// Delete a scenario by ID
export const deleteScenario = (id) => {
  try {
    const scenarios = getAllScenarios();
    const filtered = scenarios.filter((scenario) => scenario.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting scenario:', error);
    return false;
  }
};

// Export all scenarios as JSON
export const exportScenarios = () => {
  const scenarios = getAllScenarios();
  const dataStr = JSON.stringify(scenarios, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `housing-calculator-scenarios-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

// Import scenarios from JSON file
export const importScenarios = (jsonString) => {
  try {
    const importedScenarios = JSON.parse(jsonString);
    const existingScenarios = getAllScenarios();
    const merged = [...existingScenarios, ...importedScenarios];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged.length;
  } catch (error) {
    console.error('Error importing scenarios:', error);
    throw error;
  }
};
